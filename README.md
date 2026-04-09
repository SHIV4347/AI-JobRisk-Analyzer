# AI Job Risk Analyzer

An AI-powered full-stack application that analyzes the likelihood of a job being automated by AI. 
This platform uses Groq (Llama-3 model) to provide a detailed task-by-task risk breakdown, actionable career recommendations, and a personalized skills-to-learn plan.

## Features

- **Detailed AI Analysis**: Input your job title, experience level, tools used, and daily tasks to get an in-depth automation risk score.
- **Task Breakdown**: Identifies whether each of your everyday tasks is repetitive, creative, or requires human interaction.
- **Smart Recommendations**: Tailored advice and skill-building suggestions to future-proof your career.
- **Modern & Premium UI**: Built with React and Tailwind CSS for a seamless, Stripe-like premium user experience.

---

## Technology Stack

- **Frontend**: React, React Router, Vite, Tailwind CSS
- **Backend**: FastAPI, Python, SQLAlchemy, PostgreSQL
- **AI Integration**: Groq API (llama-3.3-70b-versatile)

---

## Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (running locally or remotely)
- A Groq account & API Key (for the LLM engine)

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

Set up your `.env` file! A template is provided at the root:
```bash
cp ../.env.example .env
```
Ensure your `DATABASE_URL` is pointing to a valid PostgreSQL database, and your `GROQ_API_KEY` is present.

Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The database tables and columns will be automatically created on startup.*

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install packages and run the Vite development server:
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to interact with the app.

---

## 📦 Deployment

You can deploy this application easily to modern platforms:
- **Frontend**: Deploy `frontend/` seamlessly to Vercel or Netlify. Add `VITE_API_URL` pointing to your backend URL.
- **Backend**: Deploy `backend/` to Railway, Render, or Heroku. Add `DATABASE_URL` and `GROQ_API_KEY` in their environment settings.

**Check the deployment checklist walkthrough generated in the codebase for detailed instructions.**

---

## Project Structure

```
├── backend/
│   ├── ai_engine.py      # Handles Groq integration and rule-based risk adjustments
│   ├── database.py       # SQLAlchemy and Postgres configuration
│   ├── main.py           # FastAPI entrypoint
│   ├── models.py         # DB schema models
│   ├── routes/           # API Endpoints (e.g., analyze.py)
│   ├── schemas.py        # Pydantic validation schemas
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Views (HomePage, ResultPage)
│   │   ├── App.jsx       # Routing wrapper
│   │   └── index.css     # Global + Tailwind styling
│   ├── package.json      # Node.js dependencies
│   ├── tailwind.config.js# Tailwind theme config
│   └── vite.config.js    # Vite configuration
├── .env.example          # Environment variables blueprint
└── README.md             # This file!
```
