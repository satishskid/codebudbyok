# Code Buddy - Developer Manual

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Setup and Installation](#setup-and-installation)
3. [Project Structure](#project-structure)
4. [Core Components](#core-components)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Authentication System](#authentication-system)
8. [Curriculum System](#curriculum-system)
9. [AI Integration](#ai-integration)
10. [Styling and UI](#styling-and-ui)
11. [Build and Deployment](#build-and-deployment)
12. [Testing](#testing)
13. [Contributing](#contributing)

---

## Architecture Overview

Code Buddy is built as a modern React application with TypeScript, using a component-based architecture with custom hooks for state management and service layers for external integrations.

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **AI Integration**: Google Gemini API
- **State Management**: React hooks + localStorage
- **Authentication**: Multi-tier with session storage

### Key Design Principles
1. **Component Isolation**: Each component has a single responsibility
2. **Type Safety**: Full TypeScript coverage with strict mode
3. **Cultural Adaptation**: Indian context built into the core system
4. **Progressive Enhancement**: Works without JavaScript for basic functionality
5. **Responsive Design**: Mobile-first approach

---

## Setup and Installation

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### Development Setup
```bash
# Clone repository
git clone https://github.com/satishskid/codebudbyok.git
cd codebudbyok

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
No environment variables required. API keys are managed through the application interface.

---

## Project Structure

```
code-buddy/
├── components/                 # React components
│   ├── AdminDashboard.tsx         # Admin control panel
│   ├── ApiKeySetup.tsx           # Authentication setup
│   ├── ChatView.tsx              # Main learning interface
│   ├── Header.tsx                # Navigation header
│   ├── KeyStatusIndicator.tsx    # API status display
│   ├── Message.tsx               # Chat message rendering
│   ├── UsageGuide.tsx           # Help documentation
│   └── icons.tsx                # SVG icon components
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts               # Authentication logic
│   └── useTerminal.ts           # Terminal management
├── services/                   # External service integrations
│   ├── apiService.ts            # Application API layer
│   └── geminiService.ts         # Google Gemini integration
├── src/                       # Static assets
│   └── index.css               # Global styles
├── docs/                      # Documentation
│   ├── USER_MANUAL.md          # User documentation
│   └── DEVELOPER_MANUAL.md     # This file
├── App.tsx                    # Main application component
├── constants.ts               # Curriculum and AI prompts
├── types.ts                   # TypeScript type definitions
├── index.tsx                  # Application entry point
├── index.html                 # HTML template
├── vite.config.ts            # Vite configuration
├── tailwind.config.cjs       # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## Core Components

### App.tsx
Main application component that handles routing and authentication state.

```typescript
interface AppState {
  view: 'home' | 'chat' | 'admin';
  authState: AuthState;
}
```

**Key Responsibilities:**
- Authentication flow management
- View routing
- Global state coordination

### ChatView.tsx
The main learning interface where students interact with the AI tutor.

```typescript
interface ChatViewProps {
  studentName: string;
}
```

**Key Features:**
- Grade selection interface
- Real-time chat with AI tutor
- Code execution engine
- Progress tracking
- Language preferences
- Contextual action buttons

### AdminDashboard.tsx
Administrative interface for system management.

```typescript
interface AdminDashboardProps {
  keyStatus: KeyStatus;
  onRecheck: () => void;
}
```

**Features:**
- API key health monitoring
- System status display
- Usage statistics (placeholder for full version)

### Message.tsx
Renders individual chat messages with rich formatting.

```typescript
interface MessageProps {
  message: ChatMessage;
  curriculum: Curriculum | null;
  preferences?: StudentPreferences;
}
```

**Features:**
- Markdown rendering
- Code syntax highlighting
- Curriculum map display
- Responsive design

---

## State Management

### Authentication State
Managed by `useAuth` hook with localStorage persistence.

```typescript
interface AuthState {
  apiKey: string | null;
  isAdmin: boolean;
  terminalPassword: string | null;
  isActivated: boolean;
}
```

### Student Progress State
Managed within ChatView component with automatic persistence.

```typescript
interface StudentProgress {
  grade: GradeLevel;
  curriculum: Curriculum;
  history: ChatMessage[];
  preferences: StudentPreferences;
}
```

### Storage Strategy
- **localStorage**: Persistent data (API keys, terminal passwords, activation status)
- **sessionStorage**: Session data (admin status)
- **Memory**: Chat history and progress (with localStorage backup)

---

## API Integration

### Gemini Service Layer
Located in `services/geminiService.ts`

```typescript
// Core functions
export const checkApiKeyHealth = async (apiKey: string): Promise<boolean>
export const getAiResponse = async (apiKey: string, userMessage: string, history: ChatMessage[]): Promise<string>
export const evaluateCode = async (apiKey: string, prompt: string): Promise<string>
```

### API Service Layer
Located in `services/apiService.ts` - provides application-level API abstractions.

```typescript
// Application-level functions
export const getAiResponse = async (terminalId: string, studentName: string, userMessage: string, history: ChatMessage[]): Promise<string>
export const evaluateCode = async (terminalId: string, studentName: string, prompt: string): Promise<string>
export const getStudentProgress = async (terminalId: string, studentName: string): Promise<StudentProgress | null>
export const saveStudentProgress = async (terminalId: string, studentName: string, progress: StudentProgress): Promise<void>
```

### Error Handling
```typescript
try {
  const response = await getAiResponse(terminalId, studentName, message, history);
  // Handle success
} catch (error) {
  if (error.message.includes('429')) {
    // Handle rate limiting
  } else {
    // Handle other errors
  }
}
```

---

## Authentication System

### Three-Tier Authentication
1. **Admin Level**: Full system access with API key management
2. **Teacher Level**: Learning interface access
3. **Student Level**: Individual learning sessions

### Authentication Flow
```typescript
// Admin login
const adminLogin = (key: string, password: string, terminalPassword: string) => {
  if (password === ADMIN_PASSWORD) {
    // Set up system
    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('terminal_password', terminalPassword);
    localStorage.setItem('is_activated', 'true');
    sessionStorage.setItem('is_admin', 'true');
    return true;
  }
  return false;
};

// Teacher login
const teacherLogin = (password: string) => {
  if (authState.isActivated && password === authState.terminalPassword) {
    sessionStorage.removeItem('is_admin');
    return true;
  }
  return false;
};
```

### Security Considerations
- API keys stored in localStorage (client-side only)
- Admin sessions use sessionStorage (cleared on browser close)
- Terminal passwords are hashed in production environments
- No sensitive data transmitted to external servers except Google Gemini

---

## Curriculum System

### Curriculum Structure
Defined in `constants.ts`:

```typescript
interface Topic {
  name: string;
  completed: boolean;
  duration: string;
}

interface Curriculum {
  title: string;
  topics: Topic[];
}

enum GradeLevel {
  JUNIOR = "JUNIOR",    // Grades 4-6
  EXPLORER = "EXPLORER", // Grades 7-9
  PRO = "PRO"           // Grades 10-12
}
```

### Curriculum Progression
```typescript
// Mark topic as completed
const completeCurrentTopic = (curriculum: Curriculum) => {
  const topicIndex = curriculum.topics.findIndex(t => !t.completed);
  if (topicIndex !== -1) {
    curriculum.topics[topicIndex].completed = true;
  }
  return curriculum;
};

// Get next topic
const getNextTopic = (curriculum: Curriculum) => {
  return curriculum.topics.find(t => !t.completed);
};
```

### Progress Tracking
- Automatic progression through curriculum
- Visual progress indicators
- Time estimation for planning
- Persistence across sessions

---

## AI Integration

### AI Persona System
The AI tutor has a carefully crafted personality defined in `AI_PERSONA_PROMPT`:

```typescript
export const AI_PERSONA_PROMPT = `
You are "Code Buddy," an empathetic, patient, and playful AI programming tutor 
with a "computer wizard" personality, designed for students in India.

Core Instructions:
1. Language & Tone: Use simple English with Indian analogies and Hinglish encouragement
2. Teaching Method: Always explain with analogies before showing code
3. Interaction Loop: Explain → Check Understanding → Present Challenge → Guide/Celebrate
4. Cultural Context: Use chai, cricket, Bollywood references
5. Personalized Coaching: Adapt to individual learning styles
`;
```

### Code Evaluation System
```typescript
export const CODE_EVALUATION_PROMPT = (topic: string, code: string) => `
Analyze the code for correctness based on the topic: "${topic}".

Student's code:
\`\`\`
${code}
\`\`\`

Response format:
- If correct: "CODE_CORRECT" + encouraging message + output
- If incorrect: "CODE_INCORRECT" + specific hint (no direct answer)
`;
```

### AI Response Processing
```typescript
const processAiResponse = (text: string) => {
  let responseText = text;
  
  // Handle special commands
  if (responseText.includes('[SHOW_ACTIONS]')) {
    responseText = responseText.replace('[SHOW_ACTIONS]', '').trim();
    setContextualActions([
      { label: "Yep, I got it!", prompt: "I understand. What's the challenge?" },
      { label: "Explain it differently", prompt: "Can you explain that differently?" },
      { label: "I have a question...", prompt: null },
    ]);
  }
  
  return responseText;
};
```

---

## Styling and UI

### Tailwind CSS v4 Configuration
```javascript
// tailwind.config.cjs
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
```

### Custom CSS
```css
/* src/index.css */
@import "tailwindcss";

/* Custom scrollbar styles */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

/* Code highlighting */
pre {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
```

### Responsive Design Patterns
```typescript
// Mobile-first responsive classes
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Content adapts from 1 column on mobile to 3 on desktop */}
</div>

// Responsive text sizing
<h1 className="text-2xl md:text-4xl font-bold">
  {/* Smaller on mobile, larger on desktop */}
</h1>
```

---

## Build and Deployment

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    target: 'esnext',
    minify: 'terser'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
```

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options

#### Netlify (Recommended)
```bash
# Build settings
Build command: npm run build
Publish directory: dist
```

#### Vercel
```bash
# Build settings
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

#### Static Hosting
The built application in the `dist` folder can be served by any static hosting service.

---

## Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] Admin can log in with correct credentials
- [ ] Admin can set terminal password
- [ ] Teacher can log in with terminal password
- [ ] Invalid credentials are rejected
- [ ] Logout functionality works

#### Learning Interface
- [ ] Grade selection works for all levels
- [ ] AI tutor responds appropriately
- [ ] Code execution works with `// run` command
- [ ] Progress tracking updates correctly
- [ ] Language settings persist

#### Admin Dashboard
- [ ] API key status displays correctly
- [ ] Recheck functionality works
- [ ] Error states are handled gracefully

### Automated Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

### Test Structure
```typescript
// Example test file
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChatView from '../components/ChatView';

describe('ChatView', () => {
  it('renders grade selection initially', () => {
    render(<ChatView studentName="Test Student" />);
    expect(screen.getByText('Welcome to Code Buddy!')).toBeInTheDocument();
  });
});
```

---

## Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** following the coding standards
4. **Test thoroughly** using the manual checklist
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**

### Coding Standards

#### TypeScript
- Use strict mode
- Provide explicit types for all function parameters and returns
- Use interfaces for object shapes
- Prefer `const` over `let` where possible

#### React
- Use functional components with hooks
- Extract custom hooks for reusable logic
- Keep components focused on single responsibilities
- Use proper prop types

#### Styling
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic color names

### Code Review Guidelines
- **Functionality**: Does the code work as intended?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?
- **Maintainability**: Is the code easy to understand and modify?
- **Testing**: Are edge cases handled appropriately?

### Adding New Features

#### New Curriculum Topics
1. Update `constants.ts` with new topics
2. Ensure AI prompts handle the new content
3. Test progression through new topics
4. Update documentation

#### New Grade Levels
1. Add to `GradeLevel` enum in `types.ts`
2. Create curriculum in `constants.ts`
3. Update grade selection UI
4. Test complete learning flow

#### New Languages
1. Add language option to `LANGUAGE_OPTIONS`
2. Update AI prompts to handle new language
3. Test language switching functionality
4. Update user documentation

---

## API Reference

### Core Types
```typescript
// Authentication
interface AuthState {
  apiKey: string | null;
  isAdmin: boolean;
  terminalPassword: string | null;
  isActivated: boolean;
}

// Learning
interface StudentProgress {
  grade: GradeLevel;
  curriculum: Curriculum;
  history: ChatMessage[];
  preferences: StudentPreferences;
}

// Messaging
interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  isThinking?: boolean;
  meta?: { curriculum?: Curriculum };
}
```

### Service Functions
```typescript
// Gemini Service
checkApiKeyHealth(apiKey: string): Promise<boolean>
getAiResponse(apiKey: string, userMessage: string, history: ChatMessage[]): Promise<string>
evaluateCode(apiKey: string, prompt: string): Promise<string>

// API Service
getStudentProgress(terminalId: string, studentName: string): Promise<StudentProgress | null>
saveStudentProgress(terminalId: string, studentName: string, progress: StudentProgress): Promise<void>
```

### Hook APIs
```typescript
// useAuth
const {
  authState,
  keyStatus,
  adminLogin,
  teacherLogin,
  logout,
  recheckKeyHealth
} = useAuth();

// useTerminal
const { terminalId } = useTerminal();
```

---

## Performance Considerations

### Optimization Strategies
1. **Code Splitting**: Components are loaded on-demand
2. **Memoization**: Expensive calculations are cached
3. **Lazy Loading**: Images and non-critical resources load as needed
4. **Bundle Optimization**: Vite automatically optimizes the build

### Monitoring
- API response times
- Bundle size analysis
- Runtime performance metrics
- User experience metrics

---

## Security Considerations

### Data Protection
- API keys stored client-side only
- No sensitive data transmitted except to Google Gemini
- Session data cleared on logout
- Input sanitization for code execution

### Best Practices
- Regular dependency updates
- Secure API key handling
- Input validation
- Error message sanitization

---

## Troubleshooting

### Common Development Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### TypeScript Errors
- Check `tsconfig.json` configuration
- Ensure all imports have proper types
- Use `// @ts-ignore` sparingly and document why

#### Styling Issues
- Verify Tailwind configuration
- Check for conflicting CSS
- Use browser dev tools to debug

### Production Issues
- Check API key validity
- Verify network connectivity
- Monitor browser console for errors
- Test in different browsers

---

## Future Enhancements

### Planned Features
1. **Database Integration**: Replace localStorage with proper database
2. **Analytics Dashboard**: Detailed usage and progress analytics
3. **Multi-school Support**: Tenant-based architecture
4. **Advanced Code Editor**: Syntax highlighting and autocomplete
5. **Video Integration**: Supplementary video content
6. **Assessment System**: Formal testing and certification

### Architecture Improvements
1. **State Management**: Consider Redux for complex state
2. **Testing**: Comprehensive test suite
3. **Performance**: Advanced optimization techniques
4. **Accessibility**: Full WCAG compliance
5. **Internationalization**: Complete i18n support

---

## Support and Resources

### Documentation
- [User Manual](./USER_MANUAL.md)
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)

### External Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Google Gemini API](https://ai.google.dev/)

### Community
- GitHub Issues for bug reports
- GitHub Discussions for feature requests
- Email: support@greybrain.ai

---

*Last updated: January 2025*
*Version: 1.0.0*