import React, { useState } from 'react';
import { ChineseColorIcon, ChineseBrushIcon } from '@/components/Icons/ChineseIcons';

interface ChineseColorCardProps {
  colorName: string;
  hexValue: string;
  description: string;
  category: string;
  poetry?: string;
  author?: string;
  title?: string;
  className?: string;
}

export const ChineseColorCard: React.FC<ChineseColorCardProps> = ({
  colorName,
  hexValue,
  description,
  category,
  poetry,
  author,
  title,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyHex = async () => {
    try {
      await navigator.clipboard.writeText(hexValue);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy color code:', err);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(hexValue);

  return (
    <div 
      className={`chinese-color-card chinese-animate-fade-in ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: isHovered ? hexValue : 'transparent',
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* 颜色样本 */}
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="chinese-color-swatch flex-shrink-0 cursor-pointer transition-all duration-300"
          style={{ 
            backgroundColor: hexValue,
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
          onClick={handleCopyHex}
          title="点击复制色值"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-chinese-black-primary dark:text-chinese-white-primary">
              {colorName}
            </h3>
            <span className="text-sm px-2 py-1 rounded-full bg-chinese-gray-light text-chinese-black-secondary">
              {category}
            </span>
          </div>
          
          <div className="space-y-1 text-sm">
            <div 
              className="font-mono cursor-pointer hover:bg-chinese-gray-light rounded px-2 py-1 transition-colors"
              onClick={handleCopyHex}
            >
              <span className="text-chinese-black-light">HEX:</span> 
              <span className="font-semibold ml-1" style={{ color: hexValue }}>
                {hexValue}
              </span>
              {isCopied && (
                <span className="ml-2 text-chinese-green-primary text-xs">已复制!</span>
              )}
            </div>
            
            {rgb && (
              <div className="font-mono text-chinese-black-light">
                RGB: {rgb.r}, {rgb.g}, {rgb.b}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 颜色描述 */}
      <div className="mb-4">
        <p className="text-chinese-black-secondary dark:text-chinese-white-accent leading-relaxed">
          {description}
        </p>
      </div>

      {/* 诗词引用 */}
      {poetry && (
        <div className="chinese-poetry">
          <div className="flex items-start gap-2">
            <ChineseBrushIcon size={16} className="text-chinese-red-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-chinese-black-secondary dark:text-chinese-white-accent italic">
                {poetry}
              </p>
              {author && title && (
                <p className="text-xs text-chinese-black-light dark:text-chinese-white-light mt-1">
                  —— {author}《{title}》
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 悬停效果 */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-16 opacity-10 pointer-events-none transition-opacity duration-300"
          style={{ backgroundColor: hexValue }}
        />
      )}
    </div>
  );
};

// 颜色网格展示组件
interface ChineseColorGridProps {
  colors: Array<{
    colorName: string;
    hexValue: string;
    description: string;
    category: string;
    poetry?: string;
    author?: string;
    title?: string;
  }>;
  className?: string;
}

export const ChineseColorGrid: React.FC<ChineseColorGridProps> = ({
  colors,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {colors.map((color, index) => (
        <ChineseColorCard
          key={`${color.colorName}-${index}`}
          {...color}
          className="chinese-animate-fade-in"
        />
      ))}
    </div>
  );
};

// 颜色轮播组件
export const ChineseColorCarousel: React.FC<ChineseColorGridProps> = ({
  colors,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextColor = () => {
    setCurrentIndex((prev) => (prev + 1) % colors.length);
  };

  const prevColor = () => {
    setCurrentIndex((prev) => (prev - 1 + colors.length) % colors.length);
  };

  if (colors.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {colors.map((color, index) => (
            <div key={`carousel-${color.colorName}-${index}`} className="w-full flex-shrink-0">
              <ChineseColorCard {...color} />
            </div>
          ))}
        </div>
      </div>

      {/* 导航按钮 */}
      {colors.length > 1 && (
        <>
          <button
            onClick={prevColor}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 chinese-button w-10 h-10 rounded-full flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={nextColor}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 chinese-button w-10 h-10 rounded-full flex items-center justify-center"
          >
            →
          </button>
        </>
      )}

      {/* 指示器 */}
      {colors.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {colors.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-chinese-red-primary scale-125' 
                  : 'bg-chinese-gray-light hover:bg-chinese-red-light'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
