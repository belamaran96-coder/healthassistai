
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Sender } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-r-2xl rounded-tl-2xl';

  const Icon = isUser ? User : Bot;
  const iconClasses = isUser 
    ? "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300" 
    : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";

  return (
    <div className={`${wrapperClasses} group`}>
        <div className={`flex items-start max-w-xl space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconClasses}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className={`px-5 py-3 ${bubbleClasses} shadow-sm`}>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-blockquote:border-l-yellow-500 prose-blockquote:text-yellow-800 dark:prose-blockquote:text-yellow-300 prose-blockquote:bg-yellow-50 dark:prose-blockquote:bg-yellow-900/50 prose-blockquote:p-2 prose-blockquote:rounded-md">
                <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ChatMessage;
