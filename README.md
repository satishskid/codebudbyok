# Code Buddy - AI-Powered Programming Tutor

![Code Buddy Logo](https://img.shields.io/badge/Code%20Buddy-AI%20Tutor-blue?style=for-the-badge&logo=react)

**Code Buddy** is an interactive AI-powered learning platform designed to teach programming to school students in India. It features a friendly AI tutor, grade-specific curriculums, and a hands-on coding sandbox, all within a single browser window.

## 🌟 Features

### 🎓 **Educational Features**
- **Grade-based Curriculum**: Tailored content for Junior (4-6), Explorer (7-9), and Advanced (10-12) levels
- **Interactive AI Tutor**: Personalized guidance with Indian cultural context
- **Live Code Execution**: Students can write and run code directly in the browser
- **Progress Tracking**: Automatic curriculum progression and achievement tracking
- **Multi-language Support**: English, Hindi, Tamil, Telugu, Bengali, Marathi

### 🔧 **Technical Features**
- **Google Gemini AI Integration**: Advanced AI tutoring capabilities
- **Real-time Code Evaluation**: Instant feedback on student code
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Admin Dashboard**: Monitor API usage and system health
- **Secure Authentication**: Multi-level access control for admins and teachers

### 🎨 **User Experience**
- **Cultural Adaptation**: Uses Indian analogies (chai, cricket, Bollywood)
- **Encouraging Feedback**: Hinglish expressions like "Shabash!" and "Chalo!"
- **Interactive Elements**: Contextual action buttons for better engagement
- **Beautiful UI**: Modern design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/satishskid/codebudbyok.git
   cd codebudbyok
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Documentation

- **[User Manual](./docs/USER_MANUAL.md)** - Complete guide for teachers and students
- **[Developer Manual](./docs/DEVELOPER_MANUAL.md)** - Technical documentation for developers
- **[API Documentation](./docs/API.md)** - Service layer and integration details

## 🔐 Authentication Flow

### 1. Admin Setup (First Time)
- Admin enters Gemini API key
- Sets admin password: `Skidmin2025`
- Creates terminal password for teachers

### 2. Teacher Access
- Teachers log in with terminal password
- Access student learning interface
- Monitor student progress

### 3. Student Learning
- Students select grade level
- Interactive AI tutoring begins
- Code challenges and real-time feedback

## 🏗️ Architecture

```
Code Buddy/
├── components/          # React components
│   ├── ApiKeySetup.tsx     # Authentication setup
│   ├── ChatView.tsx        # Main learning interface
│   ├── AdminDashboard.tsx  # Admin controls
│   └── Message.tsx         # Chat message rendering
├── hooks/              # Custom React hooks
│   ├── useAuth.ts          # Authentication logic
│   └── useTerminal.ts      # Terminal management
├── services/           # API services
│   ├── geminiService.ts    # Google Gemini integration
│   └── apiService.ts       # Application API layer
├── types.ts           # TypeScript definitions
├── constants.ts       # Curriculum and prompts
└── App.tsx           # Main application component
```

## 🎯 Curriculum Structure

### Junior Level (Grades 4-6) - "The Thinker's Path"
- What is a Computer?
- Sequencing: Following Steps
- Conditionals: Making Choices
- Loops: Repeating Actions
- Basic Algorithms: Creating Recipes

### Explorer Level (Grades 7-9) - "The Python Adventure"
- print(): Saying Hello
- Variables: Storing Information
- if/else: Two-way Roads
- Lists: Making a Shopping List
- Loops: Doing Things Again and Again
- Functions: Reusable Magic Spells

### Advanced Level (Grades 10-12) - "The Builder's Toolkit"
- Advanced Functions: Spells with Ingredients
- Dictionaries: Labeled Boxes
- Error Handling: Planning for Mistakes
- File I/O: Reading and Writing Scrolls
- Intro to OOP: Creating Blueprints

## 🌐 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Environment Variables
No environment variables needed - API keys are managed through the application interface.

## 🛠️ Development

### Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Build Tool**: Vite 6
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React hooks and localStorage

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Component-based architecture
- Custom hooks for logic separation

## 📊 Features in Detail

### AI Tutoring System
- **Persona-based Teaching**: Friendly "computer wizard" personality
- **Analogy-first Explanations**: Complex concepts explained through simple analogies
- **Socratic Method**: Guides students to discover answers rather than giving direct solutions
- **Cultural Context**: Uses familiar Indian references and encouraging Hinglish

### Code Execution Engine
- **Markdown Code Blocks**: Students write code in ```python blocks
- **Run Command**: Add `// run` to execute code
- **Real-time Evaluation**: Instant feedback on correctness
- **Error Guidance**: Specific hints without giving away answers

### Progress Management
- **Curriculum Tracking**: Automatic progression through topics
- **Session Persistence**: Progress saved across browser sessions
- **Achievement System**: Visual indicators for completed topics
- **Time Estimates**: Duration guidance for each topic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the tutoring capabilities
- **Tailwind CSS** for the beautiful styling system
- **React Team** for the amazing framework
- **Indian Education System** for inspiring the cultural adaptations

## 📞 Support

For support, email support@greybrain.ai or create an issue in this repository.

---

**Made with ❤️ for Indian students by [GreyBrain.ai](https://greybrain.ai)**