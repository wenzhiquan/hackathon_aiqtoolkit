/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 中式色彩系统
        chinese: {
          red: {
            primary: '#f00056', // 品红
            secondary: '#9d2933', // 胭脂
            accent: '#ff4c00', // 朱红
            light: '#ffb3a7', // 粉红
          },
          green: {
            primary: '#00e079', // 葱青
            secondary: '#1bd1a5', // 碧色
            accent: '#3de1ad', // 翡翠色
            light: '#7bcfa6', // 青翠
          },
          blue: {
            primary: '#70f3ff', // 蓝
            secondary: '#4b5cc4', // 宝蓝
            accent: '#3eede7', // 碧蓝
            light: '#b0a4e3', // 雪青
          },
          yellow: {
            primary: '#ffa400', // 杏黄
            secondary: '#eacd76', // 金色
            accent: '#ff8c00', // 姜黄
            light: '#fff143', // 鹅黄
          },
          purple: {
            primary: '#8d4bbb', // 紫色
            secondary: '#801dae', // 青莲
            accent: '#cca4e3', // 丁香色
            light: '#e4c6d0', // 藕荷色
          },
          white: {
            primary: '#ffffff', // 精白
            secondary: '#f0fcff', // 雪白
            accent: '#d6ecf0', // 月白
            light: '#e9f1f6', // 霜色
          },
          black: {
            primary: '#000000', // 黑色
            secondary: '#50616d', // 墨色
            accent: '#41555d', // 黝黑
            light: '#758a99', // 墨灰
          },
          gold: '#f2be45', // 赤金
          silver: '#e9e7ef', // 银白
          copper: '#549688', // 铜绿
        },
      },
      screens: {
        'xs': '320px',  // Extra small screen breakpoint
        'sm': '344px',  // Small screen breakpoint
        'base': '768px',
        'md': '960px',
        'lg': '1440px',
      },
      fontSize: {
        'xs': ['0.6rem', { lineHeight: '1rem' }],    // Extra small screen font size
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // Small screen font size
        'base': ['0.9rem', { lineHeight: '1.5rem' }],    // Base font size
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // Large screen font size
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // Extra large screen font size
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, -2px)' },
          '80%': { transform: 'translate(2px, 2px)' },
          '100%': { transform: 'translate(0)' },
        },
        ghost: {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        flash: {
          '0%': { backgroundColor: 'rgba(255, 255, 255, 0)' },
          '50%': { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
          '100%': { backgroundColor: 'rgba(255, 255, 255, 0)' },
        },
        crack1: {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '20%': {
            transform: 'scale(1.05)',
            opacity: '0.8',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '0.6',
          },
          '60%': {
            transform: 'scale(0.95)',
            opacity: '0.4',
          },
          '80%': {
            transform: 'scale(1)',
            opacity: '0.2',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0',
          },
        },
        darken: {
          '0%': { backgroundColor: 'rgba(0, 0, 0, 0)' },
          '100%': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        },
        crack: {
          '0%': { backgroundSize: '100%', opacity: '1' },
          '50%': { backgroundSize: '120%', opacity: '1' },
          '100%': { backgroundSize: '100%', opacity: '0' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        flicker: 'flicker 1.5s infinite',
        glitch: 'glitch 1s infinite',
        ghost: 'ghost 3s ease-in-out infinite',
        flash: 'flash 0.5s ease-in-out', // Add your flash animation here
        crack: 'crack 0.6s ease-in-out forwards',
        darken: 'darken 1s forwards',
        loadingBar: 'loadingBar 2s ease-in-out infinite',
      },
    },
  },

  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
