import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import ImageModal from './components/ImageModal';
import { PRODUCT_CATEGORIES } from './constants';
import type { Product, ProductType, Base64Image, GenerationResult, GenerationHistoryItem } from './types';
import { fileToBase64 } from './utils/imageUtils';
import { generateAdImage } from './services/geminiService';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ALL_PRODUCTS = PRODUCT_CATEGORIES.flatMap(c => c.products);

const initialResults = Object.fromEntries(
  ALL_PRODUCTS.map(p => [p.id, { status: 'idle', imageUrl: null, error: null }])
) as Record<ProductType, GenerationResult>;

// Helper function for retrying Gemini API calls with fast retry
const generateWithRetry = async (
  logo: Base64Image,
  product: Product,
  attempts: number = 2
): Promise<GenerationResult> => {
  const isRateLimitError = (error: unknown): boolean =>
    error instanceof Error &&
    (error.message.toLowerCase().includes('resource_exhausted') ||
      error.message.includes('429') ||
      error.message.toLowerCase().includes('quota'));

  try {
    const imageUrl = await generateAdImage(logo, product.prompt);
    return { status: 'success', imageUrl, error: null };
  } catch (error) {
    if (isRateLimitError(error) && attempts > 1) {
      // Fast retry with minimal delay since geminiService already rotates keys
      await sleep(2000); // Only 2 seconds - geminiService handles key rotation
      return generateWithRetry(logo, product, attempts - 1);
    } else {
      let finalMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      
      // For non-rate-limit errors, silently retry instead of showing error to user
      if (!isRateLimitError(error) && attempts > 1) {
        await sleep(1000); // Brief pause before retry
        return generateWithRetry(logo, product, attempts - 1);
      } else if (isRateLimitError(error)) {
        finalMessage = "All API keys exhausted. Please wait and try again.";
      } else {
        // For other errors after all retries exhausted, show generic retry message
        finalMessage = "Generation failed. Click regenerate to try again.";
      }
      
      if (finalMessage.startsWith('Failed to generate image: ')) {
        // Clean up generic wrapper message from geminiService
        finalMessage = finalMessage.replace('Failed to generate image: ', '');
      }

      // If it's a quota/rate limit error, provide more specific guidance
      if (finalMessage.toLowerCase().includes('all api keys exhausted')) {
        finalMessage = "Service temporarily unavailable. Please wait a few minutes before trying again.";
      }
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
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Keep only last 10 history items in state to prevent memory issues
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));

    const processProduct = async (product: Product) => {
        try {
            const result = await generateWithRetry(logo, product);

            setGenerationResults(prev => ({ ...prev, [product.id]: result }));
        } catch (error) {
            // Handle errors gracefully - don't let one failed product break the entire batch
            const errorMessage = error instanceof Error ? error.message : 'Generation failed';
            const errorResult: GenerationResult = {
                status: 'error',
                imageUrl: null,
                error: errorMessage
            };

            setGenerationResults(prev => ({ ...prev, [product.id]: errorResult }));

            console.error(`Failed to generate image for ${product.name}:`, error);
        }
    };

    try {
        // Increased batch size for faster generation with multiple API keys
        const batchSize = 10;
        for (let i = 0; i < ALL_PRODUCTS.length; i += batchSize) {
            const batch = ALL_PRODUCTS.slice(i, i + batchSize);
            await Promise.all(batch.map(processProduct));
        }
    } catch (error) {
        // This should not happen since processProduct handles errors internally,
        // but adding this as a safety net
        console.error("Unexpected error in batch processing:", error);
    } finally {
        // Always ensure isGenerating is set to false
        setIsGenerating(false);
    }
  }, []);

  const handleRegenerateImage = useCallback(async (productId: ProductType) => {
    if (!userLogoBase64 || viewingHistoryId) return;

    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    setGenerationResults(prev => ({ ...prev, [productId]: { status: 'loading', imageUrl: null, error: null } }));

    try {
        const result = await generateWithRetry(userLogoBase64, product);

        setGenerationResults(prev => ({ ...prev, [productId]: result }));
    } catch (error) {
        // Handle errors gracefully for individual regeneration
        const errorMessage = error instanceof Error ? error.message : 'Regeneration failed';
        const errorResult: GenerationResult = {
            status: 'error',
            imageUrl: null,
            error: errorMessage
        };

        setGenerationResults(prev => ({ ...prev, [productId]: errorResult }));

        console.error(`Failed to regenerate image for ${product.name}:`, error);
    }
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
        handleGenerateAllImages(base64Image, file);
      } catch (e) {
        console.error("Could not read the selected file.", e);
        setUserLogo(null);
        setUserLogoBase64(null);
      }
    }
    if(event.target) event.target.value = '';
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
        onBackToGenerator={() => setView('generator')}
        history={[]}
        onLoadHistory={() => {}}
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