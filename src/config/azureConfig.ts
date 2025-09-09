// Azure Configuration
// Replace these with your actual Azure OpenAI credentials

export const azureConfig = {
  openai: {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || 'https://your-resource.openai.azure.com/',
    key: import.meta.env.VITE_AZURE_OPENAI_KEY || 'your-api-key-here',
    deployment: 'gpt-4' // or your deployment name
  },
  sql: {
    server: import.meta.env.VITE_AZURE_SQL_SERVER || 'your-server.database.windows.net',
    database: import.meta.env.VITE_AZURE_SQL_DATABASE || 'irs-assistant-db',
    user: import.meta.env.VITE_AZURE_SQL_USER || 'admin',
    password: import.meta.env.VITE_AZURE_SQL_PASSWORD || 'your-password'
  }
};

// For demo purposes, we'll use mock data
export const isDemoMode = true;
