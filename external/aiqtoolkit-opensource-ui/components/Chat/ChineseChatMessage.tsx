import React, { useState, useEffect } from 'react';
import { ChineseColorIcon, ChineseBrushIcon, ChineseSealIcon } from '@/components/Icons/ChineseIcons';
import { ChineseColorCard } from '@/components/ColorDisplay/ChineseColorCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ChineseChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
  };
  currentTheme?: any;
  onColorDetected?: (colors: string[]) => void;
}

// 美化的用户头像组件
const UserAvatar: React.FC<{ currentTheme: any }> = ({ currentTheme }) => {
  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
        }}
      >
        <ChineseSealIcon size={20} className="text-white" />
      </div>
      {/* 装饰性光环 */}
      <div
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${currentTheme.light}40, transparent)`,
          transform: 'scale(1.2)',
        }}
      />
    </div>
  );
};

// 美化的助手头像组件
const AssistantAvatar: React.FC<{ currentTheme: any }> = ({ currentTheme }) => {
  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.secondary}, ${currentTheme.primary})`,
        }}
      >
        <ChineseColorIcon size={20} className="text-white" />
      </div>
      {/* 装饰性光环 */}
      <div
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${currentTheme.light}40, transparent)`,
          transform: 'scale(1.2)',
          animationDelay: '0.5s',
        }}
      />
    </div>
  );
};

// Markdown 渲染组件
const MarkdownRenderer: React.FC<{ content: string; currentTheme: any }> = ({ content, currentTheme }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 自定义代码块样式
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              className="rounded-lg my-4"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className="px-2 py-1 rounded text-sm font-mono"
              style={{
                backgroundColor: `${currentTheme.light}20`,
                color: currentTheme.secondary,
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
        // 自定义标题样式
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 chinese-title" style={{ color: currentTheme.primary }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3 chinese-title" style={{ color: currentTheme.secondary }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold mb-2" style={{ color: currentTheme.accent }}>
            {children}
          </h3>
        ),
        // 自定义列表样式
        ul: ({ children }) => (
          <ul className="list-none space-y-2 my-4">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2">
            <span
              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
              style={{ backgroundColor: currentTheme.primary }}
            />
            <span>{children}</span>
          </li>
        ),
        // 自定义引用样式
        blockquote: ({ children }) => (
          <blockquote
            className="border-l-4 pl-4 py-2 my-4 italic chinese-poetry"
            style={{
              borderColor: currentTheme.primary,
              backgroundColor: `${currentTheme.light}10`,
            }}
          >
            {children}
          </blockquote>
        ),
        // 自定义表格样式
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th
            className="border px-4 py-2 text-left font-semibold"
            style={{
              borderColor: currentTheme.light,
              backgroundColor: `${currentTheme.primary}10`,
              color: currentTheme.secondary,
            }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td
            className="border px-4 py-2"
            style={{ borderColor: currentTheme.light }}
          >
            {children}
          </td>
        ),
        // 自定义链接样式
        a: ({ children, href }) => (
          <a
            href={href}
            className="underline hover:no-underline transition-colors duration-300"
            style={{ color: currentTheme.primary }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        // 自定义强调样式
        strong: ({ children }) => (
          <strong style={{ color: currentTheme.secondary, fontWeight: 'bold' }}>
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em style={{ color: currentTheme.accent, fontStyle: 'italic' }}>
            {children}
          </em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export const ChineseChatMessage: React.FC<ChineseChatMessageProps> = ({
  message,
  currentTheme,
  onColorDetected,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedColors, setDetectedColors] = useState<any[]>([]);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // 模拟打字效果（仅对助手消息）
  useEffect(() => {
    if (isAssistant && message.content) {
      setIsTyping(true);
      setDisplayedContent('');
      
      let index = 0;
      const content = message.content;
      
      const typeInterval = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
          
          // 检测颜色信息
          detectColorsInMessage(content);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, isAssistant]);

  // 检测消息中的颜色信息
  const detectColorsInMessage = (content: string) => {
    // 这里可以集成实际的颜色检测逻辑
    // 暂时使用模拟数据
    const colorPatterns = [
      { name: '胭脂', hex: '#9d2933', category: '红色系', description: '女子装扮时用的胭脂的颜色' },
      { name: '翡翠色', hex: '#3de1ad', category: '绿色系', description: '翡翠鸟羽毛的青绿色' },
      { name: '蔚蓝', hex: '#70f3ff', category: '蓝色系', description: '类似晴朗天空的颜色' },
    ];

    const foundColors = colorPatterns.filter(color => 
      content.includes(color.name)
    );

    if (foundColors.length > 0) {
      setDetectedColors(foundColors);
      onColorDetected?.(foundColors.map(c => c.name));
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 解析消息内容，提取诗词
  const parseMessageContent = (content: string) => {
    const poetryRegex = /"([^"]+)"\s*——\s*([^《]+)《([^》]+)》/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = poetryRegex.exec(content)) !== null) {
      // 添加诗词前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // 添加诗词
      parts.push({
        type: 'poetry',
        content: match[1],
        author: match[2],
        title: match[3]
      });

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余文本
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  const contentParts = parseMessageContent(displayedContent);

  const themeColors = currentTheme || {
    primary: '#f00056',
    secondary: '#9d2933',
    accent: '#ff4c00',
    light: '#ffb3a7',
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 chinese-animate-fade-in`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* 消息头部 */}
        <div className={`flex items-center gap-3 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {!isUser && <AssistantAvatar currentTheme={themeColors} />}

          <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <span className="text-sm font-medium text-chinese-black-secondary dark:text-chinese-white-accent">
              {isUser ? '您' : '中式色彩探索'}
            </span>
            {message.timestamp && (
              <span className="text-xs text-chinese-black-light dark:text-chinese-white-light">
                {formatTime(message.timestamp)}
              </span>
            )}
          </div>

          {isUser && <UserAvatar currentTheme={themeColors} />}
        </div>

        {/* 消息气泡 */}
        <div 
          className={`
            relative px-4 py-3 rounded-2xl shadow-lg
            ${isUser 
              ? 'chinese-chat-user ml-auto' 
              : 'chinese-chat-assistant mr-auto'
            }
          `}
          style={{
            background: isUser 
              ? `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.accent})`
              : undefined,
          }}
        >
          {/* 消息内容 */}
          <div className="space-y-3">
            {isUser ? (
              // 用户消息：简单文本显示
              <p className="leading-relaxed text-white font-medium">
                {displayedContent}
              </p>
            ) : (
              // 助手消息：Markdown 渲染
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={displayedContent} currentTheme={themeColors} />
              </div>
            )}
          </div>

          {/* 打字指示器 */}
          {isTyping && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-chinese-black-light rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-chinese-black-light rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-chinese-black-light rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          )}

          {/* 消息尾巴 */}
          <div 
            className={`absolute top-4 w-3 h-3 transform rotate-45 ${
              isUser 
                ? '-right-1 chinese-gradient-blue' 
                : '-left-1 bg-white dark:bg-chinese-black-light border border-chinese-gray-light'
            }`}
          />
        </div>

        {/* 检测到的颜色卡片 */}
        {detectedColors.length > 0 && !isTyping && (
          <div className="mt-4 space-y-3">
            <div className="text-sm text-chinese-black-light dark:text-chinese-white-light">
              相关颜色：
            </div>
            <div className="grid gap-3">
              {detectedColors.map((color, index) => (
                <ChineseColorCard
                  key={`detected-${color.name}-${index}`}
                  colorName={color.name}
                  hexValue={color.hex}
                  description={color.description}
                  category={color.category}
                  className="scale-90 origin-left"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
