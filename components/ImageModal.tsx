import React from 'react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300 animate-fadeIn"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="transform transition-all duration-300 animate-scaleIn flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the content
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <div className="relative">
            <img
              src={imageUrl}
              alt="Enlarged ad visualization"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 z-10 p-3 glass-card rounded-full text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 hover:scale-110"
              aria-label="Close image viewer"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm font-semibold mb-2">powered by Skylar Team</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-gray-500 text-xs">AI Generated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;