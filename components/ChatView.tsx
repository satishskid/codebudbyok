import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GradeLevel, Curriculum, ChatMessage, MessageSender, Topic, StudentProgress } from '../types';
import { CURRICULUMS, CODE_EVALUATION_PROMPT } from '../constants';
// Import directly from geminiService to avoid circular dependencies
import { getAiResponse as geminiGetAiResponse, evaluateCode as geminiEvaluateCode } from '../services/geminiService';
import Message from './Message';
import { PaperAirplaneIcon, CodeBracketIcon, SparklesIcon, QuestionMarkCircleIcon, GlobeAltIcon, AdjustmentsHorizontalIcon } from './icons';
import { useTerminal } from '../hooks/useTerminal';

// Local implementation of API service functions to avoid circular dependencies
const getAiResponse = async (terminalId: string, studentName: string, userMessage: string, history: ChatMessage[]): Promise<string> => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('API key not found');
  }
  return geminiGetAiResponse(apiKey, userMessage, history);
};

const evaluateCode = async (terminalId: string, studentName: string, prompt: string): Promise<string> => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('API key not found');
  }
  return geminiEvaluateCode(apiKey, prompt);
};

// In-memory storage for student progress (in a real app, this would be a database)
const studentProgressStore: Record<string, Record<string, StudentProgress>> = {};

const getStudentProgress = async (terminalId: string, studentName: string): Promise<StudentProgress | null> => {
  if (studentProgressStore[terminalId]?.[studentName]) {
    return studentProgressStore[terminalId][studentName];
  }
  return null;
};

const saveStudentProgress = async (terminalId: string, studentName: string, progress: StudentProgress): Promise<void> => {
  if (!studentProgressStore[terminalId]) {
    studentProgressStore[terminalId] = {};
  }
  studentProgressStore[terminalId][studentName] = progress;
};

const GradeSelector: React.FC<{ onSelect: (grade: GradeLevel) => void }> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome to Code Buddy!</h1>
        <p className="text-lg text-gray-600 mb-8">It's great to meet you! To get started on your coding adventure, please select your grade level.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(CURRICULUMS) as GradeLevel[]).map(level => (
            <button
              key={level}
              onClick={() => onSelect(level)}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 text-left"
            >
              <h2 className="text-2xl font-bold text-indigo-600">{level}</h2>
              <p className="text-sm text-gray-500 mb-2">Grades {level === 'JUNIOR' ? '4-6' : level === 'EXPLORER' ? '7-9' : '10-12'}</p>
              <p className="font-semibold text-gray-700">{CURRICULUMS[level].title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ContextualAction {
  label: string;
  prompt: string | null;
}

// Language options for the selector
const LANGUAGE_OPTIONS = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'marathi', label: 'Marathi' },
];

// Language Selector Component
const LanguageSelector: React.FC<{
  currentLanguage: string;
  regionalLanguage?: string;
  onLanguageChange: (language: string) => void;
  onRegionalLanguageChange: (language: string | undefined) => void;
}> = ({ currentLanguage, regionalLanguage, onLanguageChange, onRegionalLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <GlobeAltIcon className="w-5 h-5 text-gray-500" />
        <span>Language: {LANGUAGE_OPTIONS.find(opt => opt.value === currentLanguage)?.label || 'English'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500">Primary Language</div>
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onLanguageChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === option.value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {option.label}
              </button>
            ))}
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <div className="px-3 py-2 text-xs font-semibold text-gray-500">Regional Language (Optional)</div>
            <button
              onClick={() => {
                onRegionalLanguageChange(undefined);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${!regionalLanguage ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              None
            </button>
            {LANGUAGE_OPTIONS.filter(opt => opt.value !== currentLanguage).map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onRegionalLanguageChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${regionalLanguage === option.value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ChatView: React.FC<{ studentName: string }> = ({ studentName }) => {
  const { terminalId } = useTerminal();
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [contextualActions, setContextualActions] = useState<ContextualAction[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load student progress on mount
  useEffect(() => {
    if (!terminalId || !studentName) return;
    setIsLoading(true);
    getStudentProgress(terminalId, studentName)
      .then(loadedProgress => {
        setProgress(loadedProgress);
      })
      .catch(error => console.error("Failed to load progress:", error))
      .finally(() => setIsLoading(false));
  }, [terminalId, studentName]);
  
  // Save progress whenever it changes
  useEffect(() => {
    if (progress && terminalId && studentName) {
      saveStudentProgress(terminalId, studentName, progress);
    }
  }, [progress, terminalId, studentName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [progress?.history]);

  const processAiResponse = (text: string) => {
    let responseText = text;
    if (responseText.includes('[SHOW_ACTIONS]')) {
      responseText = responseText.replace('[SHOW_ACTIONS]', '').trim();
      setContextualActions([
        { label: "Yep, I got it!", prompt: "I understand. What's the challenge?" },
        { label: "Explain it differently", prompt: "Can you please explain that in a different way?" },
        { label: "I have a question...", prompt: null },
      ]);
    } else {
      // Always show meta-prompt engagement options after AI responses
      setContextualActions([
        { label: "I'll try this now", prompt: "I'll try to solve this challenge now." },
        { label: "This is confusing", prompt: "I'm finding this confusing. Can you explain it more simply?" },
        { label: "Show me an example", prompt: "Could you show me an example of how to do this?" },
        { label: "Need to take a break", prompt: "I need to take a break and will continue later." },
      ]);
    }
    return responseText;
  };

  const updateMessages = (newMessage: ChatMessage) => {
    setProgress(prev => {
        if (!prev) return null;
        return {
            ...prev,
            history: [...prev.history, newMessage]
        }
    });
  }
  
  const handleGradeSelect = useCallback((selectedGrade: GradeLevel) => {
    const initialCurriculum = JSON.parse(JSON.stringify(CURRICULUMS[selectedGrade]));
    const firstTopic = initialCurriculum.topics[0].name;
    const welcomeText = `Great choice! We'll start with the ${initialCurriculum.title}.
[CURRICULUM_MAP]
Let's begin our journey with our first topic: **${firstTopic}**.`;

    const initialHistory: ChatMessage[] = [
      { id: 'start', sender: MessageSender.AI, text: welcomeText, meta: { curriculum: initialCurriculum } }
    ];
    
    const newProgress: StudentProgress = {
        grade: selectedGrade,
        curriculum: initialCurriculum,
        history: initialHistory,
        preferences: {
          language: 'english', // Default to English
          highlightCode: true  // Enable code highlighting by default
        }
    };
    setProgress(newProgress);
    
    setIsThinking(true);
    // Note: The history sent here is empty because it's the very first message for the AI
    getAiResponse(terminalId!, studentName, `The student chose grade ${selectedGrade}. Start by teaching the first topic: ${firstTopic}.`, [])
      .then(aiResponse => {
        const responseText = processAiResponse(aiResponse);
        updateMessages({ id: Date.now().toString(), sender: MessageSender.AI, text: responseText });
      })
      .finally(() => setIsThinking(false));
  }, [terminalId, studentName]);

  const handleSendMessage = useCallback(async (messageText: string, fromAction = false) => {
    if (!messageText.trim() || !progress) return;

    if (!fromAction) {
        const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: MessageSender.USER, text: messageText };
        updateMessages(newUserMessage);
    }
    
    setInput('');
    setIsThinking(true);
    setContextualActions([]);

    const codeBlockRegex = /```[\s\S]*?```/;
    const runCommandRegex = /\/\/\s*run/;
    const hasCodeBlock = codeBlockRegex.test(messageText);
    const hasRunCommand = runCommandRegex.test(messageText);
    
    if (hasCodeBlock && hasRunCommand && !fromAction) {
      const code = messageText.match(codeBlockRegex)?.[0].replace(/```(python|javascript|)\n?|```/g, '').replace(/\/\/\s*run/, '').trim() || '';
      const currentTopic = progress.curriculum.topics.find(t => !t.completed)?.name || 'the current topic';
      
      const evaluationPrompt = CODE_EVALUATION_PROMPT(currentTopic, code);
      const evalResult = await evaluateCode(terminalId!, studentName, evaluationPrompt);

      if (evalResult.startsWith('CODE_CORRECT')) {
        const successMessage = evalResult.replace('CODE_CORRECT\n', '');
        updateMessages({ id: `success-${Date.now()}`, sender: MessageSender.SYSTEM, text: successMessage });

        const newCurriculum = JSON.parse(JSON.stringify(progress.curriculum));
        const topicIndex = newCurriculum.topics.findIndex((t: Topic) => !t.completed);
        if (topicIndex !== -1) {
            newCurriculum.topics[topicIndex].completed = true;
        }

        const nextTopic = newCurriculum.topics.find((t: Topic) => !t.completed);
        const transitionPrompt = `The student successfully completed the challenge for "${currentTopic}". Your task is to transition to the next lesson.
1. Start with a warm, celebratory message like "Shabash!" or "Well done!".
2. On a new line, output the special command: [CURRICULUM_MAP]
3. On another new line, start teaching the next topic: "${nextTopic ? nextTopic.name : 'the final project'}". If there are no more topics, congratulate them on finishing the curriculum.`;

        const transitionResponse = await getAiResponse(terminalId!, studentName, transitionPrompt, progress.history);
        const responseText = processAiResponse(transitionResponse);
        
        // This message needs to carry the new curriculum state
        const aiTransitionMessage = { id: `transition-${Date.now()}`, sender: MessageSender.AI, text: responseText, meta: { curriculum: newCurriculum } };
        
        // Update the main progress state before adding the final message
        setProgress(prev => prev ? ({ ...prev, curriculum: newCurriculum, history: [...prev.history, aiTransitionMessage] }) : null);

      } else {
        const errorMessage = evalResult.replace('CODE_INCORRECT\n', '');
        updateMessages({ id: `error-${Date.now()}`, sender: MessageSender.AI, text: errorMessage });
      }
    } else {
      const historyForApi = progress.history.filter(m => m.sender !== MessageSender.SYSTEM);
      const aiResponse = await getAiResponse(terminalId!, studentName, messageText, historyForApi);
      const responseText = processAiResponse(aiResponse);
      updateMessages({ id: Date.now().toString() + 'ai', sender: MessageSender.AI, text: responseText });
    }
    
    setIsThinking(false);
  }, [progress, terminalId, studentName]);

  const handleActionClick = (action: ContextualAction) => {
    setContextualActions([]);
    if (action.prompt) {
      const userActionMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: MessageSender.USER,
        text: `*${action.label}*`,
      };
      updateMessages(userActionMessage);
      handleSendMessage(action.prompt, true);
    } else {
      inputRef.current?.focus();
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><SparklesIcon className="w-12 h-12 text-indigo-500 animate-pulse" /></div>;
  }

  if (!progress) {
    return <GradeSelector onSelect={handleGradeSelect} />;
  }

  // Handle language change
  const handleLanguageChange = (language: string) => {
    if (!progress) return;
    
    setProgress(prev => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          language
        }
      };
    });
  };

  // Handle regional language change
  const handleRegionalLanguageChange = (regionalLanguage: string | undefined) => {
    if (!progress) return;
    
    setProgress(prev => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          regionalLanguage
        }
      };
    });
  };

  // Toggle code highlighting
  const toggleCodeHighlighting = () => {
    if (!progress) return;
    
    setProgress(prev => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          highlightCode: !prev.preferences.highlightCode
        }
      };
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-end p-2 bg-white border-b border-gray-200">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none"
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>

      {showSettings && (
        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">Learning Preferences</h3>
            <div className="flex flex-wrap gap-4">
              <LanguageSelector 
                currentLanguage={progress.preferences.language || 'english'}
                regionalLanguage={progress.preferences.regionalLanguage}
                onLanguageChange={handleLanguageChange}
                onRegionalLanguageChange={handleRegionalLanguageChange}
              />
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlightCode"
                  checked={progress.preferences.highlightCode}
                  onChange={toggleCodeHighlighting}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="highlightCode" className="text-sm font-medium text-gray-700">
                  Highlight code word-by-word
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {progress.history.map((msg) => (
            <Message 
              key={msg.id} 
              message={msg} 
              curriculum={progress.curriculum} 
              preferences={progress.preferences}
            />
          ))}
          {isThinking && (
            <Message 
              message={{ id: 'thinking', sender: MessageSender.AI, text: '', isThinking: true }} 
              curriculum={progress.curriculum} 
              preferences={progress.preferences}
            />
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          {contextualActions.length > 0 && !isThinking && (
            <div className="flex flex-wrap justify-center gap-3 mb-4 animate-fade-in">
              {contextualActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleActionClick(action)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-full hover:bg-indigo-200 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-px"
                >
                  {action.label === "I have a question..." ? <QuestionMarkCircleIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(input);
                }
              }}
              placeholder="Type your message or code here... Add // run to execute code."
              className="w-full p-4 pr-20 text-gray-700 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={2}
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </form>
          <div className="flex items-center text-xs text-gray-500 mt-2 ml-2">
            <CodeBracketIcon className="w-4 h-4 mr-1" />
            <span>To run code, wrap it in a markdown block (```) and add <strong className="font-semibold text-gray-700">// run</strong> on the last line.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
