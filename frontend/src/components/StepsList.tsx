import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: string) => void;
  isStreaming: boolean;
}

export function StepsList({ steps, currentStep, onStepClick, isStreaming }: StepsListProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg shadow-lg p-4 h-full overflow-auto"
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Build Steps</h2>
      <div className="space-y-4">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                currentStep === Number(step.id)
                  ? 'bg-purple-600 shadow-lg transform scale-105'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => onStepClick(step.id)}
            >
              <div className="flex items-center gap-3">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : currentStep === Number(step.id) ? (
                  <Clock className="w-5 h-5 text-blue-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <h3 className="font-medium text-gray-100">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-300 mt-2">{step.description}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            className="text-gray-400 text-sm mt-4"
          >
            Streaming build steps...
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

