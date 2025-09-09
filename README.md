# IRS Assistant

An AI-powered React application for analyzing IRS tax documents and answering questions about your tax information.

## Features

- 📄 **Document Management**: Upload and manage IRS forms (W-2, 1099, 1040, etc.)
- 🤖 **AI Chat Interface**: Ask questions about your tax documents
- 📊 **Document Analysis**: Compare income between years and analyze tax data
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Vite and React 18

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Chat/           # Chat interface components
│   ├── IRSDocuments/   # Document management components
│   └── Layout/         # Layout components
├── hooks/              # Custom React hooks
├── store/              # Zustand store
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## Features Overview

### Document Upload

- Drag and drop or click to upload IRS documents
- Support for PDF, JPG, PNG formats
- Real-time processing status
- Document type detection

### AI Chat

- Natural language questions about your documents
- Context-aware responses
- Chat history management
- Real-time typing indicators

### Document Analysis

- Income comparison between years
- Tax form analysis
- Financial insights and recommendations

## Future Enhancements

- [ ] Real AI integration (OpenAI, Claude, etc.)
- [ ] Document OCR and data extraction
- [ ] Advanced analytics and insights
- [ ] Export functionality
- [ ] User authentication
- [ ] Cloud storage integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
