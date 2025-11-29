# SeniorSync - AI Life Companion for Elderly

🎯 **An autonomous AI agent that keeps elderly safe, connected, and independent**

## Features

### Core Features (Implemented)
- ✅ **AI Conversational Agent** - Patient, elderly-friendly chat companion using OpenAI
- ✅ **Medication Management** - Add, track, and get reminders for medications
- ✅ **Scam Detection** - Real-time analysis of suspicious messages with explanations
- ✅ **Fact Checker** - "Is This Real?" feature to verify claims and news
- ✅ **Emergency Alert System** - One-tap emergency button to alert family
- ✅ **Local Activities Finder** - Discover nearby senior centers and community events
- ✅ **Intergenerational Matching** - Connect with students for mutual benefit
- ✅ **Senior-Friendly UI** - Large buttons, high contrast, simple navigation

## Project Structure

```
seniorsync/
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main application entry
│   ├── routers/            # API route handlers
│   │   ├── ai_agent.py     # AI chat endpoints
│   │   ├── medication.py   # Medication CRUD
│   │   ├── scam_detection.py
│   │   ├── emergency.py
│   │   ├── activities.py
│   │   └── fact_checker.py
│   ├── services/           # External service integrations
│   │   ├── openai_service.py
│   │   └── twilio_service.py
│   ├── .env                # Environment variables (create from .env.example)
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # HTML/CSS/JavaScript frontend
    ├── index.html          # Main HTML file
    ├── styles.css          # Senior-friendly styling
    └── app.js              # Application logic

```

## Setup Instructions

### Prerequisites
- Python 3.11+ installed
- OpenAI API key (required)
- Optional: Twilio account (for SMS), Google Maps API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd seniorsync/backend
   ```

2. **Activate virtual environment:**
   ```bash
   # Already created - use this command to run Python:
   venv\Scripts\python.exe
   ```

3. **Configure environment variables:**
   - Open `backend/.env` file
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```
   - Optional: Add Twilio, Google Maps, etc.

4. **Run the backend server:**
   ```bash
   venv\Scripts\python.exe main.py
   ```
   
   Server will start at: `http://localhost:8000`
   API docs available at: `http://localhost:8000/docs`

### Frontend Setup

1. **Open frontend in browser:**
   ```bash
   cd seniorsync/frontend
   ```
   
2. **Open `index.html` in your browser**
   - Double-click `index.html`, or
   - Use a simple HTTP server:
     ```bash
     # If you have Python:
     python -m http.server 5173
     # Then visit: http://localhost:5173
     ```

## Usage Guide

### For Development

1. **Start the backend:**
   ```bash
   cd seniorsync/backend
   venv\Scripts\python.exe main.py
   ```

2. **Open the frontend:**
   - Open `frontend/index.html` in your browser
   - Or use a local server on port 5173

### Main Features

#### 🏠 Home Dashboard
- View today's weather
- See scheduled medications
- Quick access to AI chat

#### 💊 Health & Medications
- Add new medications with dosage and times
- Track when medications are taken
- Get visual reminders

#### 👥 Connections
- Find local senior centers and activities
- Connect with students for tech help and wisdom exchange
- Wheelchair-accessible filters

#### 🛡️ Safety & Protection
- **Scam Detector**: Paste suspicious messages for instant analysis
- **Fact Checker**: Verify news claims and information
- **Demo Examples**: See common scam patterns

#### 💬 AI Chat
- Natural conversation with patient AI companion
- Contextaware (knows your medications, preferences)
- Simple, clear responses designed for seniors

#### 🚨 Emergency Button
- Always visible in header
- One-click alert to family contacts
- Includes location information

## API Endpoints

### AI Agent
- `POST /api/ai/chat` - Chat with AI agent

### Medications
- `POST /api/medications/` - Add medication
- `GET /api/medications/{user_id}` - Get user's medications
- `PUT /api/medications/{id}` - Update medication
- `DELETE /api/medications/{id}` - Delete medication

### Scam Detection
- `POST /api/scam/analyze` - Analyze message for scams
- `GET /api/scam/examples` - Get demo scam examples

### Fact Checking
- `POST /api/fact-check/check` - Verify a claim

### Emergency
- `POST /api/emergency/alert` - Send emergency alerts

### Activities
- `POST /api/activities/search` - Search local activities

## Configuration

### Required API Keys

1. **OpenAI API Key** (Required for AI features)
   - Get it from: https://platform.openai.com/api-keys
   - Add to `backend/.env`: `OPENAI_API_KEY=sk-...`

2. **Twilio** (Optional - for SMS alerts)
   - Get from: https://www.twilio.com/
   - Add Account SID, Auth Token, and Phone Number to `.env`

3. **Google Maps API** (Optional - for real location data)
   - Get from: https://developers.google.com/maps
   - Add to `.env`: `GOOGLE_MAPS_API_KEY=...`

4. **OpenWeather API** (Optional - for real weather)
   - Get from: https://openweathermap.org/api
   - Add to `.env`: `OPENWEATHER_API_KEY=...`

### Demo Mode

The app works in demo mode without optional API keys:
- Mock data for activities and weather
- Simulated SMS alerts
- All core features functional

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI API** - GPT-4 for AI conversations
- **Twilio** - SMS/Voice notifications
- **Python 3.13** - Programming language

### Frontend
- **Vanilla JavaScript** - No framework needed
- **HTML5/CSS3** - Senior-friendly UI design
- **REST API** - Communication with backend

## Design Principles

1. **Senior-Friendly**
   - Large fonts (20-28px)
   - High contrast colors
   - Simple navigation (max 5 tabs)
   - Touch-friendly buttons (60px+ height)

2. **Safety-First**
   - Scam detection and education
   - Emergency alert system
   - Clear, non-alarming language

3. **Patient & Respectful**
   - AI speaks warmly and clearly
   - No technical jargon
   - Confirms understanding often

## Development Notes

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
venv\Scripts\python.exe -m pytest

# Check API health
curl http://localhost:8000/health
```

### Common Issues

1. **CORS errors**: Make sure backend is running on port 8000
2. **API key errors**: Check `.env` file has correct OpenAI key
3. **Module not found**: Ensure virtual environment is activated

## Future Enhancements

- [ ] Voice interface (speech-to-text/text-to-speech)
- [ ] Proactive health monitoring
- [ ] Family dashboard web portal
- [ ] Mobile app versions
- [ ] Integration with health devices
- [ ] Multi-language support

## Contributing

This is a hackathon project built for rapid prototyping. Key areas for improvement:
- Add database (currently in-memory storage)
- Implement authentication
- Add comprehensive testing
- Improve error handling
- Add logging and monitoring

## License

Built for the SeniorSync Hackathon 2025

## Contact

For questions or demo requests, contact the development team.

---

**Remember**: The goal is to keep elderly users safe, connected, and independent. Every feature should be tested with actual senior users for accessibility and usability.
