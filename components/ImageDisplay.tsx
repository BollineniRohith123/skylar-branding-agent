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
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-fadeIn">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-solid border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-solid border-amber-400/20 border-t-amber-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-white text-sm mt-4 font-semibold animate-pulse">Generating...</p>
      <div className="mt-2 flex space-x-1">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
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
            className="card hover-lift group animate-fadeIn"
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
            <div className={`relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 ${isClickable ? 'cursor-pointer' : ''}`}>
                {displayStatus === 'loading' && <CardLoader />}

                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className={`object-cover w-full h-full transition-all duration-500 ${displayStatus === 'loading' ? 'opacity-30 scale-105' : 'opacity-100 scale-100'}`}
                        />
                        {status === 'success' && (
                            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                {isRegenerationAllowed && (
                                    <button
                                        onClick={handleRegenerate}
                                        className="p-3 glass rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 hover:scale-110"
                                        aria-label={`Regenerate ${product.name} image`}
                                    >
                                        <RefreshCwIcon className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={handleDownload}
                                    className="p-3 glass rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 hover:scale-110"
                                    aria-label={`Download ${product.name} image`}
                                >
                                    <DownloadIcon className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        {/* Success Badge */}
                        <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                Generated
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-4">
                            <product.icon className="h-8 w-8 text-indigo-400" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">{product.name}</p>
                    </div>
                )}
            </div>
            <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                <h3 className="text-white font-semibold text-lg truncate group-hover:text-indigo-300 transition-colors duration-300">{product.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <p className="text-gray-400 text-sm">AI Generated</p>
                </div>
            </div>
        </div>
    );
};

const HistoryView: React.FC<Pick<ImageDisplayProps, 'history' | 'onLoadHistory' | 'onBackToGenerator'>> = ({ history, onLoadHistory, onBackToGenerator }) => {
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <main className="flex-1 flex flex-col p-8 bg-transparent overflow-auto animate-fadeIn">
             <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                <div>
                    <h2 className="text-4xl font-bold gradient-text mb-2">Generation History</h2>
                    <p className="text-gray-400 text-lg">Select a past session to view its results.</p>
                </div>
                <button
                    onClick={onBackToGenerator}
                    className="btn btn-outline flex items-center gap-2"
                    >
                    <ArrowLeftIcon className="h-4 w-4"/>
                    <span>Back to Generator</span>
                </button>
            </div>
            {sortedHistory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center glass-card p-12 rounded-2xl animate-fadeIn">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
                                <HistoryIcon className="h-12 w-12 text-gray-400"/>
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold gradient-text mb-4">No History Yet</h3>
                        <p className="text-gray-300 text-lg">Your generated brand visions will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {sortedHistory.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => onLoadHistory(item)}
                            className="card hover-lift group cursor-pointer animate-fadeIn"
                            role="button"
                            tabIndex={0}
                            aria-label={`View history for ${item.logoName}`}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLoadHistory(item)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-6">
                                <img
                                    src={`data:${item.logo.mimeType};base64,${item.logo.base64}`}
                                    alt={item.logoName}
                                    className="max-h-full max-w-full object-contain rounded-lg"
                                />
                            </div>
                            <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-t border-white/5">
                                <h3 className="text-white font-semibold text-lg truncate group-hover:text-indigo-300 transition-colors duration-300" title={item.logoName}>{item.logoName}</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                    <p className="text-gray-400 text-sm">{new Date(item.timestamp).toLocaleDateString()}</p>
                                </div>
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
    <main className="flex-1 flex flex-col p-8 bg-transparent overflow-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-4xl font-bold gradient-text mb-2">Brand Visualization</h2>
          <p className="text-gray-400 text-lg">Upload your logo to see it across all advertising surfaces.</p>
        </div>
        <div className="flex items-center gap-4">
            {userLogo && (
                <div className="text-right glass-card px-4 py-3 rounded-xl">
                    <p className="text-sm font-semibold text-white">{isViewingHistory ? 'Viewing History For:' : 'Current Logo:'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{userLogo.name}</p>
                </div>
            )}
             {isViewingHistory && (
                <button
                    onClick={onBackToCurrent}
                    className="btn btn-outline flex items-center gap-2"
                    aria-label="Return to the current generation session"
                    >
                    <ArrowLeftIcon className="h-4 w-4" />
                    <span>Back to Current</span>
                </button>
            )}
             <button
              onClick={onShowHistory}
              disabled={isGenerating}
              className="btn btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HistoryIcon className="h-4 w-4"/>
              <span>History</span>
            </button>
            <button
              onClick={onUploadClick}
              disabled={isGenerating}
              className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadIcon className="h-4 w-4"/>
              <span>{userLogo && !isViewingHistory ? 'Change Logo' : 'Upload Logo'}</span>
            </button>
        </div>
      </div>

      {!userLogo ? (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center glass-card p-12 rounded-2xl animate-fadeIn">
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center animate-float">
                        <UploadIcon className="h-12 w-12 text-white"/>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>
                <h3 className="text-3xl font-bold gradient-text mb-4">Your Logo Here</h3>
                <p className="text-gray-300 text-lg mb-8 max-w-md">Click "Upload Logo" to see your brand in action across multiple advertising surfaces.</p>
                <button
                    onClick={onUploadClick}
                    className="btn btn-primary text-lg px-8 py-4"
                >
                    <UploadIcon className="h-5 w-5"/>
                    Upload Your Logo
                </button>
            </div>
        </div>
      ) : (
        <div className="space-y-16">
            {productCategories.map((category, categoryIndex) => (
                <div key={category.name} className="animate-fadeIn" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-1 w-12 bg-gradient-primary rounded-full"></div>
                        <h3 className="text-3xl font-bold gradient-text">{category.name}</h3>
                        <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {category.products.map((product, productIndex) => (
                            <div
                                key={product.id}
                                className="animate-fadeIn"
                                style={{ animationDelay: `${(categoryIndex * 0.1) + (productIndex * 0.05)}s` }}
                            >
                                <ImageCard
                                    product={product}
                                    result={results[product.id]}
                                    onImageClick={onImageClick}
                                    onRegenerate={onRegenerate}
                                    isRegenerationAllowed={!isViewingHistory}
                                />
                            </div>
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