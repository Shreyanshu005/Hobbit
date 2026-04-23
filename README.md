# Hobbit

Hobbit is a personalized AI-powered learning companion that helps users discover, learn, and master new hobbies through conversational onboarding, dynamically generated learning plans, and rich media content.

## Project Structure

The project is structured as a monorepo containing two main parts:

- **`hobbit-frontend`**: The React-based frontend application powered by Vite, Tailwind CSS, and Zustand.
- **`hobbit-server`**: The Node.js and Express backend API that handles AI generation using Groq/Gemini, validates inputs, and integrates with the YouTube Data API.

## Features

- **Conversational Onboarding**: Chat with an AI agent to specify your hobby, skill level, and goals.
- **Personalized Learning Plans**: Receive structured learning techniques, modules, and practice recommendations.
- **Progress Tracking**: Keep track of your learning achievements and track your mastery.
- **Media Integration**: Get real-time video recommendations relevant to your specific technique and current progress via YouTube.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand, React Router, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Google Generative AI (Gemini), Groq SDK, YouTube Data API v3.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies for the server:
   ```bash
   cd hobbit-server
   npm install
   ```

2. Install dependencies for the frontend:
   ```bash
   cd hobbit-frontend
   npm install
   ```

3. Setup environment variables:
   Create a `.env` file in `hobbit-server` and add:
   ```env
   PORT=5000
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

4. Run the development servers:
   In `hobbit-server`:
   ```bash
   npm run dev
   ```
   
   In `hobbit-frontend`:
   ```bash
   npm run dev
   ```

## Deployment

- The frontend is deployed on Vercel at `https://hobbit-chi.vercel.app`
- The backend is deployed on Render at `https://hobbit-2.onrender.com`
