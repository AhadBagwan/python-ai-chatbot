# 🤖 AhadNova AI

A premium, full-stack AI chatbot and security engineering assistant built with **React 19**, **FastAPI**, and **Google Gemini 2.0 AI**. Inspired by the minimal, calm design principles of Claude, ChatGPT, Linear, and Vercel.

![AhadNova AI](https://img.shields.io/badge/AhadNova-AI-6366f1?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![Gemini 2.0](https://img.shields.io/badge/Gemini-2.0_Flash-8E75B2?style=for-the-badge&logo=google)

---

## ✨ Highlights & Features

### 🎨 Modern Minimalist UI & Dynamic Multi-Theme Engine
- ☀️/🌙 **Full-Screen Dark & Light Mode** - Dedicated single-click theme mode toggle button in header.
- 🎨 **8 Dynamic Color Palettes** (Applies seamlessly across both Light & Dark modes):
  - 💜 **Claude Indigo** (Default)
  - 💚 **Cyber Matrix** (Neon Emerald Security)
  - 💙 **Nordic Frost** (Arctic Navy & Ice Blue)
  - 🧡 **Solarized Warm** (Amber Coffee Parchment)
  - 💖 **Neon Synthwave** (Vibrant Magenta Quartz)
  - 🖤 **Midnight OLED** (True Pitch-Black OLED)
  - 🔮 **Amethyst Purple** (Royal Purple Obsidian)
  - 🤍 **Vercel Mono** (Minimal Monochrome)
- 🔘 **Pill Component Design System** - Rounded controls with micro-glow transitions and clear active states.
- 📐 **Live Mermaid Vector Diagrams** - Auto-renders protocol handshakes, network topologies, and microservice flows.

---

### 🛠️ Built-in Security Engineering & Cyber Suite
- 🛡️ **SAST Code Security Auditor** - Scans code snippets for OWASP Top 10 vulnerabilities, CWE scores, and returns remediated secure patches.
- 🌐 **Network CIDR Calculator** - Offline IPv4 CIDR subnetting calculator & host boundary metric engine.
- 🔑 **JWT Token Inspector** - Decodes JWT header and payload claims securely offline.
- 🏆 **Interactive Exam Quiz Hub** - AI-generated practice exam questions for Security+, CEH, CCNA, and System Design with explanations.

---

### 🎙️ Audio & Interactive Capabilities
- 🗣️ **Text-to-Speech Voice Engine** - Select browser TTS voices directly from Settings with voice synthesis playback.
- 🎤 **Voice Input Dictation** - Speak queries directly using Web Speech API integration.
- 📄 **Export Options** - Single-click chat transcript export as `.md` Markdown files.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** 18+
- **Python** 3.11+
- **Google Gemini API Key** ([Get free key](https://aistudio.google.com/app/apikey))

---

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your GEMINI_API_KEY
cp .env.example .env
```

Start the FastAPI backend server:
```bash
python run.py
```
The backend API and Swagger docs will run at **http://localhost:8000** (Docs: **http://localhost:8000/docs**).

---

### 2. Frontend Setup (React 19 + Vite + Tailwind)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will start at **http://localhost:5173**.

---

## 🏗️ Project Architecture

```
ahadnova-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point & CORS configuration
│   │   ├── config.py            # Environment configuration & Gemini keys
│   │   ├── routes/              # API endpoints (Chat, Stream, Audit, Quiz)
│   │   │   ├── chat.py          # Gemini AI chat, SAST audit & Quiz endpoints
│   │   │   └── health.py        # System health & readiness checks
│   │   └── services/            # Core business logic
│   │       ├── gemini_service.py # Gemini 2.0 API integration & streaming
│   │       └── image_service.py  # Image processing for attachments
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/            # ChatWindow, ChatMessage, ChatInput, EmptyChat
│   │   │   ├── layout/          # Header (with Theme & Model pills), Sidebar
│   │   │   ├── modals/          # SettingsModal, SecurityAuditModal, CyberUtilsModal, QuizHubModal, AboutModal
│   │   │   └── ui/              # MermaidRenderer, Pill Buttons, Dialogs
│   │   ├── stores/              # Zustand state (settingsStore, themeStore, chatStore)
│   │   ├── App.jsx              # Main app shell & theme application
│   │   ├── index.css            # Multi-theme CSS engine & variables
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Start New Chat |
| `Ctrl + B` | Toggle Sidebar |
| `Ctrl + ,` | Open Settings & Preferences |
| `Ctrl + Shift + T` | Toggle Light / Dark Mode |
| `/` | Focus Chat Input Composer |
| `Escape` | Close Open Modals |

---

## 📄 License

MIT License - Built with ❤️ by **[Ahad Bagwan](https://www.linkedin.com/in/ahadbagwan/)**.
