interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  textSize?: 'sm' | 'md' | 'lg';   // ✅ added
  animated?: boolean;              // ✅ added
  showText?: boolean;
  className?: string;
}

export const Logo = ({ 
  size = 'md', 
  textSize = size,               // default to same as size
  animated = false, 
  showText = true, 
  className = '' 
}: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-electric-blue via-cyan-400 to-lime-green rounded-xl flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-lime-green/20"></div>
        <div className="relative z-10 flex items-center justify-center">
          <svg 
            className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'} text-black`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L3 7l4 12h10l4-12-9-5zm0 3.27L18.18 8 12 13.73 5.82 8 12 5.27z"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue to-lime-green opacity-30 blur-sm"></div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[textSize]} font-bold text-white tracking-tight ${animated ? "animate-pulse" : ""}`}>
            Alert360
          </span>
          {(size === 'md' || size === 'lg') && (
            <div className="flex items-center space-x-1">
              <div className={`${size === 'md' ? 'w-3 h-0.5' : 'w-4 h-0.5'} bg-gradient-to-r from-electric-blue to-lime-green rounded-full`}></div>
              <span className={`${size === 'md' ? 'text-xs' : 'text-sm'} text-gray-400 font-medium tracking-wide`}>
                AI DETECTION
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
