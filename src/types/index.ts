export interface IRSDocument {
  id: string;
  name: string;
  year: number;
  type: 'W-2' | '1099' | '1040' | 'Schedule A' | 'Schedule B' | 'Schedule C' | 'Other';
  status: 'uploaded' | 'processing' | 'ready';
  uploadDate: Date;
  fileSize?: number;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  relatedDocuments?: string[];
  data?: any[];
  sqlQuery?: string;
  confidence?: number;
  executionTime?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Taxpayer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface QueryResponse {
  response: string;
  sqlQuery?: string;
  data?: any[];
  confidence?: number;
  executionTimeMs?: number;
  errorMessage?: string;
  timestamp: string;
}

export interface AppState {
  documents: IRSDocument[];
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
}
