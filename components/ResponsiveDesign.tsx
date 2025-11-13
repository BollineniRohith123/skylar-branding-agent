import React from 'react';
import { useDeviceDetection } from '../hooks/useEnhancedInteractions';

// Responsive container component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'full',
  padding = 'md',
  center = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8'
  };

  const containerClasses = `
    ${maxWidthClasses[maxWidth]}
    ${paddingClasses[padding]}
    ${center ? 'mx-auto' : ''}
  `;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// Responsive grid component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const gridClasses = `
    grid
    grid-cols-${cols.mobile || 1}
    ${cols.tablet ? `md:grid-cols-${cols.tablet}` : ''}
    ${cols.desktop ? `lg:grid-cols-${cols.desktop}` : ''}
    ${gapClasses[gap]}
    ${className}
  `;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = { mobile: 'base', desktop: 'lg' },
  weight = 'normal',
  className = ''
}) => {
  const sizeClasses = {
    mobile: size.mobile || 'base',
    tablet: (size as any).tablet || size.mobile || 'base',
    desktop: (size as any).desktop || (size as any).tablet || size.mobile || 'base'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const textClasses = `
    text-${sizeClasses.mobile}
    ${sizeClasses.tablet !== sizeClasses.mobile ? `md:text-${sizeClasses.tablet}` : ''}
    ${sizeClasses.desktop !== sizeClasses.tablet ? `lg:text-${sizeClasses.desktop}` : ''}
    ${weightClasses[weight]}
    ${className}
  `;

  return (
    <span className={textClasses}>
      {children}
    </span>
  );
};

// Mobile-first responsive image
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: {
    mobile: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes,
  className = '',
  loading = 'lazy'
}) => {
  const sizeString = sizes
    ? `(max-width: 768px) ${sizes.mobile}, ${sizes.tablet ? `(max-width: 1024px) ${sizes.tablet}, ` : ''}${sizes.desktop || sizes.mobile}`
    : undefined;

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizeString}
      className={`w-full h-auto ${className}`}
      loading={loading}
    />
  );
};

// Touch-friendly button for mobile
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white',
    outline: 'border-2 border-indigo-600 text-indigo-400 hover:bg-indigo-600 hover:text-white active:bg-indigo-700'
  };

  return (
    <button
      className={`
        flex items-center justify-center
        min-h-[44px] px-4 py-3
        text-base font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500
        active:scale-95
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

// Mobile navigation drawer
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  children,
  title = 'Menu'
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 id="mobile-nav-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close navigation"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

// Responsive navigation component
interface ResponsiveNavProps {
  children: React.ReactNode;
  mobileTitle?: string;
}

export const ResponsiveNav: React.FC<ResponsiveNavProps> = ({
  children,
  mobileTitle = 'Menu'
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const { isMobile } = useDeviceDetection();

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Open navigation menu"
          aria-expanded={isMobileNavOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile navigation */}
        <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} title={mobileTitle}>
          {children}
        </MobileNav>
      </>
    );
  }

  // Desktop navigation
  return (
    <nav className="hidden lg:block">
      {children}
    </nav>
  );
};

// Responsive spacing component
interface ResponsiveSpacingProps {
  children: React.ReactNode;
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  margin?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  children,
  padding,
  margin,
  className = ''
}) => {
  const paddingClasses = padding
    ? `
      p-${padding.mobile || '4'}
      ${padding.tablet ? `md:p-${padding.tablet}` : ''}
      ${padding.desktop ? `lg:p-${padding.desktop}` : ''}
    `
    : '';

  const marginClasses = margin
    ? `
      m-${margin.mobile || '4'}
      ${margin.tablet ? `md:m-${margin.tablet}` : ''}
      ${margin.desktop ? `lg:m-${margin.desktop}` : ''}
    `
    : '';

  return (
    <div className={`${paddingClasses} ${marginClasses} ${className}`}>
      {children}
    </div>
  );
};

// Device-specific content renderer
interface DeviceSpecificProps {
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const DeviceSpecific: React.FC<DeviceSpecificProps> = ({
  mobile,
  tablet,
  desktop,
  fallback
}) => {
  const { screenSize } = useDeviceDetection();

  switch (screenSize) {
    case 'mobile':
      return <>{mobile || fallback}</>;
    case 'tablet':
      return <>{tablet || mobile || fallback}</>;
    case 'desktop':
      return <>{desktop || tablet || mobile || fallback}</>;
    default:
      return <>{fallback}</>;
  }
};

// Orientation-aware component
interface OrientationAwareProps {
  children: React.ReactNode;
  portrait?: React.ReactNode;
  landscape?: React.ReactNode;
}

export const OrientationAware: React.FC<OrientationAwareProps> = ({
  children,
  portrait,
  landscape
}) => {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait');

  React.useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  if (orientation === 'portrait' && portrait) {
    return <>{portrait}</>;
  }

  if (orientation === 'landscape' && landscape) {
    return <>{landscape}</>;
  }

  return <>{children}</>;
};