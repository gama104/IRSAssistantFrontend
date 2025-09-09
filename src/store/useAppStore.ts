import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState, IRSDocument, ChatMessage, ChatSession } from '@/types';

interface AppStore extends AppState {
  // Document actions
  addDocument: (document: Omit<IRSDocument, 'id' | 'uploadDate'>) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<IRSDocument>) => void;
  
  // Chat actions
  createSession: (title: string) => void;
  selectSession: (id: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearCurrentSession: () => void;
  
  // App actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      documents: [],
      currentSession: null,
      sessions: [],
      isLoading: false,
      error: null,

      // Document actions
      addDocument: (document) => {
        const newDocument: IRSDocument = {
          ...document,
          id: crypto.randomUUID(),
          uploadDate: new Date(),
        };
        
        set((state) => ({
          documents: [...state.documents, newDocument],
        }));
      },

      removeDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        }));
      },

      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        }));
      },

      // Chat actions
      createSession: (title) => {
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSession: newSession,
        }));
      },

      selectSession: (id) => {
        const session = get().sessions.find((s) => s.id === id);
        if (session) {
          set({ currentSession: session });
        }
      },

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        
        set((state) => {
          if (!state.currentSession) return state;
          
          const updatedSession = {
            ...state.currentSession,
            messages: [...state.currentSession.messages, newMessage],
            updatedAt: new Date(),
          };
          
          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) =>
              s.id === updatedSession.id ? updatedSession : s
            ),
          };
        });
      },

      clearCurrentSession: () => {
        set({ currentSession: null });
      },

      // App actions
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'irs-assistant-store',
    }
  )
);
