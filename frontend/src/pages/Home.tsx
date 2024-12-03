import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, ChevronRight, AlertCircle } from 'lucide-react';

const suggestionPrompts = [
  "Create a counter app in react",
  "Build a simple todo app in react",
  "Design a landing page for a startup in react",
  "Build a responsive portfolio website in react",
  "Create a blog app in react",
  "Build a chat app in react",
  "Build a portfolio website in react",
  "Design an e-commerce site for candle in react",
];

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 10) {
      setError('Please provide a more detailed description (at least 10 characters).');
      return;
    }
    setError('');
    navigate('/builder', { state: { prompt } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (prompt.trim().length >= 10) {
      setError('');
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <Wand2 className="w-16 h-16 text-blue-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-gray-100 mb-4"
          >
            Website Builder AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300"
          >
            Describe your dream website, and we'll help you build it step by step
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the website you want to build..."
              className="w-full h-40 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 text-lg"
            />
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 mt-2 flex items-center"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-4 bg-blue-600 text-gray-100 py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Generate Website Plan</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 text-sm mb-6"
        >
          Powered by advanced AI to create stunning websites in minutes
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-200 text-center">Need inspiration? Try these:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestionPrompts.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 text-gray-300 p-3 rounded-lg text-left hover:bg-gray-700 transition-colors"
                onClick={() => setPrompt(suggestion)}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

