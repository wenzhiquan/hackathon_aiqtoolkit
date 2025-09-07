'use client';
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconPlayerPause,
  IconTrash,
  IconUser,
  IconVolume2,
} from '@tabler/icons-react';
import { FC, memo, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { updateConversation } from '@/utils/app/conversation';
import { Message } from '@/types/chat';
import HomeContext from '@/pages/api/home/home.context';
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { BotAvatar } from '@/components/Avatar/BotAvatar';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { getReactMarkDownCustomComponents } from '../Markdown/CustomComponents';
import { fixMalformedHtml, generateContentIntermediate } from '@/utils/app/helper';
import { useChineseColorTheme } from '@/hooks/useChineseColorTheme';
import { ChineseColorIcon, ChineseSealIcon, ChineseBrushIcon } from '@/components/Icons/ChineseIcons';

export interface Props {
  message: Message;
  messageIndex: number;
  onEdit?: (editedMessage: Message) => void;
}

export const ChatMessage: FC<Props> = memo(({ message, messageIndex, onEdit}) => {

  // return if the there is nothing to show
  // no message and no intermediate steps
  if (message?.content === ''
      && message?.intermediateSteps?.length === 0) {
    return
  }

  const { t } = useTranslation('chat');

  const {
    state: { selectedConversation, conversations, messageIsStreaming },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState(message.content);
  const [messagedCopied, setMessageCopied] = useState(false);

  // 中式颜色主题
  const { getCurrentTheme, updateThemeFromMessage } = useChineseColorTheme();
  const currentThemeConfig = getCurrentTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleEditMessage = () => {
    if (message.content != messageContent) {
      if (selectedConversation && onEdit) {
        onEdit({ ...message, content: messageContent });
      }
    }
    setIsEditing(false);
  };

  const handleDeleteMessage = () => {
    if (!selectedConversation) return;

    const { messages } = selectedConversation;
    const findIndex = messages.findIndex((elm) => elm === message);

    if (findIndex < 0) return;

    if (
      findIndex < messages.length - 1 &&
      messages[findIndex + 1].role === 'assistant'
    ) {
      messages.splice(findIndex, 2);
    } else {
      messages.splice(findIndex, 1);
    }
    const updatedConversation = {
      ...selectedConversation,
      messages,
    };

    const { single, all } = updateConversation(
      updatedConversation,
      conversations,
    );
    homeDispatch({ field: 'selectedConversation', value: single });
    homeDispatch({ field: 'conversations', value: all });
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
      e.preventDefault();
      handleEditMessage();
    }
  };

  const copyOnClick = () => {
    if (!navigator.clipboard) return;

    navigator.clipboard.writeText(message.content).then(() => {
      setMessageCopied(true);
      setTimeout(() => {
        setMessageCopied(false);
      }, 2000);
    });
  };

  useEffect(() => {
    setMessageContent(message.content);
  }, [message.content]);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const removeLinks = (text: string) => {
    // This regex matches http/https URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '');
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const textWithoutLinks = removeLinks(message?.content);
        const utterance = new SpeechSynthesisUtterance(textWithoutLinks);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        speechSynthesisRef.current = utterance;
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.log('Text-to-speech is not supported in your browser.');
    }
  };

  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const prepareContent = ({ 
    message = {}, 
    responseContent = true, 
    intermediateStepsContent = false, 
    role = 'assistant' 
  } = {}) => {
    const { content = '', intermediateSteps = [] } = message;
  
    if (role === 'user') return content.trim();
  
    let result = '';
    if (intermediateStepsContent) {
      result += generateContentIntermediate(intermediateSteps);
    }
    
    if (responseContent) {
      result += result ? `\n\n${content}` : content;
    }
  
    // fixing malformed html and removing extra spaces to avoid markdown issues
    return fixMalformedHtml(result)?.trim()?.replace(/\n\s+/, "\n ");
  };

  return (
    <div
      className={`group md:px-4 chinese-animate-fade-in ${
        message.role === 'assistant'
          ? 'chinese-chat-assistant-container'
          : 'chinese-chat-user-container'
      }`}
      style={{
        overflowWrap: 'anywhere',
        background: message.role === 'assistant'
          ? `linear-gradient(135deg, ${currentThemeConfig.light}10, transparent)`
          : `linear-gradient(135deg, ${currentThemeConfig.primary}05, transparent)`,
        borderBottom: `1px solid ${currentThemeConfig.light}40`,
      }}
    >
      <div className="relative m-auto flex text-base sm:w-[95%] 2xl:w-[60%] md:gap-6 sm:p-2 md:py-6 lg:px-0">
        <div className="min-w-[40px] text-right font-bold">
          {message.role === 'assistant' ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center chinese-gradient-red shadow-lg"
            >
              <ChineseColorIcon size={16} className="text-white" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center chinese-gradient-blue shadow-lg"
            >
              <ChineseSealIcon size={16} className="text-white" />
            </div>
          )}
        </div>

        <div className="w-full dark:prose-invert overflow-hidden">
          {message.role === 'user' ? (
            <div className="flex w-full">
              {isEditing ? (
                <div className="flex w-full flex-col">
                  <textarea
                    ref={textareaRef}
                    className="w-full resize-none whitespace-pre-wrap border-none dark:bg-[#343541]"
                    value={messageContent}
                    onChange={handleInputChange}
                    onKeyDown={handlePressEnter}
                    onCompositionStart={() => setIsTyping(true)}
                    onCompositionEnd={() => setIsTyping(false)}
                    style={{
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      padding: '0',
                      margin: '0',
                      overflow: 'hidden',
                    }}
                  />

                  <div className="mt-10 flex justify-center space-x-4">
                    <button
                      className="chinese-button h-[40px] px-6 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleEditMessage}
                      disabled={messageContent.trim().length <= 0}
                      style={{
                        background: messageContent.trim().length > 0
                          ? `linear-gradient(135deg, ${currentThemeConfig.primary}, ${currentThemeConfig.accent})`
                          : undefined,
                      }}
                    >
                      {t('Save & Submit')}
                    </button>
                    <button
                      className="h-[40px] rounded-xl border-2 px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        borderColor: currentThemeConfig.light,
                        color: currentThemeConfig.secondary,
                      }}
                      onClick={() => {
                        setMessageContent(message.content);
                        setIsEditing(false);
                      }}
                    >
                      {t('Cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose whitespace-pre-wrap dark:prose-invert flex-1 w-full overflow-x-auto">
                  <ReactMarkdown
                    className="prose dark:prose-invert flex-1 w-full flex-grow max-w-full whitespace-normal"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw] as any}
                    linkTarget="_blank"
                    components={getReactMarkDownCustomComponents(messageIndex, message?.id)}
                  >
                    {prepareContent({ message, role: 'user' })}
                  </ReactMarkdown>
                </div>
              )}

              {!isEditing && (
                <div className="absolute right-2 flex flex-col md:flex-row gap-1 items-center md:items-start justify-end md:justify-start">
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={toggleEditing}
                  >
                    <IconEdit size={20} />
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={handleDeleteMessage}
                  >
                    <IconTrash size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col w-[90%]">
              <div className="flex flex-col gap-2">    
                {/* for intermediate steps content  */}
                <div className="overflow-x-auto">
                  <MemoizedReactMarkdown
                    className="prose dark:prose-invert flex-1 w-full flex-grow max-w-full whitespace-normal"
                    rehypePlugins={[rehypeRaw] as any}
                    remarkPlugins={[
                      remarkGfm, 
                      [remarkMath, {
                        singleDollarTextMath: false,
                      }]
                    ]}
                    linkTarget="_blank"
                    components={getReactMarkDownCustomComponents(messageIndex, message?.id)}
                  >
                    {prepareContent({ message, role: 'assistant', intermediateStepsContent: true, responseContent: false })}
                  </MemoizedReactMarkdown>
                </div>
                {/* for response content */}
                <div className="overflow-x-auto">
                  <MemoizedReactMarkdown
                    className="prose dark:prose-invert flex-1 w-full flex-grow max-w-full whitespace-normal"
                    rehypePlugins={[rehypeRaw] as any}
                    remarkPlugins={[
                      remarkGfm, 
                      [remarkMath, {
                        singleDollarTextMath: false,
                      }]
                    ]}
                    linkTarget="_blank"
                    components={getReactMarkDownCustomComponents(messageIndex, message?.id)}
                  >
                    {prepareContent({ message, role: 'assistant', intermediateStepsContent: false, responseContent: true })}
                  </MemoizedReactMarkdown>
                </div>
                <div className="mt-3 flex gap-2">
                  {
                    !messageIsStreaming &&
                    <>
                      {messagedCopied ?
                        <IconCheck
                          size={18}
                          className="transition-all duration-300"
                          style={{ color: currentThemeConfig.primary }}
                          id={message?.id}
                        /> :
                        <button
                          className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-chinese-gray-light"
                          style={{ color: currentThemeConfig.secondary }}
                          onClick={copyOnClick}
                          title="复制到剪贴板"
                          id={message?.id}
                        >
                          <IconCopy size={18} />
                        </button>
                      }
                      <button
                        className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-chinese-gray-light"
                        style={{ color: currentThemeConfig.secondary }}
                        onClick={handleTextToSpeech}
                        aria-label={isPlaying ? "停止朗读" : "开始朗读"}
                      >
                        {isPlaying ? <IconPlayerPause size={18} className='animate-pulse text-chinese-red-primary' /> : <IconVolume2 size={18} />}
                      </button>
                    </>  
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
ChatMessage.displayName = 'ChatMessage';

