import React, { useState, useRef, useEffect } from 'react';
import { ChineseBrushIcon, ChineseChatIcon, ChineseColorIcon } from '@/components/Icons/ChineseIcons';

interface ChineseChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  currentTheme?: any;
}

export const ChineseChatInput: React.FC<ChineseChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "请输入您想了解的中式颜色...",
  currentTheme,
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 建议的查询示例
  const suggestions = [
    "胭脂色是什么颜色？",
    "红色系的传统颜色有哪些？",
    "与蓝色相关的诗词",
    "翡翠色的文化含义",
    "黄色系颜色的历史",
    "紫色在古代的象征意义",
    "中国传统绿色有哪些？",
    "墨色和黑色的区别",
  ];

  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [suggestions.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // 自动调整高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const themeColors = currentTheme || {
    primary: '#f00056',
    secondary: '#9d2933',
    accent: '#ff4c00',
    light: '#ffb3a7',
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* 建议查询 */}
      {!message && !isFocused && (
        <div className="mb-4 text-center">
          <div className="text-sm text-chinese-black-light dark:text-chinese-white-light mb-2">
            试试问我：
          </div>
          <div 
            className="inline-block px-4 py-2 bg-chinese-white-accent dark:bg-chinese-black-light rounded-full cursor-pointer hover:bg-chinese-gray-light transition-all duration-300 chinese-animate-fade-in"
            onClick={() => handleSuggestionClick(suggestions[currentSuggestion])}
            style={{
              borderColor: themeColors.light,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <span className="text-chinese-black-secondary dark:text-chinese-white-accent">
              {suggestions[currentSuggestion]}
            </span>
          </div>
        </div>
      )}

      {/* 输入框容器 */}
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`chinese-card relative transition-all duration-300 ${
            isFocused ? 'ring-2' : ''
          }`}
          style={{
            ringColor: isFocused ? themeColors.primary : 'transparent',
          }}
        >
          {/* 装饰性图标 */}
          <div className="absolute left-4 top-4 z-10">
            <ChineseColorIcon 
              size={20} 
              className="text-chinese-black-light dark:text-chinese-white-light" 
            />
          </div>

          {/* 文本输入区域 */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`
              w-full pl-12 pr-16 py-4 
              bg-transparent border-none outline-none resize-none
              text-chinese-black-primary dark:text-chinese-white-primary
              placeholder-chinese-black-light dark:placeholder-chinese-white-light
              chinese-scrollbar
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{
              minHeight: '56px',
              maxHeight: '200px',
              fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
            }}
          />

          {/* 发送按钮 */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`
              absolute right-4 top-1/2 transform -translate-y-1/2
              w-10 h-10 rounded-full flex items-center justify-center
              transition-all duration-300
              ${message.trim() && !disabled
                ? 'chinese-button hover:scale-110' 
                : 'bg-chinese-gray-light text-chinese-black-light cursor-not-allowed'
              }
            `}
            style={{
              background: message.trim() && !disabled 
                ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accent})`
                : undefined,
            }}
          >
            <ChineseChatIcon size={20} className="text-white" />
          </button>
        </div>

        {/* 输入提示 */}
        <div className="flex justify-between items-center mt-2 px-2 text-xs text-chinese-black-light dark:text-chinese-white-light">
          <span>按 Enter 发送，Shift + Enter 换行</span>
          <span>{message.length}/500</span>
        </div>
      </form>

      {/* 快捷操作按钮 */}
      <div className="flex justify-center gap-2 mt-4">
        {['红色', '绿色', '蓝色', '黄色', '紫色'].map((color, index) => (
          <button
            key={color}
            onClick={() => handleSuggestionClick(`${color}系的传统颜色有哪些？`)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              transition-all duration-300 hover:scale-105
              chinese-animate-fade-in
            `}
            style={{
              backgroundColor: [
                '#ffb3a7', '#7bcfa6', '#b0a4e3', '#fff143', '#e4c6d0'
              ][index],
              color: '#41555d',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
};
