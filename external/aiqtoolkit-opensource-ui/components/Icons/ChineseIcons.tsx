import React from 'react';

// 中式色彩探索图标
export const ChineseColorIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="url(#chineseGradient)" stroke="currentColor" strokeWidth="1"/>
    <circle cx="8" cy="8" r="2" fill="#f00056" opacity="0.8"/>
    <circle cx="16" cy="8" r="2" fill="#00e079" opacity="0.8"/>
    <circle cx="8" cy="16" r="2" fill="#70f3ff" opacity="0.8"/>
    <circle cx="16" cy="16" r="2" fill="#ffa400" opacity="0.8"/>
    <defs>
      <linearGradient id="chineseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0fcff"/>
        <stop offset="50%" stopColor="#d6ecf0"/>
        <stop offset="100%" stopColor="#e9f1f6"/>
      </linearGradient>
    </defs>
  </svg>
);

// 中式画笔图标
export const ChineseBrushIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M3 21L12 12L21 3L18 6L15 9L12 12L9 15L6 18L3 21Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      fill="url(#brushGradient)"
    />
    <circle cx="18" cy="6" r="2" fill="#f00056"/>
    <defs>
      <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f2be45"/>
        <stop offset="100%" stopColor="#ff4c00"/>
      </linearGradient>
    </defs>
  </svg>
);

// 中式印章图标
export const ChineseSealIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <rect 
      x="4" 
      y="4" 
      width="16" 
      height="16" 
      rx="2" 
      fill="#f00056" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <text 
      x="12" 
      y="14" 
      textAnchor="middle" 
      fill="white" 
      fontSize="8" 
      fontFamily="serif"
    >
      色
    </text>
  </svg>
);

// 中式扇子图标
export const ChineseFanIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M12 20C12 20 4 16 4 8C4 6 6 4 12 4C18 4 20 6 20 8C20 16 12 20 12 20Z" 
      fill="url(#fanGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path d="M12 4L12 20" stroke="currentColor" strokeWidth="1"/>
    <path d="M8 6L12 20" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M16 6L12 20" stroke="currentColor" strokeWidth="0.5"/>
    <defs>
      <linearGradient id="fanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#70f3ff"/>
        <stop offset="50%" stopColor="#3de1ad"/>
        <stop offset="100%" stopColor="#f00056"/>
      </linearGradient>
    </defs>
  </svg>
);

// 中式竹子图标
export const ChineseBambooIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <rect x="10" y="2" width="4" height="20" fill="#00e079" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1"/>
    <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="1"/>
    <path d="M6 4L8 6L6 8" stroke="#1bd1a5" strokeWidth="2" fill="none"/>
    <path d="M18 4L16 6L18 8" stroke="#1bd1a5" strokeWidth="2" fill="none"/>
  </svg>
);

// 中式莲花图标
export const ChineseLotusIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <ellipse cx="12" cy="16" rx="8" ry="3" fill="#e4c6d0" opacity="0.6"/>
    <path 
      d="M12 8C10 8 8 10 8 12C8 14 10 16 12 16C14 16 16 14 16 12C16 10 14 8 12 8Z" 
      fill="#cca4e3"
    />
    <path 
      d="M6 12C6 10 8 8 10 8C8 6 6 8 6 12Z" 
      fill="#8d4bbb" 
      opacity="0.8"
    />
    <path 
      d="M18 12C18 10 16 8 14 8C16 6 18 8 18 12Z" 
      fill="#8d4bbb" 
      opacity="0.8"
    />
    <circle cx="12" cy="12" r="2" fill="#f2be45"/>
  </svg>
);

// 中式云纹图标
export const ChineseCloudIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M6 14C4 14 2 12 2 10C2 8 4 6 6 6C7 4 9 3 12 3C15 3 17 4 18 6C20 6 22 8 22 10C22 12 20 14 18 14H6Z" 
      fill="url(#cloudGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <circle cx="8" cy="10" r="1" fill="#70f3ff" opacity="0.6"/>
    <circle cx="12" cy="9" r="1" fill="#3de1ad" opacity="0.6"/>
    <circle cx="16" cy="10" r="1" fill="#f00056" opacity="0.6"/>
    <defs>
      <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0fcff"/>
        <stop offset="100%" stopColor="#d6ecf0"/>
      </linearGradient>
    </defs>
  </svg>
);

// 中式山水图标
export const ChineseMountainIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M2 20L8 8L12 12L16 6L22 20H2Z" 
      fill="url(#mountainGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <path 
      d="M4 18C6 16 8 16 10 18C12 16 14 16 16 18C18 16 20 16 22 18" 
      stroke="#70f3ff" 
      strokeWidth="2" 
      fill="none"
    />
    <defs>
      <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#758a99"/>
        <stop offset="100%" stopColor="#41555d"/>
      </linearGradient>
    </defs>
  </svg>
);

// 中式聊天气泡图标
export const ChineseChatIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M12 2C17 2 21 6 21 11C21 16 17 20 12 20L7 22L9 18C5 17 2 14 2 11C2 6 6 2 12 2Z" 
      fill="url(#chatGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <circle cx="8" cy="11" r="1.5" fill="#f00056"/>
    <circle cx="12" cy="11" r="1.5" fill="#00e079"/>
    <circle cx="16" cy="11" r="1.5" fill="#70f3ff"/>
    <defs>
      <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0fcff"/>
        <stop offset="100%" stopColor="#e9f1f6"/>
      </linearGradient>
    </defs>
  </svg>
);

// 中式调色盘图标
export const ChinesePaletteIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
  >
    <path 
      d="M12 2C17 2 21 6 21 11C21 13 20 15 18 16L16 18C15 19 13 19 12 18C11 17 11 15 12 14C13 13 13 11 12 10C11 9 9 9 8 10C7 11 7 13 8 14L10 16C11 17 11 19 10 20C9 21 7 21 6 20L4 18C2 15 2 11 2 11C2 6 6 2 12 2Z" 
      fill="url(#paletteGradient)" 
      stroke="currentColor" 
      strokeWidth="1"
    />
    <circle cx="8" cy="8" r="1" fill="#f00056"/>
    <circle cx="12" cy="6" r="1" fill="#ffa400"/>
    <circle cx="16" cy="8" r="1" fill="#00e079"/>
    <circle cx="14" cy="12" r="1" fill="#70f3ff"/>
    <circle cx="10" cy="14" r="1" fill="#8d4bbb"/>
    <defs>
      <linearGradient id="paletteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#f0fcff"/>
      </linearGradient>
    </defs>
  </svg>
);
