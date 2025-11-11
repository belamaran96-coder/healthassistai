
import React from 'react';

interface QuickActionButtonProps {
  question: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ question, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-700 text-sm text-blue-600 dark:text-blue-300 font-semibold py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
      {question}
    </button>
  );
};

export default QuickActionButton;
