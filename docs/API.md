# Code Buddy - API Documentation

## Overview

Code Buddy integrates with the Google Gemini AI API to provide intelligent tutoring capabilities. This document outlines the API integration, service layer architecture, and data flow.

## Table of Contents
1. [Service Architecture](#service-architecture)
2. [Gemini API Integration](#gemini-api-integration)
3. [Application API Layer](#application-api-layer)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Security](#security)

---

## Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │  Service Layer  │    │  External APIs  │
│                 │    │                 │    │                 │
│  ChatView       │───▶│  apiService.ts  │───▶│  Google Gemini  │
│  AdminDashboard │    │  geminiService  │    │  AI API         │
│  ApiKeySetup    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Layer Responsibilities

#### Components Layer
- User interface and interaction handling
- State management and UI updates
- Input validation and formatting

#### Service Layer
- API abstraction and data transformation
- Error handling and retry logic
- Caching and performance optimization

#### External APIs
- Google Gemini AI for natural language processing
- Code evaluation and educational content generation

---

## Gemini API Integration

### Service: `geminiService.ts`

#### Configuration
```typescript
import { GoogleGenAI } from "@google/genai";

const getAi = (apiKey: string) => new GoogleGenAI({ apiKey });
```

#### Core Functions

##### `checkApiKeyHealth(apiKey: string): Promise<boolean>`
Validates API key functionality with a minimal test request.

**Parameters:**
- `apiKey`: Google Gemini API key

**Returns:**
- `Promise<boolean>`: True if API key is valid and functional

**Example:**
```typescript
const isHealthy = await checkApiKeyHealth('your-api-key');
if (isHealthy) {
  console.log('API key is working');
} else {
  console.log('API key is invalid or has issues');
}
```

**Error Handling:**
- Returns `false` for any API errors
- Logs errors to console for debugging

##### `getAiResponse(apiKey: string, userMessage: string, history: ChatMessage[]): Promise<string>`
Generates AI tutor responses based on user input and conversation history.

**Parameters:**
- `apiKey`: Google Gemini API key
- `userMessage`: Current user message
- `history`: Array of previous chat messages

**Returns:**
- `Promise<string>`: AI-generated response text

**Example:**
```typescript
const response = await getAiResponse(
  'your-api-key',
  'What is a variable in Python?',
  previousMessages
);
console.log(response); // AI tutor's explanation
```

**Request Format:**
```typescript
const contents = [
  ...chatHistory.map(msg => ({
    role: msg.sender === MessageSender.USER ? 'user' : 'model',
    parts: [{ text: msg.text }]
  })),
  { role: 'user', parts: [{ text: userMessage }] }
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
  config: {
    systemInstruction: AI_PERSONA_PROMPT,
  }
});
```

##### `evaluateCode(apiKey: string, prompt: string): Promise<string>`
Evaluates student code submissions for correctness and provides feedback.

**Parameters:**
- `apiKey`: Google Gemini API key
- `prompt`: Formatted evaluation prompt with code and context

**Returns:**
- `Promise<string>`: Evaluation result starting with "CODE_CORRECT" or "CODE_INCORRECT"

**Example:**
```typescript
const evaluationPrompt = CODE_EVALUATION_PROMPT('Variables', 'x = 5\nprint(x)');
const result = await evaluateCode('your-api-key', evaluationPrompt);

if (result.startsWith('CODE_CORRECT')) {
  // Handle successful code
} else if (result.startsWith('CODE_INCORRECT')) {
  // Handle code with errors
}
```

---

## Application API Layer

### Service: `apiService.ts`

This layer provides application-specific abstractions over the Gemini service.

#### Functions

##### `getAiResponse(terminalId: string, studentName: string, userMessage: string, history: ChatMessage[]): Promise<string>`
Application-level wrapper for AI responses with automatic API key retrieval.

**Parameters:**
- `terminalId`: Terminal session identifier
- `studentName`: Student identifier
- `userMessage`: User's message
- `history`: Conversation history

**Implementation:**
```typescript
export const getAiResponse = async (
  terminalId: string,
  studentName: string,
  userMessage: string,
  history: ChatMessage[]
): Promise<string> => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error('API key not found');
  }
  
  return geminiGetAiResponse(apiKey, userMessage, history);
};
```

##### `evaluateCode(terminalId: string, studentName: string, prompt: string): Promise<string>`
Application-level wrapper for code evaluation.

##### `getStudentProgress(terminalId: string, studentName: string): Promise<StudentProgress | null>`
Retrieves student learning progress from storage.

**Current Implementation:**
- Uses in-memory storage with localStorage backup
- Returns null if no progress found

**Future Enhancement:**
- Database integration for persistent storage
- Multi-user support with proper data isolation

##### `saveStudentProgress(terminalId: string, studentName: string, progress: StudentProgress): Promise<void>`
Saves student learning progress to storage.

**Current Implementation:**
```typescript
const studentProgressStore: Record<string, Record<string, StudentProgress>> = {};

export const saveStudentProgress = async (
  terminalId: string,
  studentName: string,
  progress: StudentProgress
): Promise<void> => {
  if (!studentProgressStore[terminalId]) {
    studentProgressStore[terminalId] = {};
  }
  
  studentProgressStore[terminalId][studentName] = progress;
};
```

---

## Data Models

### Core Types

#### `ChatMessage`
```typescript
interface ChatMessage {
  id: string;                    // Unique message identifier
  sender: MessageSender;         // USER, AI, or SYSTEM
  text: string;                  // Message content
  isThinking?: boolean;          // AI thinking indicator
  meta?: {                       // Optional metadata
    curriculum?: Curriculum;     // Curriculum state updates
  };
}

enum MessageSender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system'
}
```

#### `StudentProgress`
```typescript
interface StudentProgress {
  grade: GradeLevel;             // Student's grade level
  curriculum: Curriculum;        // Current curriculum state
  history: ChatMessage[];        // Conversation history
  preferences: {                 // Learning preferences
    language: string;            // Primary language
    regionalLanguage?: string;   // Optional secondary language
    highlightCode: boolean;      // Code highlighting preference
  };
}
```

#### `Curriculum`
```typescript
interface Curriculum {
  title: string;                 // Curriculum name
  topics: Topic[];               // Array of learning topics
}

interface Topic {
  name: string;                  // Topic name
  completed: boolean;            // Completion status
  duration: string;              // Estimated duration
}

enum GradeLevel {
  JUNIOR = "JUNIOR",             // Grades 4-6
  EXPLORER = "EXPLORER",         // Grades 7-9
  PRO = "PRO"                    // Grades 10-12
}
```

### API Request/Response Formats

#### Gemini API Request
```typescript
{
  model: "gemini-2.5-flash",
  contents: [
    {
      role: "user" | "model",
      parts: [{ text: string }]
    }
  ],
  config: {
    systemInstruction: string
  }
}
```

#### Gemini API Response
```typescript
{
  text: string,                  // Generated response text
  // Additional metadata from Gemini API
}
```

---

## Error Handling

### Error Types

#### API Key Errors
```typescript
// Invalid or missing API key
if (!apiKey) {
  throw new Error('API key not found');
}

// API key validation failure
if (!await checkApiKeyHealth(apiKey)) {
  throw new Error('Invalid API key');
}
```

#### Rate Limiting
```typescript
try {
  const response = await getAiResponse(apiKey, message, history);
} catch (error) {
  if (error.message.includes('429')) {
    // Handle rate limiting
    setKeyStatus('throttled');
  } else {
    // Handle other errors
    setKeyStatus('error');
  }
}
```

#### Network Errors
```typescript
try {
  const response = await geminiService.getAiResponse(apiKey, message, history);
} catch (error) {
  if (error.name === 'NetworkError') {
    // Handle network connectivity issues
    throw new Error('Network connection failed');
  }
  throw error;
}
```

### Error Recovery Strategies

#### Automatic Retry
```typescript
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};
```

#### Graceful Degradation
```typescript
const getAiResponseWithFallback = async (apiKey: string, message: string, history: ChatMessage[]) => {
  try {
    return await getAiResponse(apiKey, message, history);
  } catch (error) {
    // Fallback to generic helpful message
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};
```

---

## Rate Limiting

### Gemini API Limits
- **Requests per minute**: Varies by API key tier
- **Tokens per request**: Maximum context length limits
- **Daily quotas**: Based on API key plan

### Handling Rate Limits

#### Detection
```typescript
const isRateLimited = (error: any): boolean => {
  return error.message.includes('429') || 
         error.message.includes('quota') ||
         error.message.includes('rate limit');
};
```

#### Response Strategy
```typescript
if (isRateLimited(error)) {
  setKeyStatus('throttled');
  // Show user-friendly message
  return "I'm thinking a bit slower right now. Please wait a moment and try again.";
}
```

#### Prevention
- Implement request queuing for high-traffic scenarios
- Cache common responses to reduce API calls
- Use efficient prompting to minimize token usage

---

## Security

### API Key Management

#### Storage
```typescript
// Store API key securely in localStorage
localStorage.setItem('gemini_api_key', apiKey);

// Retrieve with validation
const getApiKey = (): string | null => {
  const key = localStorage.getItem('gemini_api_key');
  return key && key.length > 0 ? key : null;
};
```

#### Validation
```typescript
const validateApiKey = (key: string): boolean => {
  // Basic format validation
  if (!key || key.length < 10) return false;
  
  // Additional validation rules
  if (!key.startsWith('AI')) return false;
  
  return true;
};
```

### Data Protection

#### Input Sanitization
```typescript
const sanitizeUserInput = (input: string): string => {
  // Remove potentially harmful content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};
```

#### Output Filtering
```typescript
const sanitizeAiResponse = (response: string): string => {
  // Filter out any potentially harmful content from AI responses
  return response
    .replace(/\[SYSTEM\]/g, '')
    .replace(/\[ADMIN\]/g, '')
    .trim();
};
```

### Privacy Considerations

#### Data Minimization
- Only send necessary context to AI API
- Avoid including personal information in prompts
- Implement data retention policies

#### Audit Logging
```typescript
const logApiCall = (endpoint: string, success: boolean, duration: number) => {
  console.log(`API Call: ${endpoint}, Success: ${success}, Duration: ${duration}ms`);
  // In production, send to proper logging service
};
```

---

## Performance Optimization

### Caching Strategies

#### Response Caching
```typescript
const responseCache = new Map<string, { response: string, timestamp: number }>();

const getCachedResponse = (key: string): string | null => {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.response;
  }
  return null;
};
```

#### Request Deduplication
```typescript
const pendingRequests = new Map<string, Promise<string>>();

const getAiResponseWithDeduplication = async (key: string, message: string, history: ChatMessage[]) => {
  const requestKey = `${message}-${history.length}`;
  
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }
  
  const promise = getAiResponse(key, message, history);
  pendingRequests.set(requestKey, promise);
  
  try {
    const result = await promise;
    pendingRequests.delete(requestKey);
    return result;
  } catch (error) {
    pendingRequests.delete(requestKey);
    throw error;
  }
};
```

### Request Optimization

#### Efficient Prompting
- Minimize context length while maintaining quality
- Use structured prompts for consistent responses
- Implement prompt templates for common scenarios

#### Batch Processing
```typescript
const batchEvaluateCode = async (apiKey: string, codeSubmissions: string[]) => {
  // Process multiple code evaluations in a single request
  const batchPrompt = codeSubmissions
    .map((code, index) => `Submission ${index + 1}:\n${code}`)
    .join('\n\n');
  
  return evaluateCode(apiKey, batchPrompt);
};
```

---

## Monitoring and Analytics

### API Usage Tracking
```typescript
interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  rateLimitHits: number;
}

const trackApiUsage = (endpoint: string, success: boolean, responseTime: number) => {
  // Update metrics
  // Send to analytics service
};
```

### Health Monitoring
```typescript
const monitorApiHealth = async () => {
  const startTime = Date.now();
  try {
    await checkApiKeyHealth(getApiKey()!);
    const responseTime = Date.now() - startTime;
    trackApiUsage('health-check', true, responseTime);
  } catch (error) {
    trackApiUsage('health-check', false, Date.now() - startTime);
  }
};
```

---

## Testing

### Unit Tests
```typescript
// Example test for API service
describe('apiService', () => {
  it('should retrieve API key from localStorage', () => {
    localStorage.setItem('gemini_api_key', 'test-key');
    const key = getApiKey();
    expect(key).toBe('test-key');
  });

  it('should handle missing API key', async () => {
    localStorage.removeItem('gemini_api_key');
    await expect(getAiResponse('terminal', 'student', 'message', []))
      .rejects.toThrow('API key not found');
  });
});
```

### Integration Tests
```typescript
// Example integration test
describe('Gemini Integration', () => {
  it('should get valid AI response', async () => {
    const response = await getAiResponse(
      'valid-api-key',
      'Hello',
      []
    );
    expect(response).toBeTruthy();
    expect(typeof response).toBe('string');
  });
});
```

### Mock Services
```typescript
// Mock Gemini service for testing
export const mockGeminiService = {
  checkApiKeyHealth: jest.fn().mockResolvedValue(true),
  getAiResponse: jest.fn().mockResolvedValue('Mock AI response'),
  evaluateCode: jest.fn().mockResolvedValue('CODE_CORRECT\nGreat job!')
};
```

---

## Future Enhancements

### Planned API Improvements
1. **Database Integration**: Replace localStorage with proper database
2. **Real-time Features**: WebSocket integration for live collaboration
3. **Advanced Analytics**: Detailed usage and learning analytics
4. **Multi-model Support**: Integration with additional AI models
5. **Offline Capabilities**: Service worker for offline functionality

### Scalability Considerations
1. **API Gateway**: Centralized API management and rate limiting
2. **Caching Layer**: Redis or similar for response caching
3. **Load Balancing**: Distribute API requests across multiple instances
4. **Monitoring**: Comprehensive observability and alerting

---

*Last updated: January 2025*