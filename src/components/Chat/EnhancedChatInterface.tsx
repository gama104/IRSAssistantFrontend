import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";
import { apiService } from "@/services/api";
import { Taxpayer, QueryResponse } from "@/types";

const EnhancedChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedTaxpayer, setSelectedTaxpayer] = useState<Taxpayer | null>(
    null
  );
  const [taxpayers, setTaxpayers] = useState<Taxpayer[]>([]);
  const [isLoadingTaxpayers, setIsLoadingTaxpayers] = useState(false);
  const [showTaxpayerDropdown, setShowTaxpayerDropdown] = useState(false);
  const [showSamplePrompts, setShowSamplePrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentSession, sessions, addMessage, createSession, isLoading } =
    useAppStore();

  // Fetch taxpayers on component mount
  useEffect(() => {
    fetchTaxpayers();
  }, []);

  const fetchTaxpayers = async () => {
    setIsLoadingTaxpayers(true);
    try {
      console.log("Fetching taxpayers from API service");
      const data: Taxpayer[] = await apiService.getTaxpayers();
      console.log("Taxpayers data:", data);
      setTaxpayers(data);
      if (data.length > 0) {
        setSelectedTaxpayer(data[0]); // Select first taxpayer by default
      }
    } catch (error) {
      console.error("Error fetching taxpayers:", error);
    } finally {
      setIsLoadingTaxpayers(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedTaxpayer) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message
    addMessage({
      content: userMessage,
      role: "user",
    });

    // Set loading state
    useAppStore.getState().setLoading(true);

    try {
      // Call the real API
      const data: QueryResponse = await apiService.processQuery(
        userMessage,
        selectedTaxpayer.id,
        currentSession?.id
      );
      addMessage({
        content:
          data.response || "I couldn't process your request. Please try again.",
        role: "assistant",
        sqlQuery: data.sqlQuery,
        confidence: data.confidence,
        executionTime: data.executionTimeMs,
      });
    } catch (error) {
      console.error("Error calling API:", error);
      addMessage({
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
      });
    } finally {
      // Clear loading state
      useAppStore.getState().setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    createSession(`Chat ${sessions.length + 1}`);
  };

  // Sample prompts for demo - Updated to match actual database capabilities
  const samplePrompts = [
    {
      category: "💰 Income Analysis",
      prompts: [
        "Show me my complete financial picture for 2024",
        "How has my total income changed over the past 5 years?",
        "What was my income breakdown by source for 2023?",
        "Compare my 2022 and 2024 income",
      ],
    },
    {
      category: "🏠 Assets & Properties",
      prompts: [
        "What properties do I own and their current values?",
        "Show me my assets and their current values",
        "What's my debt-to-asset ratio?",
        "Show me my rental properties and their income",
      ],
    },
    {
      category: "📊 Tax Analysis",
      prompts: [
        "What's my tax efficiency - how much goes to taxes vs. what I keep?",
        "Show me my tax liability for 2023",
        "What tax credits am I eligible for?",
        "How has my AGI changed over 5 years?",
      ],
    },
    {
      category: "📈 Trends & Planning",
      prompts: [
        "What's my retirement readiness?",
        "Show me my income growth pattern",
        "What's my total asset portfolio value?",
        "How much equity do I have in my properties?",
      ],
    },
  ];

  const handleSamplePromptClick = async (prompt: string) => {
    if (isLoading || !selectedTaxpayer) return;

    // Add user message
    addMessage({
      content: prompt,
      role: "user",
    });

    // Set loading state
    useAppStore.getState().setLoading(true);

    try {
      // Call the real API
      const data: QueryResponse = await apiService.processQuery(
        prompt,
        selectedTaxpayer.id,
        currentSession?.id
      );
      addMessage({
        content:
          data.response || "I couldn't process your request. Please try again.",
        role: "assistant",
        sqlQuery: data.sqlQuery,
        confidence: data.confidence,
        executionTime: data.executionTimeMs,
      });
    } catch (error) {
      console.error("Error calling API:", error);
      addMessage({
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
      });
    } finally {
      // Clear loading state
      useAppStore.getState().setLoading(false);
    }
  };

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Start a new conversation
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Ask questions about your IRS documents
          </p>
          <button onClick={startNewChat} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sample Prompts Sidebar */}
      {showSamplePrompts && (
        <div className="w-full sm:w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col max-h-screen sm:relative absolute inset-0 z-10 sm:z-auto">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center text-sm sm:text-base">
                <Lightbulb className="h-4 w-4 mr-2" />
                Sample Questions
              </h3>
              <button
                onClick={() => setShowSamplePrompts(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tap any question to ask it
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
            {samplePrompts.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 px-1">
                  {category.category}
                </h4>
                <div className="space-y-1.5 sm:space-y-2">
                  {category.prompts.map((prompt, promptIndex) => (
                    <button
                      key={promptIndex}
                      onClick={() => handleSamplePromptClick(prompt)}
                      disabled={isLoading || !selectedTaxpayer}
                      className="w-full text-left p-2.5 sm:p-3 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 transform transition-all duration-150"
                    >
                      <span className="block leading-relaxed">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header with Taxpayer Selection */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
              {currentSession.title}
            </h3>
            <div className="flex items-center gap-1 sm:gap-2">
              {!showSamplePrompts && (
                <button
                  onClick={() => setShowSamplePrompts(true)}
                  className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                >
                  <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Sample Questions</span>
                  <span className="sm:hidden">Samples</span>
                </button>
              )}
              <button
                onClick={startNewChat}
                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">New Chat</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Taxpayer Selection */}
          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Taxpayer:
            </label>
            <button
              onClick={() => setShowTaxpayerDropdown(!showTaxpayerDropdown)}
              className="w-full flex items-center justify-between px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoadingTaxpayers}
            >
              <span className="text-left truncate">
                {selectedTaxpayer
                  ? `${selectedTaxpayer.firstName} ${selectedTaxpayer.lastName}`
                  : isLoadingTaxpayers
                  ? "Loading taxpayers..."
                  : "Select a taxpayer"}
              </span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ml-2" />
            </button>

            {showTaxpayerDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                {taxpayers.map((taxpayer) => (
                  <button
                    key={taxpayer.id}
                    onClick={() => {
                      setSelectedTaxpayer(taxpayer);
                      setShowTaxpayerDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                  >
                    {taxpayer.firstName} {taxpayer.lastName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
          {currentSession.messages.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base px-4">
                Ask me anything about{" "}
                {selectedTaxpayer ? `${selectedTaxpayer.firstName}'s` : "your"}{" "}
                tax data!
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-2 px-4">
                Try: "What was my total income last year?"
              </p>
            </div>
          ) : (
            currentSession.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-irs-100 dark:bg-irs-900 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-irs-600 dark:text-irs-400" />
                  </div>
                )}

                <div
                  className={cn(
                    message.role === "user"
                      ? "chat-message-user"
                      : "chat-message-assistant"
                  )}
                >
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {message.content}
                  </p>

                  {/* Show SQL query and metadata for assistant messages */}
                  {message.role === "assistant" && message.sqlQuery && (
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <details className="group">
                        <summary className="cursor-pointer text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                          <span className="group-open:hidden">
                            🔍 View SQL Query
                          </span>
                          <span className="hidden group-open:inline">
                            🔍 Hide SQL Query
                          </span>
                        </summary>
                        <div className="mt-2">
                          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded border overflow-x-auto">
                            <code>{message.sqlQuery}</code>
                          </pre>
                          {(message.confidence || message.executionTime) && (
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {message.confidence && (
                                <span>
                                  Confidence:{" "}
                                  {(message.confidence * 100).toFixed(1)}%
                                </span>
                              )}
                              {message.executionTime && (
                                <span>
                                  Execution: {message.executionTime}ms
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </details>
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-irs-100 dark:bg-irs-900 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-irs-600 dark:text-irs-400" />
              </div>
              <div className="chat-message-assistant">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Analyzing your tax data...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedTaxpayer
                  ? `Ask about ${selectedTaxpayer.firstName}'s tax data...`
                  : "Select a taxpayer first..."
              }
              className="flex-1 input-field text-sm sm:text-base"
              disabled={isLoading || !selectedTaxpayer}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !selectedTaxpayer}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed p-2 sm:p-3"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;
