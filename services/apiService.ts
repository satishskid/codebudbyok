import { ChatMessage, StudentProgress } from '../types';
import { getAiResponse as geminiGetAiResponse, evaluateCode as geminiEvaluateCode } from './geminiService';

// In-memory storage for student progress (in a real app, this would be a database)
const studentProgressStore: Record<string, Record<string, StudentProgress>> = {};

export const getAiResponse = async (
  terminalId: string,
  studentName: string,
  userMessage: string,
  history: ChatMessage[]
): Promise<string> => {
  // Get the API key from localStorage
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('API key not found');
  }
  
  return geminiGetAiResponse(apiKey, userMessage, history);
};

export const evaluateCode = async (
  terminalId: string,
  studentName: string,
  prompt: string
): Promise<string> => {
  // Get the API key from localStorage
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('API key not found');
  }
  
  return geminiEvaluateCode(apiKey, prompt);
};

export const getStudentProgress = async (
  terminalId: string,
  studentName: string
): Promise<StudentProgress | null> => {
  // In a real app, this would fetch from a database
  if (studentProgressStore[terminalId]?.[studentName]) {
    return studentProgressStore[terminalId][studentName];
  }
  
  return null;
};

export const saveStudentProgress = async (
  terminalId: string,
  studentName: string,
  progress: StudentProgress
): Promise<void> => {
  // In a real app, this would save to a database
  if (!studentProgressStore[terminalId]) {
    studentProgressStore[terminalId] = {};
  }
  
  studentProgressStore[terminalId][studentName] = progress;
};