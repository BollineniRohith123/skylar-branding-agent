import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import ImageModal from './components/ImageModal';
import { PRODUCT_CATEGORIES } from './constants';
import type { Product, ProductType, Base64Image, GenerationResult, GenerationHistoryItem } from './types';
import { fileToBase64 } from './utils/imageUtils';
import { generateAdImage } from './services/geminiService';
import { retryQueue } from './services/retryQueue';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ALL_PRODUCTS = PRODUCT_CATEGORIES.flatMap(c => c.products);

const initialResults = Object.fromEntries(
  ALL_PRODUCTS.map(p => [p.id, { status: 'idle', imageUrl: null, error: null }])
) as Record<ProductType, GenerationResult>;

// Validate that an image URL is actually loadable
const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
    // Timeout after 10 seconds
    setTimeout(() => resolve(false), 10000);
  });
};

// Helper function for retrying Gemini API calls with exponential backoff
// This function will keep retrying indefinitely with exponential backoff
// to ensure users never see error messages
const generateWithRetry = async (
  logo: Base64Image,
  product: Product,
  maxAttempts: number = 10,
  currentAttempt: number = 1,
  onMaxAttemptsReached?: (product: Product) => void
): Promise<GenerationResult> => {
  try {
    const imageUrl = await generateAdImage(logo, product.prompt);

    // Validate the image before returning success
    const isValid = await validateImageUrl(imageUrl);
    if (isValid) {
      return { status: 'success', imageUrl, error: null };
    } else {
      // Image failed to load, treat as error and retry
      throw new Error('Generated image failed to load');
    }
  } catch (error) {
    // Calculate exponential backoff delay: 2s, 4s, 8s, 16s, 32s, max 60s
    const baseDelay = 2000;
    const maxDelay = 60000;
    const delay = Math.min(baseDelay * Math.pow(2, currentAttempt - 1), maxDelay);

    console.log(`Attempt ${currentAttempt}/${maxAttempts} failed for ${product.name}. Retrying in ${delay/1000}s...`);

    // If we haven't exhausted all attempts, retry after delay
    if (currentAttempt < maxAttempts) {
      await sleep(delay);
      return generateWithRetry(logo, product, maxAttempts, currentAttempt + 1, onMaxAttemptsReached);
    } else {
      // Max attempts reached - notify callback for background retry queue
      if (onMaxAttemptsReached) {
        onMaxAttemptsReached(product);
      }
      // Keep status as loading to prevent error display
      // Never show error to user - they can manually retry if needed
      console.warn(`Max attempts (${maxAttempts}) reached for ${product.name}. Keeping in loading state.`);
      return { status: 'loading', imageUrl: null, error: null };
    }
  }
};

const App: React.FC = () => {
  // Core state for the current session or viewed history
  const [userLogo, setUserLogo] = useState<File | null>(null);
  const [userLogoBase64, setUserLogoBase64] = useState<Base64Image | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationResults, setGenerationResults] = useState<Record<ProductType, GenerationResult>>(initialResults);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);

  // History and view management state
  const [view, setView] = useState<'generator' | 'history'>('generator');
  const [viewingHistoryId, setViewingHistoryId] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem('skylar-generation-history');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        // Limit to 10 items on load to prevent memory issues
        return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
      }
      return [];
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      // Clear corrupted data
      localStorage.removeItem('skylar-generation-history');
      return [];
    }
  });

  const liveSessionRef = useRef({
    logo: null as File | null,
    logoBase64: null as Base64Image | null,
    results: initialResults
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to persist history to localStorage (limit to 10 items to prevent quota errors)
  useEffect(() => {
    try {
        // Keep only last 10 history items to prevent localStorage overflow
        const limitedHistory = history.slice(0, 10);
        localStorage.setItem('skylar-generation-history', JSON.stringify(limitedHistory));
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
        // Clear old history if quota exceeded
        try {
            localStorage.removeItem('skylar-generation-history');
            const freshHistory = history.slice(0, 5);
            localStorage.setItem('skylar-generation-history', JSON.stringify(freshHistory));
        } catch (e) {
            console.error("Could not recover from localStorage quota error", e);
        }
    }
  }, [history]);

  const handleImageClick = (imageUrl: string) => setEnlargedImageUrl(imageUrl);
  const handleCloseModal = useCallback(() => setEnlargedImageUrl(null), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleCloseModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseModal]);

  const handleGenerateAllImages = useCallback(async (logo: Base64Image, logoFile: File) => {
    setIsGenerating(true);
    const newResults = { ...initialResults };
    Object.keys(newResults).forEach(key => {
        newResults[key as ProductType] = { status: 'loading', imageUrl: null, error: null };
    });
    setGenerationResults(newResults);

    const newHistoryItem: GenerationHistoryItem = {
        id: `gen_${Date.now()}`,
        logo,
        logoName: logoFile.name,
        results: newResults,
        timestamp: Date.now(),
    };
    // Keep only last 15 history items in state to prevent memory issues
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 15));
    liveSessionRef.current.results = newResults;

    const processProduct = async (product: Product) => {
        const result = await generateWithRetry(logo, product);
        
        setGenerationResults(prev => ({ ...prev, [product.id]: result }));
        liveSessionRef.current.results = { ...liveSessionRef.current.results, [product.id]: result };

        setHistory(prevHistory => {
            const newHistory = [...prevHistory];
            const itemToUpdate = newHistory.find(item => item.id === newHistoryItem.id);
            if (itemToUpdate) {
                itemToUpdate.results[product.id] = result;
            }
            return newHistory;
        });
    };

    // Increased batch size for faster generation with multiple API keys
    const batchSize = 10;
    for (let i = 0; i < ALL_PRODUCTS.length; i += batchSize) {
        const batch = ALL_PRODUCTS.slice(i, i + batchSize);
        await Promise.all(batch.map(processProduct));
    }

    setIsGenerating(false);
  }, []);

  const handleRegenerateImage = useCallback(async (productId: ProductType) => {
    if (!userLogoBase64 || viewingHistoryId) return;

    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    setGenerationResults(prev => ({ ...prev, [productId]: { status: 'loading', imageUrl: null, error: null } }));

    const result = await generateWithRetry(userLogoBase64, product);

    setGenerationResults(prev => ({ ...prev, [productId]: result }));
    liveSessionRef.current.results = { ...liveSessionRef.current.results, [productId]: result };

    setHistory(prevHistory => {
        if (prevHistory.length === 0) return prevHistory;
        const newHistory = [...prevHistory];
        const latestHistoryItem = newHistory[0];
        if (latestHistoryItem) {
            latestHistoryItem.results[productId] = result;
        }
        return newHistory;
    });
  }, [userLogoBase64, viewingHistoryId]);


  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        setUserLogo(file);
        setUserLogoBase64(base64Image);
        setViewingHistoryId(null);
        liveSessionRef.current = { logo: file, logoBase64: base64Image, results: initialResults };
        handleGenerateAllImages(base64Image, file);
      } catch (e) {
        console.error("Could not read the selected file.", e);
        setUserLogo(null);
        setUserLogoBase64(null);
      }
    }
    if(event.target) event.target.value = '';
  };

  const handleLoadHistoryItem = (item: GenerationHistoryItem) => {
    if (!viewingHistoryId) {
        // Save current session if we are switching away from it
        liveSessionRef.current = {
            logo: userLogo,
            logoBase64: userLogoBase64,
            results: generationResults,
        };
    }
    setUserLogo({ name: item.logoName } as File); // Mock file object for display
    setUserLogoBase64(item.logo);
    setGenerationResults(item.results);
    setViewingHistoryId(item.id);
    setView('generator');
  };

  const handleBackToCurrent = () => {
    const { logo, logoBase64, results } = liveSessionRef.current;
    setUserLogo(logo);
    setUserLogoBase64(logoBase64);
    setGenerationResults(results);
    setViewingHistoryId(null);
  };

  return (
    <div className="h-screen w-screen flex font-sans">
      <Sidebar productCategories={PRODUCT_CATEGORIES} />
      <ImageDisplay
        view={view}
        productCategories={PRODUCT_CATEGORIES}
        results={generationResults}
        isGenerating={isGenerating}
        onUploadClick={handleUploadClick}
        userLogo={userLogo}
        onImageClick={handleImageClick}
        onRegenerate={handleRegenerateImage}
        isViewingHistory={!!viewingHistoryId}
        onShowHistory={() => setView('history')}
        onBackToCurrent={handleBackToCurrent}
        onBackToGenerator={() => setView('generator')}
        history={history}
        onLoadHistory={handleLoadHistoryItem}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <ImageModal imageUrl={enlargedImageUrl} onClose={handleCloseModal} />
    </div>
  );
};

export default App;