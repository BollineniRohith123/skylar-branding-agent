import React from 'react';

// Typography scale and utilities
export const typography = {
  // Font families
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: 'JetBrains Mono, "Fira Code", Consolas, monospace',
    display: 'Poppins, Inter, sans-serif'
  },

  // Font sizes (responsive)
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem'      // 128px
  },

  // Line heights
  leading: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Font weights
  weight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  // Letter spacing
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
};

// Enhanced heading component
interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: keyof typeof typography.weight;
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gray' | 'muted';
  gradient?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  size,
  weight = 'bold',
  color = 'white',
  gradient = false,
  className = '',
  align = 'left'
}) => {
  const sizeMap = {
    1: size || '6xl',
    2: size || '5xl',
    3: size || '4xl',
    4: size || '3xl',
    5: size || '2xl',
    6: size || 'xl'
  };

  const colorClasses = {
    primary: 'text-indigo-400',
    secondary: 'text-amber-400',
    accent: 'text-emerald-400',
    white: 'text-white',
    gray: 'text-gray-300',
    muted: 'text-gray-400'
  };

  const gradientClass = gradient ? 'gradient-text' : '';
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }[align];

  const headingProps = {
    className: `
      font-bold
      ${typography.sizes[sizeMap[level]]}
      ${typography.weight[weight]}
      ${colorClasses[color]}
      ${gradientClass}
      ${alignClass}
      ${className}
    `
  };

  return React.createElement(`h${level}`, headingProps, children);
};

// Enhanced paragraph component
interface ParagraphProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: keyof typeof typography.weight;
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gray' | 'muted';
  leading?: keyof typeof typography.leading;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'gray',
  leading = 'normal',
  className = '',
  align = 'left'
}) => {
  const colorClasses = {
    primary: 'text-indigo-400',
    secondary: 'text-amber-400',
    accent: 'text-emerald-400',
    white: 'text-white',
    gray: 'text-gray-300',
    muted: 'text-gray-400'
  };

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }[align];

  return (
    <p
      className={`
        ${typography.sizes[size]}
        ${typography.weight[weight]}
        ${typography.leading[leading]}
        ${colorClasses[color]}
        ${alignClass}
        ${className}
      `}
    >
      {children}
    </p>
  );
};

// Text with gradient effect
interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  from = 'from-indigo-400',
  to = 'to-purple-500',
  direction = 'horizontal',
  className = ''
}) => {
  const directionClasses = {
    horizontal: 'bg-gradient-to-r',
    vertical: 'bg-gradient-to-b',
    diagonal: 'bg-gradient-to-br'
  };

  return (
    <span
      className={`
        ${directionClasses[direction]}
        ${from} ${to}
        bg-clip-text text-transparent
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Text with glow effect
interface GlowTextProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  intensity?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const GlowText: React.FC<GlowTextProps> = ({
  children,
  color = 'primary',
  intensity = 'md',
  className = ''
}) => {
  const colorClasses = {
    primary: 'text-indigo-400',
    secondary: 'text-amber-400',
    accent: 'text-emerald-400',
    white: 'text-white'
  };

  const intensityClasses = {
    sm: 'drop-shadow-sm',
    md: 'drop-shadow-md',
    lg: 'drop-shadow-lg',
    xl: 'drop-shadow-xl'
  };

  return (
    <span
      className={`
        ${colorClasses[color]}
        ${intensityClasses[intensity]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Animated text reveal
interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 50,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Text with typing animation
interface TypewriterTextProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenTexts?: number;
  className?: string;
  loop?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  texts,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenTexts = 2000,
  className = '',
  loop = true
}) => {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);
  const [currentCharIndex, setCurrentCharIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentCharIndex < currentText.length) {
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), delayBetweenTexts);
        }
      } else {
        // Deleting
        if (currentCharIndex > 0) {
          setCurrentCharIndex(prev => prev - 1);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          if (loop || currentTextIndex < texts.length - 1) {
            setCurrentTextIndex(prev => (prev + 1) % texts.length);
          }
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentTextIndex, currentCharIndex, isDeleting, texts, typeSpeed, deleteSpeed, delayBetweenTexts, loop]);

  return (
    <span className={className}>
      {texts[currentTextIndex]?.substring(0, currentCharIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Text with highlight effect
interface HighlightTextProps {
  children: React.ReactNode;
  highlight?: string;
  highlightColor?: string;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  children,
  highlight,
  highlightColor = 'bg-yellow-400/20 text-yellow-300',
  className = ''
}) => {
  if (!highlight) {
    return <span className={className}>{children}</span>;
  }

  const text = children?.toString() || '';
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className={`${highlightColor} px-1 rounded`}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

// Text with fade in animation
interface FadeInTextProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4'
  };

  return (
    <span
      className={`
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${directionClasses[direction]}`}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Text with scale animation on hover
interface ScaleTextProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export const ScaleText: React.FC<ScaleTextProps> = ({
  children,
  scale = 1.05,
  className = ''
}) => {
  return (
    <span
      className={`
        inline-block transition-transform duration-200 ease-out
        hover:scale-${scale} cursor-default
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Text with underline animation
interface UnderlineTextProps {
  children: React.ReactNode;
  color?: string;
  height?: string;
  className?: string;
}

export const UnderlineText: React.FC<UnderlineTextProps> = ({
  children,
  color = 'bg-indigo-400',
  height = 'h-0.5',
  className = ''
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <span
        className={`
          absolute bottom-0 left-0 w-0 ${height} ${color}
          transition-all duration-300 ease-out
          group-hover:w-full
        `}
      />
    </span>
  );
};

// Text with background clip effect
interface ClipTextProps {
  children: React.ReactNode;
  background?: string;
  className?: string;
}

export const ClipText: React.FC<ClipTextProps> = ({
  children,
  background = 'bg-gradient-to-r from-indigo-400 to-purple-500',
  className = ''
}) => {
  return (
    <span
      className={`
        ${background}
        bg-clip-text text-transparent
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Text with neon glow effect
interface NeonTextProps {
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'red';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const NeonText: React.FC<NeonTextProps> = ({
  children,
  color = 'blue',
  intensity = 'medium',
  className = ''
}) => {
  const colorClasses = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    green: 'text-green-400',
    red: 'text-red-400'
  };

  const intensityClasses = {
    low: 'drop-shadow-sm',
    medium: 'drop-shadow-md',
    high: 'drop-shadow-lg drop-shadow-blue-500/50'
  };

  return (
    <span
      className={`
        ${colorClasses[color]}
        ${intensityClasses[intensity]}
        animate-pulse
        ${className}
      `}
      style={{
        textShadow: `0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor`
      }}
    >
      {children}
    </span>
  );
};