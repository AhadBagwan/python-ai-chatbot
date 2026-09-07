import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '../lib/utils';
import { STORAGE_KEYS } from '../lib/constants';

const useChatStore = create(
  persist(
    (set, get) => ({
      // State
      chats: [],
      activeChatId: null,
      isLoading: false,
      isStreaming: false,
      error: null,

      // Computed
      getActiveChat: () => {
        const { chats, activeChatId } = get();
        return chats.find(chat => chat.id === activeChatId);
      },

      getActiveChatMessages: () => {
        const chat = get().getActiveChat();
        return chat?.messages || [];
      },

      // Actions
      createChat: () => {
        const newChat = {
          id: generateId(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id,
          error: null,
        }));
        
        return newChat.id;
      },

      setActiveChat: (chatId) => {
        set({ activeChatId: chatId, error: null });
      },

      deleteChat: (chatId) => {
        set(state => {
          const newChats = state.chats.filter(chat => chat.id !== chatId);
          const newActiveChatId = state.activeChatId === chatId
            ? (newChats[0]?.id || null)
            : state.activeChatId;
          
          return {
            chats: newChats,
            activeChatId: newActiveChatId,
          };
        });
      },

      clearAllChats: () => {
        set({ chats: [], activeChatId: null });
      },

      updateChatTitle: (chatId, title) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, title, updatedAt: new Date().toISOString() }
              : chat
          ),
        }));
      },

      addMessage: (chatId, message) => {
        set(state => ({
          chats: state.chats.map(chat => {
            if (chat.id !== chatId) return chat;
            
            const newMessages = [...chat.messages, {
              id: generateId(),
              ...message,
              timestamp: new Date().toISOString(),
            }];
            
            // Auto-generate title from first user message
            let title = chat.title;
            if (chat.title === 'New Chat' && message.role === 'user') {
              title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
            }
            
            return {
              ...chat,
              messages: newMessages,
              title,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateLastMessage: (chatId, content) => {
        set(state => ({
          chats: state.chats.map(chat => {
            if (chat.id !== chatId) return chat;
            
            const messages = [...chat.messages];
            if (messages.length > 0) {
              messages[messages.length - 1] = {
                ...messages[messages.length - 1],
                content,
              };
            }
            
            return {
              ...chat,
              messages,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      setLoading: (isLoading) => set({ isLoading }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      setError: (error) => set({ error }),

      // Search chats
      searchChats: (query) => {
        const { chats } = get();
        if (!query) return chats;
        
        const lowerQuery = query.toLowerCase();
        return chats.filter(chat =>
          chat.title.toLowerCase().includes(lowerQuery) ||
          chat.messages.some(msg =>
            msg.content.toLowerCase().includes(lowerQuery)
          )
        );
      },
    }),
    {
      name: STORAGE_KEYS.CHATS,
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
      }),
    }
  )
);

export default useChatStore;
