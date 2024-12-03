'use client'

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  const [isStreaming, setIsStreaming] = useState(true);

  const handleStepClick = (stepId: string) => {
    setCurrentStep(Number(stepId));
  };

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").forEach(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    })

    if (updateHappened) {
      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => ({
        ...s,
        status: "completed"
      })))
    }
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  useEffect(() => {
    init();
    
    // Simulate streaming effect
    const streamingTimeout = setTimeout(() => {
      setIsStreaming(false);
    }, 5000); // Adjust the duration as needed

    return () => clearTimeout(streamingTimeout);
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col"
    >
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </motion.header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 space-y-6 overflow-auto"
          >
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={handleStepClick}
                  isStreaming={isStreaming}
                />
              </div>
              <div>
                <div className='flex mt-4'>
                  <br />
                  {(loading || !templateSet) && <Loader />}
                  {!(loading || !templateSet) && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className='flex w-full'
                    >
                      <textarea 
                        value={userPrompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        className='p-2 w-full bg-gray-700 text-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-400'
                      />
                      <button 
                        onClick={async () => {
                          const newMessage = {
                            role: "user" as "user",
                            content: userPrompt
                          };

                          setLoading(true);
                          const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                            messages: [...llmMessages, newMessage]
                          });
                          setLoading(false);

                          setLlmMessages(x => [...x, newMessage]);
                          setLlmMessages(x => [...x, {
                            role: "assistant",
                            content: stepsResponse.data.response
                          }]);
                          
                          setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                            ...x,
                            status: "pending" as "pending"
                          }))]);

                          // Reset streaming effect
                          setIsStreaming(true);
                          setTimeout(() => setIsStreaming(false), 5000); // Adjust timing as needed
                        }} 
                        className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-r-md transition-colors duration-200'
                      >
                        Send
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-1"
          >
            <FileExplorer 
              files={files} 
              onFileSelect={setSelectedFile}
              isStreaming={isStreaming}
            />
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="col-span-2 bg-gray-800 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]"
          >
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

