# TAI - Technical Analysis Intelligence

TAI is a modern, real-time technical analysis platform designed to identify institutional flow and market constraints. It features a high-performance frontend for charting and a FastAPI backend for data processing.

## Project Structure

```
TAI/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── views/      # Main application views (FlowTA, Dashboard, etc.)
│   │   ├── services/   # API clients (Massive/Polygon, Backend API)
│   │   ├── data/       # Static configurations and types
│   │   └── components/ # Reusable UI components
│   ├── .env.local      # Local environment variables (API Keys)
│   └── package.json    # Frontend dependencies
│
├── backend/            # Python FastAPI service
│   ├── main.py         # Application entry point
│   └── requirements.txt # Python dependencies
└── README.md           # This file
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Massive/Polygon.io API Key

### 1. Frontend Setup

The frontend is built with React, Vite, and Lightweight Charts.

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure Environment
# Ensure .env.local exists with: VITE_MASSIVE_API_KEY=your_key_here

# Start Development Server
npm run dev
```
The application will run at [http://localhost:3000](http://localhost:3000) (or 3001/3002 if busy).

### 2. Backend Setup

The backend is a FastAPI service handling data aggregation and specific strategy logic.

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Start Server
uvicorn main:app --reload
```
The backend API will run at [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Features
- **Real-Time Data**: Streaming market data via WebSocket (Polygon.io/Massive).
- **Flow Mode**: Curated view logic for tracking institutional flow stocks.
- **Glassmorphic UI**: Modern, dark-themed interface optimized for visual clarity.
