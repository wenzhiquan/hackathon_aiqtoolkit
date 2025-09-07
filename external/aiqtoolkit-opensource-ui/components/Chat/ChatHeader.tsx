'use client'

import { env } from 'next-runtime-env'

import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  IconArrowsSort,
  IconMobiledataOff,
  IconSun,
  IconMoonFilled,
  IconUserFilled,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import {
  ChineseColorIcon,
  ChineseBrushIcon,
  ChinesePaletteIcon,
  ChineseChatIcon
} from '@/components/Icons/ChineseIcons';
import HomeContext from '@/pages/api/home/home.context';
import { getWorkflowName } from '@/utils/app/helper';

export const ChatHeader = ({ webSocketModeRef = {} }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(env('NEXT_PUBLIC_RIGHT_MENU_OPEN') === 'true' || process?.env?.NEXT_PUBLIC_RIGHT_MENU_OPEN === 'true' ? true : false);
    const menuRef = useRef(null);

    const workflow = "中式色彩探索" // 更改为中式色彩探索

    const {
        state: {
          chatHistory,
          webSocketMode,
          webSocketConnected,
          lightMode,
          selectedConversation
        },
        dispatch: homeDispatch,
      } = useContext(HomeContext);
    
    
    const handleLogin = () => {
        console.log('Login clicked');
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`top-0 z-10 flex justify-center items-center h-16 ${selectedConversation?.messages?.length === 0 ? 'bg-gradient-to-r from-chinese-red-light via-chinese-white-accent to-chinese-blue-light' : 'chinese-gradient-red sticky'}  py-2 px-4 text-sm text-white dark:border-none dark:bg-gradient-to-r dark:from-chinese-black-secondary dark:to-chinese-black-accent dark:text-neutral-200`}>
            {
                selectedConversation?.messages?.length > 0 ?
                <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-3`}>
                    <ChineseColorIcon size={28} className="text-white" />
                    <span className="text-xl font-bold text-white chinese-title">{workflow}</span>
                </div>
                :
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto flex flex-col items-center space-y-6 md:space-y-8 px-3 pt-5 md:pt-12 sm:max-w-[700px] text-center">
                  <div className="flex items-center gap-4 mb-4">
                    <ChinesePaletteIcon size={48} className="text-chinese-red-primary" />
                    <div className="text-4xl md:text-5xl font-bold chinese-title">
                      {workflow}
                    </div>
                    <ChineseBrushIcon size={48} className="text-chinese-green-primary" />
                  </div>
                  <div className="text-xl md:text-2xl text-chinese-black-secondary dark:text-chinese-white-accent font-medium">
                    探索中华传统色彩之美
                  </div>
                  <div className="text-lg text-chinese-black-light dark:text-chinese-white-light">
                    与我对话，发现传统颜色的文化内涵与诗词之韵
                  </div>
                  <div className="flex gap-4 mt-6">
                    <div className="w-4 h-4 rounded-full bg-chinese-red-primary animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-chinese-green-primary animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-4 h-4 rounded-full bg-chinese-blue-primary animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <div className="w-4 h-4 rounded-full bg-chinese-yellow-primary animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    <div className="w-4 h-4 rounded-full bg-chinese-purple-primary animate-pulse" style={{animationDelay: '0.8s'}}></div>
                  </div>
                </div>
            }

            {/* Collapsible Menu */}
            <div className={`fixed right-0 top-0 h-12 flex items-center transition-all duration-300 ${isExpanded ? 'mr-2' : 'mr-2'}`}>
                <button 
                    onClick={() => {
                        setIsExpanded(!isExpanded)}
                    }
                    className="flex p-1 text-black dark:text-white transition-colors"
                >
                    {isExpanded ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />}
                </button>

                <div className={`flex sm: gap-1 md:gap-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                    {/* Chat History Toggle */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                            <span className="text-sm font-medium text-black dark:text-white">Chat History</span>
                            <div
                                onClick={() => {
                                    homeDispatch({
                                        field: 'chatHistory',
                                        value: !chatHistory,
                                    });
                                }}
                                className={`relative inline-flex h-5 w-10 items-center cursor-pointer rounded-full transition-colors duration-300 ease-in-out ${
                                    chatHistory ? 'bg-black dark:bg-[#76b900]' : 'bg-gray-200'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                                    chatHistory ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                            </div>
                        </label>
                    </div>

                    {/* WebSocket Mode Toggle */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                            <span className={`flex items-center gap-1 justify-evenly text-sm font-medium text-black dark:text-white`}>
                                WebSocket{' '}
                                {webSocketModeRef?.current && (
                                    webSocketConnected ? <IconArrowsSort size={18} color="black" /> : <IconMobiledataOff size={18} color="black" />
                                )}
                            </span>
                            <div
                                onClick={() => {
                                    const newWebSocketMode = !webSocketModeRef.current;
                                    sessionStorage.setItem('webSocketMode', String(newWebSocketMode));
                                    webSocketModeRef.current = newWebSocketMode;
                                    homeDispatch({
                                        field: 'webSocketMode',
                                        value: !webSocketMode,
                                    });
                                }}
                                className={`relative inline-flex h-5 w-10 items-center cursor-pointer rounded-full transition-colors duration-300 ease-in-out ${
                                    webSocketModeRef.current ? 'bg-black dark:bg-[#76b900]' : 'bg-gray-200'
                                }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                                    webSocketModeRef.current ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                            </div>
                        </label>
                    </div>

                    {/* Theme Toggle Button */}
                    <div className="flex items-center dark:text-white text-black transition-colors duration-300">
                        <button
                            onClick={() => {
                                const newMode = lightMode === 'dark' ? 'light' : 'dark';
                                homeDispatch({
                                    field: 'lightMode',
                                    value: newMode,
                                });
                            }}
                            className="rounded-full flex items-center justify-center bg-none dark:bg-gray-700 transition-colors duration-300 focus:outline-none"
                        >
                            {lightMode === 'dark' ? (
                                <IconSun className="w-6 h-6 text-yellow-500 transition-transform duration-300" />
                            ) : (
                                <IconMoonFilled className="w-6 h-6 text-gray-800 transition-transform duration-300" />
                            )}
                        </button>
                    </div>

                    {/* User Icon with Dropdown Menu */}
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center dark:text-white text-black cursor-pointer"
                        >
                            <IconUserFilled size={20} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 px-2 w-auto rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <button
                                        onClick={handleLogin}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};