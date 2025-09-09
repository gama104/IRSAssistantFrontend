import { azureConfig } from '@/config/azureConfig';
import { Taxpayer, QueryResponse } from '@/types';

const API_BASE_URL = azureConfig.apiUrl;

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Taxpayers API
  async getTaxpayers(): Promise<Taxpayer[]> {
    return this.request<Taxpayer[]>('/api/v1/taxpayers');
  }

  // Chat API
  async processQuery(query: string, taxpayerId?: string, sessionId?: string): Promise<QueryResponse> {
    return this.request<QueryResponse>('/api/v1/chat/process-query', {
      method: 'POST',
      body: JSON.stringify({
        query,
        taxpayerId,
        sessionId: sessionId || 'default',
      }),
    });
  }

  // Status API
  async getStatus() {
    return this.request('/api/v1/status');
  }

  // Health API
  async getHealth() {
    return this.request('/api/v1/health');
  }
}

export const apiService = new ApiService();
export default apiService;
