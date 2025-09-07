import {
  IconArrowDown,
  IconBolt,
  IconPaperclip,
  IconPhoto,
  IconPlayerStop,
  IconRepeat,
  IconSend,
  IconTrash,
  IconMicrophone,
  IconPlayerStopFilled,
  IconMicrophone2,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  MutableRefObject,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'next-i18next';

import { Message } from '@/types/chat';

import HomeContext from '@/pages/api/home/home.context';
import { compressImage, getWorkflowName } from '@/utils/app/helper';
import { appConfig } from '@/utils/app/const';
import toast from 'react-hot-toast';
import { useChineseColorTheme } from '@/hooks/useChineseColorTheme';
import { ChineseColorIcon, ChineseChatIcon } from '@/components/Icons/ChineseIcons';


interface Props {
  onSend: (message: Message) => void;
  onRegenerate: () => void;
  onScrollDownClick: () => void;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
  showScrollDownButton: boolean;
  controller: Ref<AbortController>
}

export const ChatInput = ({
  onSend,
  onRegenerate,
  onScrollDownClick,
  textareaRef,
  showScrollDownButton,
  controller
}: Props) => {
  const { t } = useTranslation('chat');

  const {
    state: { selectedConversation, messageIsStreaming, loading, webSocketMode },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const workflow = "中式色彩探索" // 更改为中式色彩探索

  // 中式颜色主题
  const { getCurrentTheme } = useChineseColorTheme();
  const currentThemeConfig = getCurrentTheme();

  // todo add the audio file
  const recordingStartSound = new Audio('audio/recording.wav');

  const [content, setContent] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const fileInputRef = useRef(null);
  const [inputFile, setInputFile] = useState(null)
  const [inputFileExtension, setInputFileExtension] = useState('')
  const [inputFileContent, setInputFileContent] = useState('')
  const [inputFileContentCompressed, setInputFileContentCompressed] = useState('')
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const triggerFileUpload = () => {
    fileInputRef?.current.click();
  };

  const handleInputFileDelete = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputFile(null);
    setInputFileExtension('');
    setInputFileContent('');
    setInputFileContentCompressed('');
  };

  const handleFileChange = (e: { target: { files: any[]; value: null; }; }) => {
    const file = e.target.files[0]
    if (file) {
      // Reset the input value so the same file can be selected again if needed
      e.target.value = null
      const reader = new FileReader()
      reader.onload = (loadEvent) => {
        const fullBase64String = loadEvent.target?.result;
        processFile({ fullBase64String, file })
      };
      reader.readAsDataURL(file)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setContent(value);
  };

  const handleSend = () => {
    if (messageIsStreaming) {
      return;
    }

    // stop recognition if it's running
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    if (!content.trim() && !inputFile && !inputFileContent) {
      toast.error(t('Please enter a message'));
      return;
    }

    if (inputFile || inputFileContent) {
      onSend({
        role: 'user',
        content: content,
        attachments: [{
          content: inputFileContent,
          type: 'image'
        }]
      })
      setContent('');
      setInputFile(null)
      setInputFileExtension('')
      setInputFileContent('')
      setInputFileContentCompressed('');
    }

    else {
      onSend({ role: 'user', content })
      setContent('');
      setInputFile(null)
      setInputFileExtension('')
      setInputFileContent('')
      setInputFileContentCompressed('');
    }


    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === '/' && e.metaKey) {
      e.preventDefault();
    }
  };


  const handleStopConversation = () => {
    if(webSocketMode) {
      console.log('stop conversation is yet to be implemented');
      homeDispatch({ field: 'loading', value: false });
      homeDispatch({ field: 'messageIsStreaming', value: false });
      return 
    }
    else {
      try {
        controller?.current?.abort('aborted');
        setTimeout(() => {
          controller.current = new AbortController(); // Reset the controller
        }, 100);
      } catch (error) {
        console.log('error aborting - ', error);
      }
    }
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };


  const processFile = ({ fullBase64String, file }: { fullBase64String: string, file: File }) => {
    const [fileType] = file && file.type.split('/');
    if (!["image"].includes(fileType)) {
      alert(`Only supported file types are : ${["image"].join(', ')}`);
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      alert(`File size should not exceed : 2 MB`);
      return;
    }

    const base64WithoutPrefix = fullBase64String.replace(/^data:image\/[a-z]+;base64,/, '');
    const sizeInKB = (base64WithoutPrefix.length * 3 / 4) / 1024;
    // Compress image only if it larger than 200KB
    const shouldCompress = sizeInKB > 200;

    if (shouldCompress) {
      compressImage(fullBase64String, file.type, true, (compressedBase64: string) => {
        setInputFileContentCompressed(compressedBase64);
        setInputFileContent(fullBase64String);
        setInputFile(file?.name);
        const extension = file.name.split('.').pop() ?? 'jpg';
        setInputFileExtension(extension.toLowerCase());
      });
    } else {
      // If no compression is needed, use the original image data
      setInputFileContent(fullBase64String);
      setInputFileContentCompressed(fullBase64String);
      setInputFile(file.name);
      const extension = file.name.split('.').pop() ?? 'jpg';
      setInputFileExtension(extension.toLowerCase());
    }
  }


  const handleInitModal = () => {
    const selectedPrompt = filteredPrompts[activePromptIndex];
    if (selectedPrompt) {
      setContent((prevContent) => {
        const newContent = prevContent?.replace(
          /\/\w*$/,
          selectedPrompt.content,
        );
        return newContent;
      });
      handlePromptSelect(selectedPrompt);
    }
    setShowPromptList(false);
  };

  const parseVariables = (content: string) => {
    const regex = /{{(.*?)}}/g;
    const foundVariables = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      foundVariables.push(match[1]);
    }

    return foundVariables;
  };

  const handleSubmit = (updatedVariables: string[]) => {
    const newContent = content?.replace(/{{(.*?)}}/g, (match, variable) => {
      const index = variables.indexOf(variable);
      return updatedVariables[index];
    });

    setContent(newContent);

    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Additional handlers for drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); // Necessary to allow the drop event
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const fullBase64String = loadEvent.target?.result;
        processFile({ fullBase64String, file })
      };
      reader.readAsDataURL(file);

    }
  };

  const handlePaste = (event: { clipboardData: any; originalEvent: { clipboardData: any; }; }) => {
    const clipboardData = event.clipboardData || event.originalEvent.clipboardData;
    let items = clipboardData.items;
    let isImagePasted = false;

    if (items) {
      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          isImagePasted = true;
          const file = item.getAsFile();
          // Reading the image as Data URL (base64)
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            const fullBase64String = loadEvent.target?.result;
            processFile({ fullBase64String, file })
          };
          reader.readAsDataURL(file);
          break; // Stop checking after finding image, preventing any text setting
        }
      }
    }

    // Handle text only if no image was pasted
    if (!isImagePasted) {
      let text = clipboardData.getData('text/plain');
      if (text) {
        // setContent(text); // Set text content only if text is pasted
      }
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
        }`;
    }
  }, [content, textareaRef]);

  const handleSpeechToText = useCallback(() => {
    if (!recognitionRef.current) {
      const SpeechRecognition =
        window?.SpeechRecognition || window?.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setContent(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    }

    if (!isRecording) {
      // Play sound when recording starts
      recordingStartSound.play();
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div
      className={`absolute bottom-0 left-0 w-full border-transparent pt-6 ${isMobile() ? 'pb-14' : 'pb-4'}`}
      style={{
        background: `linear-gradient(to bottom, transparent, ${currentThemeConfig.light}20, ${currentThemeConfig.light}40)`,
      }}
    >
      <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] 2xl:mx-auto 2xl:max-w-5xl">
        {messageIsStreaming && (
          <button
            className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white md:mb-0 md:mt-2"
            onClick={handleStopConversation}
          >
            <IconPlayerStop size={16} /> {t('Stop Generating')}
          </button>
        )}

        {!messageIsStreaming &&
          selectedConversation &&
          selectedConversation.messages.length > 1 &&
          // selectedConversation.messages[selectedConversation.messages.length - 1].role === 'assistant' && 
          (
            <button
              className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white md:mb-0 md:mt-2"
              onClick={onRegenerate}
            >
              <IconRepeat size={16} /> {t('Regenerate response')}
            </button>
          )}

        <div
          className="relative mx-2 flex w-full flex-grow flex-col rounded-2xl chinese-card shadow-lg sm:mx-4"
          style={{
            borderColor: `${currentThemeConfig.light}60`,
            borderWidth: '2px',
          }}
        >
          <textarea
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 sm:p-3 sm:pl-12 bg-transparent p-0 py-3 pr-12 pl-12 text-chinese-black-primary dark:text-chinese-white-primary md:py-4 md:pl-12 outline-none chinese-scrollbar"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              minHeight: '44px',
              maxHeight: '400px',
              overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? 'auto' : 'hidden'}`,
            }}
            placeholder={isRecording ? '正在聆听...' : `请输入您想了解的中式颜色...`}
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...(appConfig?.fileUploadEnabled && {
              onDragOver: handleDragOver,
              onDrop: handleDrop,
              onPaste: handlePaste
            })}
          />
          {inputFile && inputFileContent &&
            <div>
              <div className="relative right-0 top-0 p-1 bg-[#91c438] dark:bg-green-700 text-black dark:text-white flex items-center justify-start gap-2 rounded-small">
                <IconPhoto
                  className="ml-8"
                  size={16}
                />
                <span >{inputFile}</span>
                <IconTrash
                  className="hover:text-[#ff1717e9] cursor-pointer"
                  size={16}
                  onClick={handleInputFileDelete}
                />
              </div>
            </div>
          }
          {
            appConfig?.fileUploadEnabled && !inputFile &&
            <>
              <button
                className="absolute right-10 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:text-[#76b900] dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
                onClick={triggerFileUpload}
              >
                {messageIsStreaming ? (
                  <></>
                ) : (
                  <>
                    <IconPaperclip size={18} />
                  </>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </>
          }
          <button
            onClick={handleSpeechToText}
            className={`absolute left-3 top-3 rounded-full p-2 transition-all duration-300 ${messageIsStreaming
              ? 'text-chinese-black-light opacity-50 cursor-not-allowed'
              : 'text-chinese-black-secondary hover:bg-chinese-gray-light hover:scale-110'
              }`}
            disabled={messageIsStreaming}
            style={{
              color: messageIsStreaming ? undefined : currentThemeConfig.secondary,
            }}
          >
            {isRecording ? (
              <IconPlayerStopFilled size={18} className="text-chinese-red-primary animate-pulse" />
            ) : (
              <IconMicrophone size={18} />
            )}
          </button>

          <div className="absolute left-3 top-1 pointer-events-none">
            <ChineseColorIcon size={16} className="text-chinese-black-light opacity-60" />
          </div>

          <button
            className={`absolute right-3 top-3 rounded-full p-2 transition-all duration-300 ${
              content.trim() && !messageIsStreaming
                ? 'chinese-button hover:scale-110 shadow-lg'
                : 'text-chinese-black-light opacity-50 cursor-not-allowed'
            }`}
            onClick={handleSend}
            disabled={!content.trim() || messageIsStreaming}
            style={{
              background: content.trim() && !messageIsStreaming
                ? `linear-gradient(135deg, ${currentThemeConfig.primary}, ${currentThemeConfig.accent})`
                : undefined,
            }}
          >
            {messageIsStreaming ? (
              <div
                className="h-4 w-4 animate-spin rounded-full border-t-2 opacity-60"
                style={{ borderColor: currentThemeConfig.primary }}
              ></div>
            ) : (
              <ChineseChatIcon size={18} className={content.trim() ? "text-white" : "text-chinese-black-light"} />
            )}
          </button>

          {showScrollDownButton && (
            <div className="absolute bottom-12 right-0 lg:bottom-2 lg:-right-10">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
                onClick={onScrollDownClick}
              >
                <IconArrowDown size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
