import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Plus, MessageSquare } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    currentSession,
    sessions,
    addMessage,
    createSession,
    selectSession,
    isLoading,
  } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Add user message
    addMessage({
      content: userMessage,
      role: "user",
    });

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you analyze your IRS documents. Based on the documents you've uploaded, I can see...",
        "Let me check your tax information for that question. I found relevant data in your W-2 forms...",
        "I can compare your income between years. From your uploaded documents, I can see...",
        "That's a great question about your tax situation. Let me analyze the relevant forms...",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      addMessage({
        content: randomResponse,
        role: "assistant",
      });
    }, 1000);
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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {currentSession.title}
          </h3>
          <button
            onClick={startNewChat}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <Plus className="h-4 w-4 mr-1 inline" />
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentSession.messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Ask me anything about your IRS documents!
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Try: "How much did I make last year vs this year?"
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
                <div className="flex-shrink-0 w-8 h-8 bg-irs-100 dark:bg-irs-900 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-irs-600 dark:text-irs-400" />
                </div>
              )}

              <div
                className={cn(
                  message.role === "user"
                    ? "chat-message-user"
                    : "chat-message-assistant"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-irs-100 dark:bg-irs-900 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-irs-600 dark:text-irs-400" />
            </div>
            <div className="chat-message-assistant">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your IRS documents..."
            className="flex-1 input-field"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
