<div align="center">

# Echo

#### AI-Powered Customer Support Platform with Voice Capabilities

[![Web Dashboard](https://img.shields.io/badge/Web%20Dashboard-000?logo=vercel)](https://web-echo.vercel.app)
[![Widget Demo](https://img.shields.io/badge/Widget%20Demo-000?logo=vercel)](https://echo-widgets.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-95%25-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Features](#features) • [Quick Start](#quick-start) • [Tech Stack](#tech-stack) • [Development](#development)

![Echo Dashboard](./public/assets/dashboard.png)

</div>

## Overview

Echo is an intelligent AI customer support platform that provides instant, context-aware assistance through an embeddable widget. Powered by advanced language models and RAG technology, it helps reduce support ticket volume while maintaining high-quality customer interactions.

## Features

### Core Capabilities

- 🤖 **AI-Powered Conversations**
  - Natural language understanding and generation
  - Context-aware responses
  - 24/7 automated support

- 🎯 **Embeddable Widget**
  - Lightweight chat interface
  - One-line script integration
  - Responsive design

- 📚 **RAG Knowledge Base**
  - Document vectorization (PDFs, text)
  - Business-specific context integration
  - Automated knowledge updates

- 🗣️ **Voice Integration**
  - AI voice agent capabilities
  - Natural voice conversations
  - VAPI plugin support

### Management Features

- 💼 **Dashboard**
  - Conversation management
  - Knowledge base administration
  - Analytics and insights
  - Team collaboration tools

- 🎨 **Customization**
  - Widget appearance
  - Behavior configuration
  - Brand alignment options

- 👥 **Multi-tenancy**
  - Organization management
  - Team access controls
  - Role-based permissions

## Tech Stack

- **Frontend**
  - Next.js 15+ (App Router)
  - React & TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Jotai state management

- **Backend**
  - Convex (Full-stack TypeScript)
  - RAG implementation
  - Voice API integration

- **Infrastructure**
  - Turborepo
  - pnpm workspace
  - Vercel deployment
  - Sentry monitoring

## Project Structure

```
echo/
├── apps/
│   ├── web/          # Dashboard application
│   ├── widgets/      # Chat widget UI
│   └── embed/        # Embeddable script
├── packages/
│   ├── backend/      # Convex backend
│   ├── ui/          # Shared components
│   └── config/      # Shared configurations
```

## Quick Start

### Prerequisites

- Node.js v20+
- pnpm v10+

### Installation

```bash
# Clone repository
git clone https://github.com/VatsalUmrania/echo.git
cd echo

# Install dependencies
pnpm install

# Setup environment
cp apps/web/.env.example apps/web/.env.local
cp packages/backend/.env.example packages/backend/.env
```

### Environment Setup

```env
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=

# packages/backend/.env
CONVEX_DEPLOYMENT_KEY=
OPENAI_API_KEY=
VAPI_API_KEY=
```

### Development

```bash
turbo dev
```

The development server will start two applications:
- Web Dashboard: [http://localhost:3000](http://localhost:3000)
- Widget Dashboard: [http://localhost:3001](http://localhost:3001)

## Deployment

Echo is deployed on Vercel with two separate applications:

- **Web Dashboard**: [https://web-echo.vercel.app](https://web-echo.vercel.app)
- **Widget Demo**: [https://echo-widgets.vercel.app](https://echo-widgets.vercel.app)

