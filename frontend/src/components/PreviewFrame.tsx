import React, { useEffect, useState, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface PreviewFrameProps {
  webContainer: WebContainer | undefined;
  files: any[];
}

interface LogMessage {
  type: 'install' | 'dev' | 'error' | 'success';
  message: string;
}

export function PreviewFrame({ webContainer, files }: PreviewFrameProps) {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isInstalling, setIsInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .light, .light * {
        color-scheme: light !important;
        background-color: white !important;
        color: black !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  async function main() {
    try {
      if (!webContainer) {
        throw new Error('WebContainer is not initialized');
      }

      if (files.length === 0) {
        return; // Wait for files to be available
      }

      setIsInstalling(true);
      setProgress(0);
      setLogs([]);

      // Install dependencies
      const installProcess = await webContainer.spawn('npm', ['install']);
      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          setLogs(prevLogs => [...prevLogs, { type: 'install', message: data }]);
          setProgress(prev => Math.min(prev + 5, 50)); // Increment progress up to 50%
        }
      }));

      await installProcess.exit;
      setLogs(prevLogs => [...prevLogs, { type: 'success', message: 'Dependencies installed successfully' }]);
      setProgress(50);

      // Start dev server
      const devProcess = await webContainer.spawn('npm', ['run', 'dev']);
      devProcess.output.pipeTo(new WritableStream({
        write(data) {
          setLogs(prevLogs => [...prevLogs, { type: 'dev', message: data }]);
          setProgress(prev => Math.min(prev + 5, 90)); // Increment progress up to 90%
        }
      }));

      webContainer.on('server-ready', (port, url) => {
        console.log('Server ready:', { port, url });
        setUrl(url);
        setIsInstalling(false);
        setProgress(100);
        setLogs(prevLogs => [...prevLogs, { type: 'success', message: 'Server is ready!' }]);
      });

    } catch (err) {
      console.error('Preview error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start preview';
      setError(errorMessage);
      setLogs(prevLogs => [...prevLogs, { type: 'error', message: errorMessage }]);
      setIsInstalling(false);
    }
  }

  useEffect(() => {
    if (webContainer && files.length > 0) {
      main();
    }
  }, [webContainer, files]);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-200 rounded-lg overflow-hidden">
      <AnimatePresence>
        {(!url || isInstalling) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <div className="w-full max-w-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {isInstalling ? 'Setting up preview...' : 'Initializing...'}
                </h3>
                <motion.div
                  animate={{ rotate: isInstalling ? 360 : 0 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-6 h-6 text-blue-500" />
                </motion.div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <motion.div
                  className="bg-blue-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div ref={logContainerRef} className="mt-4 max-h-60 overflow-y-auto bg-gray-800 rounded-lg p-4">
                <AnimatePresence>
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mb-2 flex items-start"
                    >
                      {log.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-1 flex-shrink-0" />}
                      {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />}
                      <span className={`text-sm ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-gray-300'}`}>
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {url && !isInstalling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white"
        >
          <div className="w-full h-full overflow-hidden light">
            <iframe 
              width="100%" 
              height="100%" 
              src={url}
              title="Preview"
              className="border-0"
            />
          </div>
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90"
        >
          <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Error
            </h3>
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-4 bg-white text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

