import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex space-x-2 mb-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          activeTab === 'code'
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        }`}
      >
        <Code2 className="w-4 h-4" />
        Code
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
          activeTab === 'preview'
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
      </motion.button>
    </motion.div>
  );
}

