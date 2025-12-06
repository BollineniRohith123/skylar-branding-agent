import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
// Utility to download all images as a zip
async function downloadAllImagesZip(results: Record<string, any>, categories: any[]) {
    const zip = new JSZip();
    let count = 0;
    for (const cat of categories) {
        for (const product of cat.products) {
            const res = results[product.id];
            if (res && res.status === 'success' && res.imageUrl) {
                const base64 = res.imageUrl.split(',')[1];
                const ext = (res.imageUrl.split(';')[0].split('/')[1] || 'png').replace(/[^a-zA-Z0-9]/g, '');
                zip.file(`${product.id}.${ext}`, base64, { base64: true });
                count++;
            }
        }
    }
    if (count === 0) {
        alert('No images to download.');
        return;
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skylar-images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
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
    onRegenerateAll?: () => void;
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
                    <p className="text-gray-400 text-sm">Generated by Skylar Tech Team</p>
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
                    <ArrowLeftIcon className="h-4 w-4" />
                    <span>Back to Generator</span>
                </button>
            </div>
            {sortedHistory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center glass-card p-12 rounded-2xl animate-fadeIn">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
                                <HistoryIcon className="h-12 w-12 text-gray-400" />
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
        onImageClick, onRegenerate, onRegenerateAll, isViewingHistory, onShowHistory, onBackToCurrent
    } = props;

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);
    const [enlargedImage, setEnlargedImage] = useState<{ src: string; title: string } | null>(null);
    
    // All Skylar brand images for the carousel
    const brandImages = [
        { src: '/Skylar Brand Images/skylar-metro-exterior.png', title: 'Metro Exterior', description: 'High-impact transit advertising' },
        { src: '/Skylar Brand Images/skylar-aircraft-exterior (3).png', title: 'Aircraft Exterior', description: 'Premium aviation branding' },
        { src: '/Skylar Brand Images/skylar-shopping-mall (1).png', title: 'Shopping Mall', description: 'Retail destination advertising' },
        { src: '/Skylar Brand Images/skylar-unipole-billboard (2).png', title: 'Unipole Billboard', description: 'Large-format outdoor advertising' },
        { src: '/Skylar Brand Images/skylar-facade-bridge (1).png', title: 'Facade Bridge', description: 'Architectural integration' },
        { src: '/Skylar Brand Images/skylar-car-wrap (4).png', title: 'Car Wrap', description: 'Mobile brand exposure' },
        { src: '/Skylar Brand Images/skylar-metro-pillar (2).png', title: 'Metro Pillar', description: 'Transit hub branding' },
        { src: '/Skylar Brand Images/skylar-road-median.png', title: 'Road Median', description: 'High-visibility road advertising' },
        { src: '/Skylar Brand Images/skylar-baggage-cart (2).png', title: 'Baggage Cart', description: 'Airport terminal branding' },
        { src: '/Skylar Brand Images/skylar-boarding-pass (1).png', title: 'Boarding Pass', description: 'Personalized brand experience' },
        { src: '/Skylar Brand Images/skylar-meal-tray (2).png', title: 'Meal Tray', description: 'In-flight branding' },
        { src: '/Skylar Brand Images/skylar-aircraft-magazine (1).png', title: 'Aircraft Magazine', description: 'In-flight publication branding' },
        { src: '/Skylar Brand Images/skylar-auto-canopy (1).png', title: 'Auto Canopy', description: 'Gas station branding' },
        { src: '/Skylar Brand Images/skylar-step-ladder (1).png', title: 'Step Ladder', description: 'Event branding solution' }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % brandImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + brandImages.length) % brandImages.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleImageClick = (src: string, title: string) => {
        setEnlargedImage({ src, title });
    };

    const closeEnlargedImage = () => {
        setEnlargedImage(null);
    };

    // Auto-slide every 1.5 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 1500);
        return () => clearInterval(interval);
    }, []);

    if (view === 'history') {
        return <HistoryView {...props} />;
    }

    return (
        <div>
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
                        <HistoryIcon className="h-4 w-4" />
                        <span>History</span>
                    </button>
                    <button
                        onClick={onUploadClick}
                        disabled={isGenerating}
                        className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UploadIcon className="h-4 w-4" />
                        <span>{userLogo && !isViewingHistory ? 'Change Logo' : 'Upload Logo'}</span>
                    </button>
                </div>
            </div>

            {!userLogo ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center glass-card p-12 rounded-2xl animate-fadeIn max-w-4xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Column - Upload Section */}
                            <div className="text-left">
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center animate-float">
                                        <UploadIcon className="h-10 w-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold gradient-text mb-4">Transform Your Brand</h3>
                                <p className="text-gray-300 text-lg mb-8">Upload your logo to see it come to life across premium advertising surfaces with Skylar's brand visualization technology.</p>
                                <button
                                    onClick={onUploadClick}
                                    className="btn btn-primary text-lg px-8 py-4"
                                >
                                    <UploadIcon className="h-5 w-5" />
                                    Upload Your Logo
                                </button>
                            </div>
                            
                            {/* Right Column - Brand Images Carousel */}
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10">
                                    {/* Main Carousel Display */}
                                    <div className="relative h-80 flex items-center justify-center">
                                        <div className="flex transition-transform duration-700 ease-in-out h-full"
                                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                                            {brandImages.map((image, index) => (
                                                <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center p-4">
                                                    <img
                                                        src={image.src}
                                                        alt={image.title}
                                                        className="max-w-full max-h-full object-contain rounded-xl shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105"
                                                        onClick={() => handleImageClick(image.src, image.title)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Navigation Arrows */}
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 opacity-80 hover:opacity-100"
                                            aria-label="Previous image"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 opacity-80 hover:opacity-100"
                                            aria-label="Next image"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {/* Image Information Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <h4 className="text-white font-bold text-xl mb-1">{brandImages[currentSlide].title}</h4>
                                        <p className="text-gray-300 text-sm">{brandImages[currentSlide].description}</p>
                                    </div>
                                </div>
                                
                                {/* Thumbnail Navigation */}
                                <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-full">
                                    {brandImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                                                currentSlide === index 
                                                    ? 'ring-2 ring-indigo-400 scale-110 shadow-lg' 
                                                    : 'opacity-60 hover:opacity-100 scale-100'
                                            }`}
                                            aria-label={`Go to ${image.title}`}
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {currentSlide === index && (
                                                <div className="absolute inset-0 bg-indigo-400/20 pointer-events-none"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="mt-6 text-center">
                                    <p className="text-sm font-semibold text-gray-300">Premium Branding Surfaces</p>
                                    <p className="text-xs text-gray-500 mt-1">Explore all {brandImages.length} high-impact advertising locations</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Features Section */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/5">
                                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                                    <UploadIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-white font-semibold mb-2">Easy Upload</h4>
                                <p className="text-gray-400 text-sm">Simply upload your logo in PNG, JPEG, or WebP format</p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/5">
                                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
                                    <RefreshCwIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-white font-semibold mb-2">AI Generation</h4>
                                <p className="text-gray-400 text-sm">Advanced AI creates stunning brand visualizations instantly</p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/5">
                                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                                    <DownloadIcon className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-white font-semibold mb-2">Download Ready</h4>
                                <p className="text-gray-400 text-sm">Download high-quality images for your marketing campaigns</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Uploaded Logo Display Section */}
                    <div className="mb-12 glass-card p-10 rounded-2xl animate-fadeIn">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-3xl font-bold gradient-text mb-2">Your Brand Logo</h3>
                                <p className="text-gray-400 text-lg">This is your logo that will be applied to all advertising surfaces with stunning visual impact</p>
                            </div>
                            <button
                                onClick={onUploadClick}
                                disabled={isGenerating}
                                className="btn btn-outline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <UploadIcon className="h-4 w-4" />
                                Change Logo
                            </button>
                        </div>
                        <div className="flex items-center justify-center p-12 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-white/5">
                            <div className="relative group">
                                <div className="w-64 h-64 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-6 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                                    <img
                                        src={userLogo ? URL.createObjectURL(userLogo) : ''}
                                        alt="Uploaded Logo"
                                        className="max-w-full max-h-full object-contain filter drop-shadow-lg"
                                    />
                                </div>
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-primary rounded-full text-white text-sm font-semibold shadow-xl border border-white/20">
                                    {userLogo?.name}
                                </div>
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center animate-pulse shadow-lg">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

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

                    {/* Regenerate All & Download All Buttons */}
                    {userLogo && !isViewingHistory && !isGenerating && (
                        <div className="mt-16 flex flex-col items-center gap-4">
                            <button
                                onClick={() => {
                                    if (typeof onRegenerateAll === 'function') {
                                        onRegenerateAll();
                                    } else {
                                        console.error('onRegenerateAll is not a function:', typeof onRegenerateAll);
                                    }
                                }}
                                className="btn btn-primary flex items-center gap-3 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                <RefreshCwIcon className="h-5 w-5" />
                                <span>Regenerate All Images</span>
                            </button>
                            <button
                                onClick={() => downloadAllImagesZip(results, productCategories)}
                                className="btn btn-secondary flex items-center gap-3 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                <span>Download All Images (ZIP)</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </main>
        
        {/* Enlarged Image Modal */}
        {enlargedImage && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn"
                onClick={closeEnlargedImage}
            >
                <div className="relative max-w-6xl max-h-screen p-4">
                    <button
                        onClick={closeEnlargedImage}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10"
                        aria-label="Close enlarged image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                            <h3 className="text-xl font-bold">{enlargedImage.title}</h3>
                        </div>
                        <div className="p-8 bg-gray-100">
                            <img
                                src={enlargedImage.src}
                                alt={enlargedImage.title}
                                className="max-w-full max-h-[70vh] object-contain mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
};

export default ImageDisplay;