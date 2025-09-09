// Azure Configuration
export const azureConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://taxesassistant-d0crehccbvacbwek.eastus2-01.azurewebsites.net',
  openai: {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || 'https://irsassisstant.openai.azure.com/',
    key: import.meta.env.VITE_AZURE_OPENAI_KEY || 'your-api-key-here',
    deployment: 'gpt-4.1-mini'
  }
};

// Use real API in production
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
