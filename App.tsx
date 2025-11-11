
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sender } from './types';
import { QUICK_QUESTIONS, SYSTEM_INSTRUCTION } from './constants';
import { getHealthInfo } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import QuickActionButton from './components/QuickActionButton';
import TypingIndicator from './components/TypingIndicator';
import { SendHorizonal, Bot, User, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'initial-message',
        sender: Sender.AI,
        content: "Hello! I'm HealthAssist AI. I can provide general health information. How can I help you today?",
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.USER,
      content: messageContent,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);
    setInput('');

    try {
      const aiResponse = await getHealthInfo(messageContent);
      const newAiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: Sender.AI,
        content: aiResponse,
      };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}. Please check your setup and try again.`);
      const newErrorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: Sender.AI,
        content: `Sorry, I encountered an error. Please ensure your API key is configured correctly and try again.`,
      };
      setMessages(prev => [...prev, newErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-800 font-sans">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center">
          <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold ml-3 text-gray-800 dark:text-gray-100">
            HealthAssist AI
          </h1>
        </div>
      </header>

      <div className="bg-yellow-100 dark:bg-yellow-900 border-b-2 border-yellow-300 dark:border-yellow-700 p-3 text-yellow-800 dark:text-yellow-200">
        <div className="max-w-4xl mx-auto flex items-start">
          <ShieldAlert className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">
            <strong>Medical Disclaimer:</strong> I am an AI assistant and not a medical professional. The information I provide is for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <ChatMessage key={`${msg.id}-${index}`} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
        
        {messages.length <= 1 && !isLoading && (
            <div className="max-w-4xl mx-auto mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Or try one of these common questions:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {QUICK_QUESTIONS.map((q, i) => (
                        <QuickActionButton key={i} question={q} onClick={() => handleQuickAction(q)} />
                    ))}
                </div>
            </div>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 rounded-full p-2 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health-related question..."
              className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <SendHorizonal className="w-5 h-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default App;
