import React from "react";
import { FileText, Bot, Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-irs-600 dark:bg-irs-500 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              IRS Assistant
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered tax document analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Bot className="h-4 w-4" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
