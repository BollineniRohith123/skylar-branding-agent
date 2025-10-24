import React from 'react';
import type { GenerationResult, ProductType, ProductCategory, GenerationHistoryItem } from '../types';
import { UploadIcon, DownloadIcon, RefreshCwIcon, HistoryIcon, ArrowLeftIcon } from './icons';

interface ImageDisplayProps {
  view: 'generator' | 'history';
  productCategories: ProductCategory[];
  results: Record<ProductType, GenerationResult>;
  isGenerating: boolean;
  onUploadClick: () => void;
  userLogo: File | null;
  onImageClick: (imageUrl: string) => void;
  onRegenerate: (productId: ProductType) => void;
  isViewingHistory: boolean;
  onShowHistory: () => void;
  onBackToCurrent: () => void;
  history: GenerationHistoryItem[];
  onLoadHistory: (item: GenerationHistoryItem) => void;
  // FIX: Added 'onBackToGenerator' to the props interface to allow navigating from history view back to the generator.
  onBackToGenerator: () => void;
}

const CardLoader: React.FC = () => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-10">
      <div className="w-10 h-10 border-4 border-solid border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white text-sm mt-3 font-semibold">Generating...</p>
    </div>
);

// CardError component is now hidden - errors are handled silently with automatic retries
// This ensures users never see error messages during image generation
const CardError: React.FC<{ error: string | null; onRetry?: () => void }> = () => {
    // Silently suppress all error displays - the retry logic handles failures automatically
    return null;
};


const ImageCard: React.FC<{ 
    product: ProductCategory['products'][0]; 
    result: GenerationResult; 
    onImageClick: (imageUrl: string) => void;
    onRegenerate: (productId: ProductType) => void;
    isRegenerationAllowed: boolean;
}> = ({ product, result, onImageClick, onRegenerate, isRegenerationAllowed }) => {
    const { status, imageUrl } = result;

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        const mimeType = imageUrl.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1] || 'png';
        link.download = `skylar-${product.id}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRegenerate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (status === 'loading') return;
        onRegenerate(product.id);
    }

    const isClickable = status === 'success' && imageUrl;
    // Treat error status as loading to keep showing loading state instead of error message
    const displayStatus = status === 'error' ? 'loading' : status;

    return (
        <div
            className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 group"
            onClick={() => isClickable && onImageClick(imageUrl)}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : -1}
            aria-label={isClickable ? `View enlarged image of ${product.name}` : undefined}
            onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    onImageClick(imageUrl);
                }
            }}
        >
            <div className={`relative aspect-video bg-gray-800 ${isClickable ? 'cursor-pointer' : ''}`}>
                {displayStatus === 'loading' && <CardLoader />}

                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className={`object-cover w-full h-full transition-opacity duration-500 ${displayStatus === 'loading' ? 'opacity-30' : 'opacity-100'}`}
                        />
                        {status === 'success' && (
                            <div className="absolute top-3 right-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {isRegenerationAllowed && (
                                    <button
                                        onClick={handleRegenerate}
                                        className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500"
                                        aria-label={`Regenerate ${product.name} image`}
                                    >
                                        <RefreshCwIcon className="h-5 w-5" />
                                    </button>
                                )}
                                <button
                                    onClick={handleDownload}
                                    className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500"
                                    aria-label={`Download ${product.name} image`}
                                >
                                    <DownloadIcon className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700/50">
                        <product.icon className="h-12 w-12 text-gray-500" />
                    </div>
                )}
            </div>
            <div className="p-4 bg-gray-800/50">
                <h3 className="text-white font-semibold truncate">{product.name}</h3>
            </div>
        </div>
    );
};

const HistoryView: React.FC<Pick<ImageDisplayProps, 'history' | 'onLoadHistory' | 'onBackToGenerator'>> = ({ history, onLoadHistory, onBackToGenerator }) => {
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <main className="flex-1 flex flex-col p-8 bg-transparent overflow-auto">
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                <div>
                    <h2 className="text-3xl font-bold text-white">Generation History</h2>
                    <p className="text-gray-400 mt-1">Select a past session to view its results.</p>
                </div>
                <button
                    onClick={onBackToGenerator}
                    className="flex items-center gap-2 bg-gray-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 shadow-lg"
                    >
                    <ArrowLeftIcon className="h-5 w-5"/>
                    <span>Back to Generator</span>
                </button>
            </div>
            {sortedHistory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded-lg shadow-2xl p-4">
                    <div className="text-center">
                        <HistoryIcon className="h-16 w-16 text-gray-400 mb-4 mx-auto"/>
                        <h3 className="text-2xl font-bold text-white">No History Yet</h3>
                        <p className="text-gray-300 mt-2">Your generated brand visions will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {sortedHistory.map(item => (
                        <div
                            key={item.id}
                            onClick={() => onLoadHistory(item)}
                            className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 group cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label={`View history for ${item.logoName}`}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLoadHistory(item)}
                        >
                            <div className="aspect-video bg-gray-800 flex items-center justify-center p-4">
                                <img
                                    src={`data:${item.logo.mimeType};base64,${item.logo.base64}`}
                                    alt={item.logoName}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
                                <h3 className="text-white font-semibold truncate" title={item.logoName}>{item.logoName}</h3>
                                <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

const ImageDisplay: React.FC<ImageDisplayProps> = (props) => {
    const { 
        view, productCategories, results, isGenerating, onUploadClick, userLogo, 
        onImageClick, onRegenerate, isViewingHistory, onShowHistory, onBackToCurrent 
    } = props;

    if (view === 'history') {
        return <HistoryView {...props} />;
    }

  return (
    <main className="flex-1 flex flex-col p-8 bg-transparent overflow-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <div>
          <h2 className="text-3xl font-bold text-white">Brand Visualization</h2>
          <p className="text-gray-400 mt-1">Upload your logo to see it across all advertising surfaces.</p>
        </div>
        <div className="flex items-center gap-4">
            {userLogo && (
                <div className="text-right">
                    <p className="text-sm font-medium text-white">{isViewingHistory ? 'Viewing History For:' : 'Current Logo:'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{userLogo.name}</p>
                </div>
            )}
             {isViewingHistory && (
                <button
                    onClick={onBackToCurrent}
                    className="flex items-center gap-2 bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors duration-200"
                    aria-label="Return to the current generation session"
                    >
                    <ArrowLeftIcon className="h-5 w-5" />
                    <span>Back to Current</span>
                </button>
            )}
             <button
              onClick={onShowHistory}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
            >
              <HistoryIcon className="h-5 w-5"/>
              <span>History</span>
            </button>
            <button
              onClick={onUploadClick}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-amber-400 text-slate-900 font-bold px-5 py-3 rounded-lg hover:bg-amber-500 transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 shadow-lg"
            >
              <UploadIcon className="h-5 w-5"/>
              <span>{userLogo && !isViewingHistory ? 'Change Logo' : 'Upload Logo'}</span>
            </button>
        </div>
      </div>

      {!userLogo ? (
        <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded-lg shadow-2xl p-4">
            <div className="text-center">
                <UploadIcon className="h-16 w-16 text-gray-400 mb-4 mx-auto"/>
                <h3 className="text-2xl font-bold text-white">Your Logo Here</h3>
                <p className="text-gray-300 mt-2">Click "Upload Logo" to see your brand in action.</p>
            </div>
        </div>
      ) : (
        <div className="space-y-12">
            {productCategories.map(category => (
                <div key={category.name}>
                    <h3 className="text-2xl font-bold text-white mb-6 pb-2 border-b-2 border-gray-700">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {category.products.map(product => (
                            <ImageCard 
                                key={product.id}
                                product={product}
                                result={results[product.id]}
                                onImageClick={onImageClick}
                                onRegenerate={onRegenerate}
                                isRegenerationAllowed={!isViewingHistory}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      )}
    </main>
  );
};

export default ImageDisplay;