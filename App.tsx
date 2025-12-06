import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ImageDisplay from './components/ImageDisplay';
import ImageModal from './components/ImageModal';
import EmailOTPVerification from './components/EmailOTPVerification';
import { PRODUCT_CATEGORIES } from './constants';
import type { Product, ProductType, Base64Image, GenerationResult, GenerationHistoryItem } from './types';
import { fileToBase64 } from './utils/imageUtils';
import { generateAdImage } from './services/geminiService';
import { retryQueue } from './services/retryQueue';
import { RegenerationService } from './services/regenerationService';

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

  // Email/OTP verification state
  const [showEmailOTP, setShowEmailOTP] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);
  const [pendingLogoBase64, setPendingLogoBase64] = useState<Base64Image | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  // Regeneration state
  const [showRegenerationLimitPopup, setShowRegenerationLimitPopup] = useState<boolean>(false);
  const [regenerationLimitMessage, setRegenerationLimitMessage] = useState<string>('');

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

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem('skylar-session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setSessionId(session.sessionId);
        setSessionDetails(session);
        setUserEmail(session.email);
        setIsVerified(true);
        
        // Validate session with server
        fetch('/api/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session.sessionId }),
        }).then(resp => resp.json()).then(data => {
          if (!data.valid) {
            // Session invalid, clear it
            clearSession();
          }
        }).catch(err => {
          console.warn('Failed to validate session:', err);
          clearSession();
        });
      }
    } catch (error) {
      console.error("Failed to load session from localStorage", error);
      clearSession();
    }
  }, []);

  const clearSession = () => {
    setSessionId('');
    setSessionDetails(null);
    setUserEmail('');
    setIsVerified(false);
    localStorage.removeItem('skylar-session');
  };

  const storeSession = (sessionId: string, email: string, verifiedAt: string) => {
    const sessionData = { sessionId, email, verifiedAt };
    setSessionId(sessionId);
    setSessionDetails(sessionData);
    setUserEmail(email);
    setIsVerified(true);
    localStorage.setItem('skylar-session', JSON.stringify(sessionData));
  };

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

    // After all products processed, attempt to save generated images to server
    try {
      // Get current email from state at time of function execution
      const currentUserEmail = userEmail;
      const currentSessionDetails = sessionDetails;
      const emailToUse = currentUserEmail || currentSessionDetails?.email;
      
      console.log('=== SAVE IMAGES DEBUG ===');
      console.log('userEmail:', currentUserEmail);
      console.log('sessionDetails?.email:', currentSessionDetails?.email);
      console.log('emailToUse:', emailToUse);
      
      if (emailToUse) {
        const imagesToSave: Array<{ filename: string; data: string }> = [];
        // Collect successful images from liveSessionRef
        const resultsSource = liveSessionRef.current.results;
        for (const p of ALL_PRODUCTS) {
          const res = resultsSource[p.id];
          if (res && res.status === 'success' && res.imageUrl) {
            const filename = `${p.id}.png`;
            imagesToSave.push({ filename, data: res.imageUrl });
            console.log(`Added image: ${filename}`);
          }
        }

        console.log(`Total images to save: ${imagesToSave.length}`);

        if (imagesToSave.length > 0) {
          try {
            console.log('Sending POST to /api/save-images with:', { email: emailToUse, imageCount: imagesToSave.length });
            const saveResponse = await fetch('/api/save-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: emailToUse, images: imagesToSave }),
            });
            const result = await saveResponse.json();
            console.log('Save images response:', result);
            if (result.success) {
              console.log(`✅ Successfully saved ${result.files?.length || 0} images to userbanners/${result.id}/`);
            } else {
              console.error('❌ Save failed:', result.error);
            }
          } catch (e) {
            console.error('❌ Failed to save images to server:', e);
          }
        } else {
          console.warn('⚠️ No successful images to save');
        }
      } else {
        console.warn('⚠️ No email available for saving images');
      }
    } catch (e) {
      console.error('Error while preparing images for save:', e);
    }

    setIsGenerating(false);
  }, [userEmail, sessionDetails]);

  const handleSaveCurrentImages = useCallback(async () => {
    const emailToUse = userEmail || sessionDetails?.email;
    console.log('=== MANUAL SAVE TRIGGERED ===');
    console.log('Email:', emailToUse);
    
    if (!emailToUse) {
      console.error('❌ No email found. Please verify your email first.');
      return;
    }

    const imagesToSave: Array<{ filename: string; data: string }> = [];
    const resultsSource = generationResults;
    
    for (const p of ALL_PRODUCTS) {
      const res = resultsSource[p.id];
      if (res && res.status === 'success' && res.imageUrl) {
        const filename = `${p.id}.png`;
        imagesToSave.push({ filename, data: res.imageUrl });
        console.log(`Found image: ${filename}`);
      }
    }

    console.log(`Total images found: ${imagesToSave.length}`);

    if (imagesToSave.length === 0) {
      console.warn('⚠️ No images to save. Generate images first.');
      return;
    }

    try {
      console.log(`Saving ${imagesToSave.length} images to server...`);
      const saveResponse = await fetch('/api/save-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse, images: imagesToSave }),
      });
      const result = await saveResponse.json();
      console.log('Save response:', result);
      
      if (result.success) {
        console.log(`✅ SUCCESS! Saved ${result.files?.length || 0} images to userbanners/${result.id}/`);
        alert(`✅ Successfully saved ${result.files?.length || 0} images to userbanners/${result.id}/`);
      } else {
        console.error('❌ Save failed:', result.error);
        alert(`❌ Failed to save: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error saving images:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [userEmail, sessionDetails, generationResults]);

  const handleRegenerateAllImages = useCallback(async () => {
    // Check if user is logged in (has email)
    console.log('Regenerate button clicked. Current userEmail:', userEmail, 'isVerified:', isVerified);
    
    if (!userEmail || userEmail.trim() === '') {
      console.warn('User email not found or empty. userEmail:', userEmail);
      setRegenerationLimitMessage('Please verify your email first before regenerating images.');
      setShowRegenerationLimitPopup(true);
      return;
    }

    if (!userLogoBase64 || !userLogo) {
      console.warn('Logo not found. Please upload a logo first.');
      return;
    }

    try {
      console.log('Checking regeneration limit for email:', userEmail);
      // Check regeneration limit from database
      const checkResult = await RegenerationService.checkRegenerationLimit(userEmail);
      console.log('Regeneration check result:', checkResult);
      
      if (!checkResult.canRegenerate) {
        setRegenerationLimitMessage(`You have reached the maximum regeneration limit (${checkResult.regenerationCount}/${checkResult.maxRegenerations})`);
        setShowRegenerationLimitPopup(true);
        return;
      }

      // Increment regeneration count and get permission to regenerate
      console.log('Incrementing regeneration count for email:', userEmail);
      await RegenerationService.incrementRegenerationCount(userEmail);

      // Regenerate all images
      console.log('Starting image regeneration...');
      await handleGenerateAllImages(userLogoBase64, userLogo);
    } catch (error) {
      console.error('Error during regeneration:', error);
      if (error instanceof Error && error.message.includes('limit reached')) {
        setRegenerationLimitMessage(`Regeneration limit exceeded. Please contact support if you need more regenerations.`);
      } else {
        setRegenerationLimitMessage(`Error during regeneration: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      setShowRegenerationLimitPopup(true);
    }
  }, [userEmail, isVerified, userLogoBase64, userLogo, handleGenerateAllImages]);

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
        // Store the uploaded file temporarily
        setPendingLogo(file);
        setPendingLogoBase64(base64Image);
        // Show email OTP verification popup
        setShowEmailOTP(true);
      } catch (e) {
        console.error("Could not read the selected file.", e);
        setUserLogo(null);
        setUserLogoBase64(null);
      }
    }
    if(event.target) event.target.value = '';
  };

  const handleEmailVerified = async () => {
    // Note: This is called after successful OTP verification
    // The session should already be stored by the EmailOTPVerification component
    setIsVerified(true);
    // Keep userEmail after verification - important for regeneration limit checks
    // Move pending data to actual state
    if (pendingLogo && pendingLogoBase64) {
      setUserLogo(pendingLogo);
      setUserLogoBase64(pendingLogoBase64);
      setViewingHistoryId(null);
      liveSessionRef.current = { logo: pendingLogo, logoBase64: pendingLogoBase64, results: initialResults };
      
      // Use currentEmail to avoid stale closure issues
      const currentEmail = userEmail;
      console.log('Email verified. Current email:', currentEmail, 'userEmail state:', userEmail);
      
      // Start image generation with explicit email parameter
      await handleGenerateAllImages(pendingLogoBase64, pendingLogo);
    }
    // Clear pending data but keep userEmail
    setPendingLogo(null);
    setPendingLogoBase64(null);
  };

  const handleCloseEmailOTP = () => {
    setShowEmailOTP(false);
    // Clear pending data
    setPendingLogo(null);
    setPendingLogoBase64(null);
    // Only clear email if not verified yet
    if (!isVerified) {
      setUserEmail('');
    }
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

  // Expose save function to window for manual trigger
  useEffect(() => {
    (window as any).saveCurrentImages = handleSaveCurrentImages;
    console.log('💾 Manual save available: Run saveCurrentImages() in console');
    return () => {
      delete (window as any).saveCurrentImages;
    };
  }, [handleSaveCurrentImages]);

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
        onRegenerateAll={handleRegenerateAllImages}
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
      <EmailOTPVerification
        isOpen={showEmailOTP}
        onClose={handleCloseEmailOTP}
        onVerified={handleEmailVerified}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        onSessionStored={storeSession}
      />
      
      {/* Regeneration Limit Popup */}
      {showRegenerationLimitPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ Regeneration Limit Reached</h2>
            <p className="text-gray-600 mb-6">{regenerationLimitMessage}</p>
            <button
              onClick={() => setShowRegenerationLimitPopup(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;