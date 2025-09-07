import { useState, useEffect, useCallback } from 'react';

// 中式颜色映射
const chineseColorMap = {
  // 红色系关键词
  '红': 'red',
  '朱': 'red',
  '赤': 'red',
  '丹': 'red',
  '胭脂': 'red',
  '粉红': 'red',
  '桃红': 'red',
  '樱桃': 'red',
  '石榴': 'red',
  '火红': 'red',
  '绯红': 'red',
  '枣红': 'red',
  '殷红': 'red',
  
  // 绿色系关键词
  '绿': 'green',
  '青': 'green',
  '翠': 'green',
  '碧': 'green',
  '葱': 'green',
  '竹': 'green',
  '柳': 'green',
  '翡翠': 'green',
  '松': 'green',
  '艾': 'green',
  '嫩绿': 'green',
  '油绿': 'green',
  '草绿': 'green',
  
  // 蓝色系关键词
  '蓝': 'blue',
  '靛': 'blue',
  '蔚蓝': 'blue',
  '碧蓝': 'blue',
  '宝蓝': 'blue',
  '藏蓝': 'blue',
  '湖蓝': 'blue',
  '天蓝': 'blue',
  '群青': 'blue',
  '雪青': 'blue',
  '丁香': 'blue',
  '藕': 'blue',
  
  // 黄色系关键词
  '黄': 'yellow',
  '金': 'yellow',
  '杏': 'yellow',
  '橘': 'yellow',
  '橙': 'yellow',
  '姜': 'yellow',
  '茶': 'yellow',
  '驼': 'yellow',
  '栗': 'yellow',
  '棕': 'yellow',
  '褐': 'yellow',
  '琥珀': 'yellow',
  '秋': 'yellow',
  
  // 紫色系关键词
  '紫': 'purple',
  '紫檀': 'purple',
  '青莲': 'purple',
  '丁香': 'purple',
  '藕荷': 'purple',
  '黛': 'purple',
  
  // 白色系关键词
  '白': 'white',
  '雪': 'white',
  '霜': 'white',
  '月': 'white',
  '银': 'white',
  '象牙': 'white',
  '精白': 'white',
  '莹白': 'white',
  
  // 黑色系关键词
  '黑': 'black',
  '墨': 'black',
  '玄': 'black',
  '乌': 'black',
  '漆黑': 'black',
  '煤黑': 'black',
  '黝': 'black',
  '黯': 'black',
};

// 颜色主题配置
const colorThemes = {
  red: {
    primary: '#f00056',
    secondary: '#9d2933',
    accent: '#ff4c00',
    light: '#ffb3a7',
    gradient: 'from-chinese-red-light via-chinese-red-primary to-chinese-red-secondary',
    name: '红色系',
    poetry: '"红豆生南国，春来发几枝"',
  },
  green: {
    primary: '#00e079',
    secondary: '#1bd1a5',
    accent: '#3de1ad',
    light: '#7bcfa6',
    gradient: 'from-chinese-green-light via-chinese-green-primary to-chinese-green-secondary',
    name: '绿色系',
    poetry: '"春风又绿江南岸，明月何时照我还"',
  },
  blue: {
    primary: '#70f3ff',
    secondary: '#4b5cc4',
    accent: '#3eede7',
    light: '#b0a4e3',
    gradient: 'from-chinese-blue-light via-chinese-blue-primary to-chinese-blue-secondary',
    name: '蓝色系',
    poetry: '"蓝田日暖玉生烟，此情可待成追忆"',
  },
  yellow: {
    primary: '#ffa400',
    secondary: '#eacd76',
    accent: '#ff8c00',
    light: '#fff143',
    gradient: 'from-chinese-yellow-light via-chinese-yellow-primary to-chinese-yellow-secondary',
    name: '黄色系',
    poetry: '"黄河远上白云间，一片孤城万仞山"',
  },
  purple: {
    primary: '#8d4bbb',
    secondary: '#801dae',
    accent: '#cca4e3',
    light: '#e4c6d0',
    gradient: 'from-chinese-purple-light via-chinese-purple-primary to-chinese-purple-secondary',
    name: '紫色系',
    poetry: '"紫气东来三万里，函关初度五千年"',
  },
  white: {
    primary: '#ffffff',
    secondary: '#f0fcff',
    accent: '#d6ecf0',
    light: '#e9f1f6',
    gradient: 'from-chinese-white-secondary via-chinese-white-accent to-chinese-white-light',
    name: '白色系',
    poetry: '"白日依山尽，黄河入海流"',
  },
  black: {
    primary: '#000000',
    secondary: '#50616d',
    accent: '#41555d',
    light: '#758a99',
    gradient: 'from-chinese-black-light via-chinese-black-secondary to-chinese-black-accent',
    name: '黑色系',
    poetry: '"黑云压城城欲摧，甲光向日金鳞开"',
  },
};

export const useChineseColorTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('red');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 检测消息中的颜色关键词
  const detectColorFromMessage = useCallback((message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // 遍历颜色映射，找到匹配的关键词
    for (const [keyword, colorFamily] of Object.entries(chineseColorMap)) {
      if (lowerMessage.includes(keyword)) {
        return colorFamily;
      }
    }
    
    return null;
  }, []);

  // 更新主题
  const updateTheme = useCallback((newTheme: string) => {
    if (newTheme !== currentTheme && colorThemes[newTheme]) {
      setIsTransitioning(true);
      
      // 应用CSS变量
      const root = document.documentElement;
      const theme = colorThemes[newTheme];
      
      root.style.setProperty('--current-theme-primary', theme.primary);
      root.style.setProperty('--current-theme-secondary', theme.secondary);
      root.style.setProperty('--current-theme-accent', theme.accent);
      root.style.setProperty('--current-theme-light', theme.light);
      
      setTimeout(() => {
        setCurrentTheme(newTheme);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentTheme]);

  // 根据消息内容自动更新主题
  const updateThemeFromMessage = useCallback((message: string) => {
    const detectedColor = detectColorFromMessage(message);
    if (detectedColor) {
      updateTheme(detectedColor);
    }
  }, [detectColorFromMessage, updateTheme]);

  // 获取当前主题配置
  const getCurrentTheme = useCallback(() => {
    return colorThemes[currentTheme];
  }, [currentTheme]);

  // 获取所有可用主题
  const getAllThemes = useCallback(() => {
    return Object.entries(colorThemes).map(([key, theme]) => ({
      key,
      ...theme,
    }));
  }, []);

  // 随机切换主题
  const randomTheme = useCallback(() => {
    const themes = Object.keys(colorThemes);
    const randomIndex = Math.floor(Math.random() * themes.length);
    const randomThemeKey = themes[randomIndex];
    updateTheme(randomThemeKey);
  }, [updateTheme]);

  // 初始化时设置默认主题
  useEffect(() => {
    updateTheme('red');
  }, []);

  return {
    currentTheme,
    isTransitioning,
    updateTheme,
    updateThemeFromMessage,
    getCurrentTheme,
    getAllThemes,
    randomTheme,
    detectColorFromMessage,
  };
};
