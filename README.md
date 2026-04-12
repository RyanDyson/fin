# Fin.

Submission for GDGoC Hack@UST.

Fin is an AI-powered study platform built around the core philosophy of the **Feynman Technique**: you learn best by teaching. Upload your textbooks, PDFs, and slide decks, and Fin automatically extracts key concepts to build a personalized chat where you are challenged to explain concepts back to an AI tutor in your own words.

## Tech Stack

### Frontend & Core
- **[Next.js 15](https://nextjs.org)** 
- **[React](https://react.dev/)**
- **[Tailwind CSS](https://tailwindcss.com)** 
- **[Shadcn UI](https://ui.shadcn.com)** & **[ReUI](https://reui.io/)** 
- **[Motion](https://motion.dev/)** 

### Backend & Data
- **[tRPC](https://trpc.io)** - 
- **[Drizzle ORM](https://orm.drizzle.team)**
- **[Neon PostgreSQL](https://neon.com/)** 
- **[Better-Auth](https://www.better-auth.com/)**

### AI Microservice
- **FastAPI (Python)** 
- **N8N (To serve models)** 
- **Ollama (Embedding models & LLMs)** 

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm, npm, or yarn
- PostgreSQL database (e.g., Neon)
- The Fin FastAPI backend running locally or deployed.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fin.git
   cd fin
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host/dbname"

   # Authentication (Better-Auth)
   BETTER_AUTH_SECRET="your-super-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"

   # AI Backend URL
   FAST_API_URL="http://localhost:8000"
   ```

4. **Database Setup**
   Push the schema to your database using Drizzle:
   ```bash
   pnpm db:push
   ```

5. **Run the Development Server**
   ```bash
   pnpm dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

- `/src/app` - Next.js App Router pages (Dashboard, Auth, Landing Page)
- `/src/components` - React components (Chat UI, Modals, Forms, UI library)
- `/src/hooks` - Custom React hooks (e.g., `useChat`)
- `/src/server/api` - tRPC routers bridging the frontend to the DB and FastAPI
- `/src/server/db` - Drizzle ORM schema and database configuration
