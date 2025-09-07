import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { ChineseChatInput } from './Chat/ChineseChatInput';
import { ChineseChatMessage } from './Chat/ChineseChatMessage';
import { ChineseColorGrid } from './ColorDisplay/ChineseColorCard';
import { useChineseColorTheme } from '@/hooks/useChineseColorTheme';
import {
  ChineseColorIcon,
  ChineseBrushIcon,
  ChinesePaletteIcon,
  ChineseLotusIcon,
  ChineseCloudIcon,
  ChineseMountainIcon
} from './Icons/ChineseIcons';

// 导入原有的后端调用相关模块
import { v4 as uuidv4 } from 'uuid';
import HomeContext from '@/pages/api/home/home.context';
import { Message } from '@/types/chat';
import { ChatBody } from '@/types/chat';
import { Conversation } from '@/types/chat';
import { getEndpoint } from '@/utils/app/api';
import { webSocketMessageTypes } from '@/utils/app/const';
import { saveConversation, saveConversations } from '@/utils/app/conversation';
import toast from 'react-hot-toast';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react';

export const ChineseColorExplorer: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const controllerRef = useRef<AbortController>(new AbortController());
  const webSocketConnectedRef = useRef<boolean>(false);

  // 使用原有的 HomeContext
  const {
    state: {
      selectedConversation,
      conversations,
      messageIsStreaming,
      loading,
      chatHistory,
      webSocketConnected,
      webSocketMode,
      webSocketURL,
      webSocketSchema,
      chatCompletionURL,
      enableIntermediateSteps
    },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);
  
  const {
    currentTheme,
    isTransitioning,
    updateTheme,
    updateThemeFromMessage,
    getCurrentTheme,
    getAllThemes,
    randomTheme
  } = useChineseColorTheme();

  const currentThemeConfig = getCurrentTheme();

  // 新建对话功能
  const handleNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: uuidv4(),
      name: '新的色彩探索',
      messages: [],
      model: null,
      prompt: '',
      temperature: 1,
      folderId: null,
    };

    const updatedConversations = [newConversation, ...conversations];

    homeDispatch({ field: 'selectedConversation', value: newConversation });
    homeDispatch({ field: 'conversations', value: updatedConversations });

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    // 重置主题为默认
    updateTheme('red');
  }, [conversations, homeDispatch, updateTheme]);

  // 删除对话功能
  const handleDeleteConversation = useCallback((conversationId: string) => {
    const updatedConversations = conversations.filter(c => c.id !== conversationId);

    if (selectedConversation?.id === conversationId) {
      // 如果删除的是当前对话，选择第一个对话或创建新对话
      const nextConversation = updatedConversations[0] || null;
      homeDispatch({ field: 'selectedConversation', value: nextConversation });
    }

    homeDispatch({ field: 'conversations', value: updatedConversations });
    saveConversations(updatedConversations);
  }, [conversations, selectedConversation, homeDispatch]);

  // 重命名对话功能
  const handleRenameConversation = useCallback((conversationId: string, newName: string) => {
    const updatedConversations = conversations.map(c =>
      c.id === conversationId ? { ...c, name: newName } : c
    );

    if (selectedConversation?.id === conversationId) {
      homeDispatch({ field: 'selectedConversation', value: { ...selectedConversation, name: newName } });
    }

    homeDispatch({ field: 'conversations', value: updatedConversations });
    saveConversations(updatedConversations);
  }, [conversations, selectedConversation, homeDispatch]);

  // WebSocket 连接函数（从原有 Chat.tsx 复制）
  const connectWebSocket = useCallback(async (retryCount = 0): Promise<boolean> => {
    const maxRetries = 3;
    const retryDelay = 1000;

    return new Promise((resolve) => {
      const wsUrl = sessionStorage.getItem('webSocketURL') || webSocketURL;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected successfully!");
        homeDispatch({ field: "webSocketConnected", value: true });
        webSocketRef.current = ws;
        webSocketConnectedRef.current = true;
        resolve(true);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };

      ws.onclose = async () => {
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise((res) => setTimeout(res, retryDelay));
          console.log(`Retrying connection... Attempt ${retryCount}`);
          const success = await connectWebSocket(retryCount);
          resolve(success);
        } else {
          console.log("WebSocket connection failed after retries.");
          homeDispatch({ field: "webSocketConnected", value: false });
          webSocketConnectedRef.current = false;
          homeDispatch({ field: "loading", value: false });
          homeDispatch({ field: "messageIsStreaming", value: false });
          toast.error("WebSocket connection failed.");
          resolve(false);
        }
      };

      ws.onerror = (error) => {
        console.log("WebSocket connection error");
        homeDispatch({ field: "webSocketConnected", value: false });
        webSocketConnectedRef.current = false;
        homeDispatch({ field: "loading", value: false });
        homeDispatch({ field: "messageIsStreaming", value: false });
        ws.close();
      };
    });
  }, [webSocketURL, homeDispatch]);

  // WebSocket 消息处理函数（从原有 Chat.tsx 复制并简化）
  const handleWebSocketMessage = useCallback((message: any) => {
    homeDispatch({ field: 'loading', value: false });

    if (message?.status === 'complete') {
      setTimeout(() => {
        homeDispatch({ field: 'messageIsStreaming', value: false });
      }, 200);
    }

    if (message?.type === 'assistant_message' && message?.content) {
      // 更新对话中的助手消息
      if (selectedConversation) {
        const updatedMessages = [...selectedConversation.messages];
        const lastMessageIndex = updatedMessages.length - 1;

        if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].role === 'assistant') {
          // 更新现有的助手消息
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            content: message.content,
          };
        } else {
          // 添加新的助手消息
          updatedMessages.push({
            id: uuidv4(),
            role: 'assistant',
            content: message.content,
          });
        }

        const updatedConversation = {
          ...selectedConversation,
          messages: updatedMessages,
        };

        homeDispatch({
          field: 'selectedConversation',
          value: updatedConversation,
        });

        // 更新主题
        updateThemeFromMessage(message.content);
      }
    }
  }, [selectedConversation, homeDispatch, updateThemeFromMessage]);

  // 主要的发送消息函数（从原有 Chat.tsx 复制并适配）
  const handleSend = useCallback(async (content: string) => {
    if (!selectedConversation) return;

    const message: Message = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
    };

    // 更新主题
    updateThemeFromMessage(content);

    // 更新对话
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
    };

    homeDispatch({
      field: 'selectedConversation',
      value: updatedConversation,
    });

    homeDispatch({ field: 'loading', value: true });
    homeDispatch({ field: 'messageIsStreaming', value: true });

    // WebSocket 模式
    if (webSocketMode) {
      if (!webSocketConnectedRef.current) {
        const connected = await connectWebSocket();
        if (!connected) {
          console.log("WebSocket connection failed.");
          homeDispatch({ field: "loading", value: false });
          homeDispatch({ field: "messageIsStreaming", value: false });
          return;
        }
      }

      const chatMessages = chatHistory
        ? updatedConversation.messages.map((msg: Message) => ({
            role: msg.role,
            content: [{ type: 'text', text: msg.content?.trim() || '' }]
          }))
        : [{ role: 'user', content: [{ type: 'text', text: content.trim() }] }];

      const wsMessage = {
        type: webSocketMessageTypes.userMessage,
        schema_type: sessionStorage.getItem('webSocketSchema') || webSocketSchema,
        id: message.id,
        conversation_id: selectedConversation.id,
        content: { messages: chatMessages },
        timestamp: new Date().toISOString(),
      };

      webSocketRef.current?.send(JSON.stringify(wsMessage));
      return;
    }

    // HTTP API 模式
    const messagesCleaned = updatedConversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content.trim(),
    }));

    const chatBody: ChatBody = {
      messages: chatHistory ? messagesCleaned : [{ role: 'user', content: content }],
      chatCompletionURL: sessionStorage.getItem('chatCompletionURL') || chatCompletionURL,
      additionalProps: {
        enableIntermediateSteps: sessionStorage.getItem('enableIntermediateSteps')
          ? sessionStorage.getItem('enableIntermediateSteps') === 'true'
          : enableIntermediateSteps,
      }
    };

    const endpoint = getEndpoint({ service: 'chat' });
    const body = JSON.stringify(chatBody);

    try {
      const response = await fetch(`${window.location.origin}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Conversation-Id': selectedConversation.id || '',
        },
        signal: controllerRef.current.signal,
        body,
      });

      if (!response.ok) {
        homeDispatch({ field: 'loading', value: false });
        homeDispatch({ field: 'messageIsStreaming', value: false });
        toast.error(response.statusText);
        return;
      }

      const data = response.body;
      if (!data) {
        homeDispatch({ field: 'loading', value: false });
        homeDispatch({ field: 'messageIsStreaming', value: false });
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantMessage = '';

      // 添加助手消息占位符
      const assistantMessagePlaceholder: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
      };

      const updatedConversationWithAssistant = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessagePlaceholder],
      };

      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversationWithAssistant,
      });

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        assistantMessage += chunkValue;

        // 更新助手消息
        const updatedMessages = [...updatedConversationWithAssistant.messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...assistantMessagePlaceholder,
          content: assistantMessage,
        };

        const finalUpdatedConversation = {
          ...updatedConversationWithAssistant,
          messages: updatedMessages,
        };

        homeDispatch({
          field: 'selectedConversation',
          value: finalUpdatedConversation,
        });
      }

      homeDispatch({ field: 'loading', value: false });
      homeDispatch({ field: 'messageIsStreaming', value: false });

      // 更新主题
      updateThemeFromMessage(assistantMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      homeDispatch({ field: 'loading', value: false });
      homeDispatch({ field: 'messageIsStreaming', value: false });
      toast.error('发送消息时出错');
    }
  }, [
    selectedConversation,
    updateThemeFromMessage,
    homeDispatch,
    webSocketMode,
    connectWebSocket,
    chatHistory,
    webSocketSchema,
    chatCompletionURL,
    enableIntermediateSteps
  ]);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  // 确保有一个默认对话
  useEffect(() => {
    if (!selectedConversation && conversations.length === 0) {
      // 创建一个新的对话
      const newConversation = {
        id: uuidv4(),
        name: '中式色彩探索',
        messages: [],
        model: null,
        prompt: '',
        temperature: 1,
        folderId: null,
      };

      homeDispatch({
        field: 'selectedConversation',
        value: newConversation,
      });

      homeDispatch({
        field: 'conversations',
        value: [newConversation],
      });
    }
  }, [selectedConversation, conversations, homeDispatch]);

  // 处理发送消息（现在使用真实的后端调用）
  const handleSendMessage = async (content: string) => {
    await handleSend(content);
  };



  // 处理颜色检测
  const handleColorDetected = (colors: string[]) => {
    if (colors.length > 0) {
      updateThemeFromMessage(colors[0]);
    }
  };

  // 示例颜色数据
  const featuredColors = [
    {
      colorName: '胭脂',
      hexValue: '#9d2933',
      description: '女子装扮时用的胭脂的颜色，国画暗红色颜料',
      category: '红色系',
      poetry: '红豆生南国，春来发几枝',
      author: '王维',
      title: '相思'
    },
    {
      colorName: '翡翠色',
      hexValue: '#3de1ad',
      description: '翡翠鸟羽毛的青绿色，翡翠宝石的颜色',
      category: '绿色系',
      poetry: '春风又绿江南岸，明月何时照我还',
      author: '王安石',
      title: '泊船瓜洲'
    },
    {
      colorName: '蔚蓝',
      hexValue: '#70f3ff',
      description: '类似晴朗天空的颜色的一种蓝色',
      category: '蓝色系',
      poetry: '蓝田日暖玉生烟，此情可待成追忆',
      author: '李商隐',
      title: '锦瑟'
    }
  ];

  return (
    <div 
      className={`min-h-screen chinese-gradient-bg transition-all duration-1000 ${
        isTransitioning ? 'opacity-75' : 'opacity-100'
      }`}
      style={{
        background: `linear-gradient(135deg, ${currentThemeConfig.light}20, ${currentThemeConfig.primary}10, ${currentThemeConfig.secondary}20)`,
      }}
    >
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <ChineseCloudIcon 
          size={120} 
          className="absolute top-10 right-10 text-chinese-white-accent opacity-30 animate-pulse" 
        />
        <ChineseMountainIcon 
          size={100} 
          className="absolute bottom-20 left-10 text-chinese-black-light opacity-20" 
        />
        <ChineseLotusIcon 
          size={80} 
          className="absolute top-1/3 left-1/4 text-chinese-purple-light opacity-25 animate-bounce" 
          style={{ animationDuration: '3s' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* 头部工具栏 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleNewConversation}
              className="chinese-button flex items-center gap-2 px-4 py-2 text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${currentThemeConfig.primary}, ${currentThemeConfig.accent})`,
              }}
            >
              <IconPlus size={16} className="text-white" />
              <span className="text-white">新建对话</span>
            </button>

            {/* 对话选择器 */}
            {conversations.length > 1 && (
              <select
                value={selectedConversation?.id || ''}
                onChange={(e) => {
                  const conversation = conversations.find(c => c.id === e.target.value);
                  if (conversation) {
                    homeDispatch({ field: 'selectedConversation', value: conversation });
                  }
                }}
                className="chinese-input px-3 py-2 text-sm rounded-lg border-2"
                style={{
                  borderColor: currentThemeConfig.light,
                  maxWidth: '200px',
                }}
              >
                {conversations.map((conv) => (
                  <option key={conv.id} value={conv.id}>
                    {conv.name || '未命名对话'}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 主题切换器 */}
            <div className="flex gap-2">
              {getAllThemes().map((theme, index) => (
                <div
                  key={theme.key}
                  className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
                    theme.key === currentTheme ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: theme.primary }}
                  onClick={() => updateTheme(theme.key)}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 头部标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <ChinesePaletteIcon size={48} className="text-chinese-red-primary" />
            <h1 className="text-4xl md:text-5xl font-bold chinese-title">
              中式色彩探索
            </h1>
            <ChineseBrushIcon size={48} className="text-chinese-green-primary" />
          </div>
          <p className="text-xl text-chinese-black-secondary dark:text-chinese-white-accent">
            {currentThemeConfig.poetry}
          </p>
          {selectedConversation && (
            <p className="text-sm text-chinese-black-light dark:text-chinese-white-light mt-2">
              当前对话: {selectedConversation.name}
            </p>
          )}
        </div>

        {/* 聊天区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主聊天区域 */}
          <div className="lg:col-span-2">
            <div className="chinese-card min-h-[500px] flex flex-col">
              {/* 消息列表 */}
              <div className="flex-1 p-6 overflow-y-auto chinese-scrollbar">
                {!selectedConversation?.messages || selectedConversation.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <ChineseColorIcon size={64} className="mx-auto mb-4 text-chinese-black-light" />
                    <p className="text-chinese-black-secondary dark:text-chinese-white-accent text-lg">
                      开始您的中式色彩探索之旅
                    </p>
                    <p className="text-chinese-black-light dark:text-chinese-white-light text-sm mt-2">
                      询问任何关于中国传统颜色的问题
                    </p>
                  </div>
                ) : (
                  <>
                    {selectedConversation.messages.map((message, index) => (
                      <ChineseChatMessage
                        key={message.id || index}
                        message={{
                          role: message.role,
                          content: message.content,
                          timestamp: new Date(), // 可以从消息中获取实际时间戳
                        }}
                        currentTheme={currentThemeConfig}
                        onColorDetected={handleColorDetected}
                      />
                    ))}
                    {(loading || messageIsStreaming) && (
                      <div className="flex justify-start mb-6">
                        <div className="chinese-chat-assistant max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <ChineseColorIcon size={16} className="animate-spin" />
                            <span>正在思考中...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="border-t border-chinese-gray-light p-4">
                <ChineseChatInput
                  onSend={handleSendMessage}
                  disabled={loading || messageIsStreaming}
                  currentTheme={currentThemeConfig}
                />
              </div>
            </div>
          </div>

          {/* 侧边栏 - 精选颜色 */}
          <div className="lg:col-span-1">
            <div className="chinese-card p-6">
              <h3 className="text-xl font-bold chinese-title mb-4 flex items-center gap-2">
                <ChineseColorIcon size={20} />
                精选色彩
              </h3>
              <div className="space-y-4">
                {featuredColors.map((color, index) => (
                  <div
                    key={color.colorName}
                    className="cursor-pointer transform hover:scale-105 transition-all duration-300"
                    onClick={() => !loading && !messageIsStreaming && handleSendMessage(`请介绍一下${color.colorName}这个颜色`)}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-chinese-gray-light">
                      <div
                        className="w-8 h-8 rounded-full shadow-md"
                        style={{ backgroundColor: color.hexValue }}
                      />
                      <div>
                        <div className="font-medium text-chinese-black-primary">
                          {color.colorName}
                        </div>
                        <div className="text-xs text-chinese-black-light">
                          {color.category}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
