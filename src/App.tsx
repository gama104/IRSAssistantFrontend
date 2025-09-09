import React from "react";
import Header from "@/components/Layout/Header";
import EnhancedChatInterface from "@/components/Chat/EnhancedChatInterface";
import DemoInitializer from "@/components/Demo/DemoInitializer";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <DemoInitializer />
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Chat Interface - Full Width */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-[700px] transition-colors duration-200">
          <EnhancedChatInterface />
        </div>
      </main>
    </div>
  );
}

export default App;
