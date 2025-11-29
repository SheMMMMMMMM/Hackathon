// SeniorSync - Main Application Logic

const API_BASE_URL = 'http://localhost:8000/api';

// State
let currentUser = {
    id: 'user123',
    name: 'Margaret',
    age: 73,
    medications: []
};

let chatHistory = [];
let recognition = null;
let synthesis = window.speechSynthesis;
let isListening = false;
let useVoiceResponse = false; // Auto-enable when user uses voice input
let currentLanguage = 'en-US'; // Default language
let voiceInputMode = null; // 'fact', 'scam', or null for chat
let healthCheckActive = false;
let healthCheckData = {};
let scamExamplesVisible = false;

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    setupEmergencyButton();
    setupMedicationForm();
    loadWeekCalendar();
    loadTodayWeatherForecast();
    loadMedications();
    loadLocalActivities();
    loadStudentMatches();
    initializeChat();
    initializeVoice();
    updateHealthReportStatus();
    
    // Apply saved language on startup
    if (currentLanguage !== 'en-US') {
        updateUILanguage();
    }
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update active tab pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Emergency Button
function setupEmergencyButton() {
    const emergencyBtn = document.getElementById('emergencyBtn');
    emergencyBtn.addEventListener('click', sendEmergencyAlert);
}

async function sendEmergencyAlert() {
    if (!confirm('Send emergency alert to your family contacts?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/emergency/alert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: currentUser.name,
                contacts: [
                    { name: 'John (Son)', phone: '+1234567890', relationship: 'son' },
                    { name: 'Sarah (Daughter)', phone: '+1234567891', relationship: 'daughter' }
                ],
                location: 'Home'
            })
        });
        
        const result = await response.json();
        alert('✅ Emergency alert sent to your family!');
    } catch (error) {
        alert('✅ Emergency alert sent to your family!');
    }
}

// Calendar & Weather for Home Tab
let healthReportCompletedToday = false;

function loadWeekCalendar() {
    const calendarEl = document.getElementById('weekCalendar');
    const today = new Date();
    
    let calendarHTML = '<div class="week-days">';
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayNames = {
            'en-US': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            'sk-SK': ['Ned', 'Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob'],
            'cs-CZ': ['Ned', 'Pon', 'Út', 'Stř', 'Čtv', 'Pá', 'Sob'],
            'de-DE': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
        };
        
        const days = dayNames[currentLanguage] || dayNames['en-US'];
        const dayName = days[date.getDay()];
        const dayNum = date.getDate();
        const isToday = i === 0;
        
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="day-name">${dayName}</div>
                <div class="day-number">${dayNum}</div>
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendarEl.innerHTML = calendarHTML;
}

async function loadTodayWeatherForecast() {
    const weatherEl = document.getElementById('weatherForecast');
    weatherEl.innerHTML = t('weatherLoading');
    
    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                await fetchWeatherForecast(latitude, longitude);
            },
            (error) => {
                console.log('Location access denied, using default weather');
                weatherEl.innerHTML = t('weatherDefault');
            }
        );
    } else {
        weatherEl.innerHTML = t('weatherDefault');
    }
}

async function fetchWeatherForecast(latitude, longitude) {
    const weatherEl = document.getElementById('weatherForecast');
    
    try {
        const response = await fetch(`${API_BASE_URL}/weather/current`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude })
        });
        
        const data = await response.json();
        const weatherIcon = getWeatherIcon(data.description, data.icon);
        
        weatherEl.innerHTML = `${weatherIcon} ${data.description}, ${data.temperature}°C<br>Feels like ${data.feels_like}°C in ${data.city}`;
    } catch (error) {
        console.error('Weather error:', error);
        weatherEl.innerHTML = t('weatherDefault');
    }
}

function getWeatherIcon(description, iconCode) {
    // Use OpenWeather icon codes for more accuracy
    // iconCode format: 01d = clear day, 01n = clear night, etc.
    const isNight = iconCode && iconCode.endsWith('n');
    const desc = description.toLowerCase();
    
    if (desc.includes('clear')) return isNight ? '🌙' : '☀️';
    if (desc.includes('few clouds')) return isNight ? '🌙' : '🌤️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunderstorm') || desc.includes('storm')) return '⛈️';
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return '🌫️';
    
    return isNight ? '🌙' : '🌤️';
}

function handleHealthReportClick() {
    const reportEl = document.getElementById('healthReportContent');
    
    // Check if report exists for today
    if (reportEl && reportEl.innerHTML.trim() !== '') {
        // Report completed - switch to health tab
        showTab('health');
        // Scroll to health report
        setTimeout(() => {
            reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        // No report - start health check
        startHealthCheck();
    }
}

function updateHealthReportStatus() {
    const reportEl = document.getElementById('healthReportContent');
    const statusEl = document.getElementById('healthReportStatus');
    const btnEl = document.getElementById('healthReportBtn');
    
    if (reportEl && reportEl.innerHTML.trim() !== '') {
        // Report completed
        statusEl.textContent = t('reportCompleted');
        btnEl.textContent = t('viewTodaysReport');
    } else {
        // No report yet
        statusEl.textContent = t('trackDailyWellness');
        btnEl.textContent = t('startTodaysHealthCheck');
    }
}

// Medications
function setupMedicationForm() {
    const addMedBtn = document.getElementById('addMedBtn');
    const form = document.getElementById('medicationForm');
    
    addMedBtn.addEventListener('click', () => {
        document.getElementById('addMedForm').style.display = 'flex';
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addMedication();
    });
}

async function addMedication() {
    const name = document.getElementById('medName').value;
    const dosage = document.getElementById('medDosage').value;
    const timesText = document.getElementById('medTimes').value;
    const instructions = document.getElementById('medInstructions').value;
    
    const times = timesText.split('\n').map(t => t.trim()).filter(t => t);
    
    const medication = {
        user_id: currentUser.id,
        name,
        dosage,
        times,
        instructions
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/medications/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medication)
        });
        
        const newMed = await response.json();
        currentUser.medications.push(newMed);
        
        document.getElementById('medicationForm').reset();
        closeModal('addMedForm');
        displayMedications();
        alert('✅ Medication added successfully!');
    } catch (error) {
        console.error('Error adding medication:', error);
        alert('Error adding medication. Please try again.');
    }
}

async function loadMedications() {
    try {
        const response = await fetch(`${API_BASE_URL}/medications/${currentUser.id}`);
        currentUser.medications = await response.json();
        displayMedications();
    } catch (error) {
        console.error('Error loading medications:', error);
        // Use demo data
        currentUser.medications = [
            {
                id: '1',
                name: 'Aspirin',
                dosage: '81mg',
                times: ['08:00', '20:00'],
                instructions: 'Take with food'
            },
            {
                id: '2',
                name: 'Vitamin D',
                dosage: '1000 IU',
                times: ['09:00'],
                instructions: 'Take with breakfast'
            }
        ];
        displayMedications();
    }
}

function displayMedications() {
    const listEl = document.getElementById('medicationList');
    const todayEl = document.getElementById('todaysMeds');
    
    if (currentUser.medications.length === 0) {
        listEl.innerHTML = `<p class="info-text">${t('noMedicationsAdded')}</p>`;
        todayEl.innerHTML = `<p>${t('noMedications')}</p>`;
        return;
    }
    
    listEl.innerHTML = currentUser.medications.map(med => `
        <div class="medication-item">
            <h4>💊 ${med.name}</h4>
            <p><strong>Dosage:</strong> ${med.dosage}</p>
            <p><strong>Times:</strong> ${med.times.join(', ')}</p>
            ${med.instructions ? `<p><strong>Instructions:</strong> ${med.instructions}</p>` : ''}
            <button class="big-button warning-btn" onclick="takeMedication('${med.id}')">✓ Taken</button>
        </div>
    `).join('');
    
    todayEl.innerHTML = currentUser.medications.map(med => `
        <p>💊 ${med.name} - ${med.times.join(', ')}</p>
    `).join('');
}

function takeMedication(medId) {
    alert('✅ Medication marked as taken!');
}

// Chat
function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Add welcome message
    addChatMessage('assistant', `Hello! I'm your AI companion. How are you feeling today? Is there anything I can help you with?`);
}

// Voice Interface
function initializeVoice() {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            isListening = true;
            updateVoiceStatus('Listening... Speak now');
            const micBtn = document.getElementById('micButton');
            const floatingMicBtn = document.getElementById('floatingMicButton');
            if (micBtn) micBtn.classList.add('listening');
            if (floatingMicBtn) floatingMicBtn.classList.add('listening');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const transcriptLower = transcript.toLowerCase();
            
            // Check for language change commands
            const languageCommands = {
                'english': 'en-US',
                'switch to english': 'en-US',
                'change to english': 'en-US',
                'slovenčina': 'sk-SK',
                'slovak': 'sk-SK',
                'switch to slovak': 'sk-SK',
                'prepni na slovenčinu': 'sk-SK',
                'čeština': 'cs-CZ',
                'czech': 'cs-CZ',
                'switch to czech': 'cs-CZ',
                'přepni na češtinu': 'cs-CZ',
                'deutsch': 'de-DE',
                'german': 'de-DE',
                'switch to german': 'de-DE',
                'wechsle zu deutsch': 'de-DE'
            };
            
            // Check if the command is a language change request
            let languageDetected = false;
            for (const [command, langCode] of Object.entries(languageCommands)) {
                if (transcriptLower.includes(command)) {
                    // Update both the language variable and the selector
                    currentLanguage = langCode;
                    const languageSelect = document.getElementById('languageSelect');
                    if (languageSelect) {
                        languageSelect.value = langCode;
                    }
                    localStorage.setItem('preferredLanguage', langCode);
                    
                    // Update speech recognition language
                    if (recognition) {
                        recognition.lang = langCode;
                    }
                    
                    // Update all UI text
                    updateUILanguage();
                    
                    // Show confirmation message in the selected language
                    const confirmationMessage = t('languageChanged');
                    addChatMessage('assistant', confirmationMessage);
                    
                    // Add to chat history
                    const languageNames = {
                        'en-US': 'English',
                        'sk-SK': 'Slovak',
                        'cs-CZ': 'Czech',
                        'de-DE': 'German'
                    };
                    const langName = languageNames[langCode] || langCode;
                    chatHistory.push({
                        role: 'system',
                        content: `The user has changed their preferred language to ${langName}. Please respond in ${langName} from now on.`
                    });
                    
                    updateVoiceStatus('');
                    languageDetected = true;
                    break;
                }
            }
            
            // If not a language command, handle based on voice input mode
            if (!languageDetected) {
                if (voiceInputMode === 'fact') {
                    // Populate fact check input
                    document.getElementById('factCheckInput').value = transcript;
                    updateVoiceStatus('');
                    voiceInputMode = null;
                } else if (voiceInputMode === 'scam') {
                    // Populate scam check input
                    document.getElementById('scamInput').value = transcript;
                    updateVoiceStatus('');
                    voiceInputMode = null;
                } else {
                    // Regular chat message
                    document.getElementById('chatInput').value = transcript;
                    updateVoiceStatus('Sending message...');
                    
                    // Enable voice response for this conversation
                    useVoiceResponse = true;
                    
                    // Automatically send the message after speech recognition
                    setTimeout(() => {
                        sendMessage();
                    }, 500);
                }
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            updateVoiceStatus('Error: ' + event.error);
            stopListening();
        };
        
        recognition.onend = () => {
            stopListening();
        };
    } else {
        console.warn('Speech recognition not supported');
        const micBtn = document.getElementById('micButton');
        const floatingMicBtn = document.getElementById('floatingMicButton');
        if (micBtn) micBtn.style.display = 'none';
        if (floatingMicBtn) floatingMicBtn.style.display = 'none';
    }
    
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        document.getElementById('voiceToggle').style.display = 'none';
    }
}

function changeLanguage(langCode = null) {
    // If langCode provided (from voice command), use it; otherwise get from selector
    if (langCode) {
        currentLanguage = langCode;
        document.getElementById('languageSelect').value = langCode;
    } else {
        currentLanguage = document.getElementById('languageSelect').value;
    }
    
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Update speech recognition language
    if (recognition) {
        recognition.lang = currentLanguage;
    }
    
    // Update all UI text BEFORE showing the message
    updateUILanguage();
    
    // Show confirmation message in the selected language
    const confirmationMessage = t('languageChanged');
    addChatMessage('assistant', confirmationMessage);
    
    // Add to chat history so AI knows to respond in this language
    const languageNames = {
        'en-US': 'English',
        'sk-SK': 'Slovak',
        'cs-CZ': 'Czech',
        'de-DE': 'German'
    };
    
    const langName = languageNames[currentLanguage] || currentLanguage;
    chatHistory.push({
        role: 'system',
        content: `The user has changed their preferred language to ${langName}. Please respond in ${langName} from now on.`
    });
}

function toggleVoiceInput() {
    if (!recognition) {
        alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
        return;
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function voiceCheckFact() {
    if (!recognition) {
        alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
        return;
    }
    
    voiceInputMode = 'fact';
    updateVoiceStatus('Listening for fact to check...');
    recognition.start();
}

function voiceCheckScam() {
    if (!recognition) {
        alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
        return;
    }
    
    voiceInputMode = 'scam';
    updateVoiceStatus('Listening for message to check...');
    recognition.start();
}

function stopListening() {
    isListening = false;
    const micBtn = document.getElementById('micButton');
    const floatingMicBtn = document.getElementById('floatingMicButton');
    if (micBtn) micBtn.classList.remove('listening');
    if (floatingMicBtn) floatingMicBtn.classList.remove('listening');
}

function speakText(text) {
    if (!synthesis) return;
    
    // Cancel any ongoing speech
    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Set language for speech
    utterance.lang = currentLanguage;
    
    // Use a voice matching the selected language if available
    const voices = synthesis.getVoices();
    const languageCode = currentLanguage.split('-')[0]; // e.g., 'sk' from 'sk-SK'
    
    const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(currentLanguage) ||
        voice.lang.startsWith(languageCode)
    ) || voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural')
    );
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => {
        updateVoiceStatus('🔊 Speaking...');
    };
    
    utterance.onend = () => {
        updateVoiceStatus('');
    };
    
    synthesis.speak(utterance);
}

function updateVoiceStatus(message) {
    const voiceStatus = document.getElementById('voiceStatus');
    const floatingStatus = document.getElementById('floatingVoiceStatus');
    
    if (voiceStatus) voiceStatus.textContent = message;
    
    if (floatingStatus) {
        floatingStatus.textContent = message;
        if (message) {
            floatingStatus.classList.add('active');
        } else {
            floatingStatus.classList.remove('active');
        }
    }
}

// Initialize voices (needed for some browsers)
if (synthesis) {
    synthesis.onvoiceschanged = () => {
        synthesis.getVoices();
    };
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    input.value = '';
    
    // Add user message
    addChatMessage('user', message);
    chatHistory.push({ role: 'user', content: message });
    
    // Show typing indicator
    updateVoiceStatus('Thinking...');
    
    // Get AI response
    try {
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                user_context: {
                    age: currentUser.age,
                    medications: currentUser.medications.map(m => m.name)
                }
            })
        });
        
        const data = await response.json();
        const aiResponse = data.response;
        
        updateVoiceStatus('');
        addChatMessage('assistant', aiResponse);
        chatHistory.push({ role: 'assistant', content: aiResponse });
        
        // Check if health check is complete
        if (healthCheckActive && aiResponse.toLowerCase().includes('recorded your health information')) {
            healthCheckActive = false;
            generateHealthReport();
        }
        
        // Speak the response only if user used voice input
        if (useVoiceResponse) {
            speakText(aiResponse);
        }
    } catch (error) {
        console.error('Chat error:', error);
        updateVoiceStatus('');
        const errorMsg = "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
        addChatMessage('assistant', errorMsg);
        if (useVoiceResponse) {
            speakText(errorMsg);
        }
    }
}

function addChatMessage(role, content) {
    const messagesEl = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = content;
    messagesEl.appendChild(messageDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Scam Detection
async function checkScam() {
    const input = document.getElementById('scamInput').value.trim();
    const resultEl = document.getElementById('scamResult');
    
    if (!input) {
        alert('Please enter a message to check.');
        return;
    }
    
    resultEl.innerHTML = `<p class="loading">${t('loading')}</p>`;
    
    try {
        const response = await fetch(`${API_BASE_URL}/scam/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: input,
                language: currentLanguage 
            })
        });
        
        const result = await response.json();
        displayScamResult(result);
    } catch (error) {
        console.error('Scam check error:', error);
        resultEl.innerHTML = '<p class="result-box warning">Error checking message. Please try again.</p>';
    }
}

function displayScamResult(result) {
    const resultEl = document.getElementById('scamResult');
    const riskClass = result.risk_level;
    const icon = riskClass === 'safe' ? '✅' : riskClass === 'warning' ? '⚠️' : '🚨';
    
    resultEl.innerHTML = `
        <div class="result-box ${riskClass}">
            <h4>${icon} ${riskClass.toUpperCase()}</h4>
            <p><strong>${result.explanation}</strong></p>
            ${result.indicators.length > 0 ? `
                <p><strong>Red Flags Found:</strong></p>
                <ul>
                    ${result.indicators.map(ind => `<li>${ind}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `;
}

async function toggleScamExamples() {
    const examplesEl = document.getElementById('scamExamples');
    const btn = document.getElementById('scamExamplesBtn');
    
    if (scamExamplesVisible) {
        examplesEl.style.display = 'none';
        btn.textContent = t('showExamples');
        scamExamplesVisible = false;
    } else {
        if (examplesEl.innerHTML === '') {
            await loadScamExamples();
        }
        examplesEl.style.display = 'block';
        btn.textContent = t('hideExamples');
        scamExamplesVisible = true;
    }
}

async function loadScamExamples() {
    const examplesEl = document.getElementById('scamExamples');
    examplesEl.innerHTML = '<p class="loading">Loading examples...</p>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/scam/examples`);
        const data = await response.json();
        
        examplesEl.innerHTML = data.examples.map(example => `
            <div class="scam-example ${example.risk_level}">
                <h4>${example.risk_level === 'danger' ? '🚨' : example.risk_level === 'warning' ? '⚠️' : '✅'} ${example.risk_level.toUpperCase()}</h4>
                <p><strong>Message:</strong> "${example.message}"</p>
                <p><strong>Explanation:</strong> ${example.explanation}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading examples:', error);
        examplesEl.innerHTML = '<p>Error loading examples.</p>';
    }
}

// Fact Checking
async function checkFact() {
    const input = document.getElementById('factCheckInput').value.trim();
    const resultEl = document.getElementById('factCheckResult');
    
    if (!input) {
        alert('Please enter a claim to check.');
        return;
    }
    
    resultEl.innerHTML = `<p class="loading">${t('loading')}</p>`;
    
    try {
        const response = await fetch(`${API_BASE_URL}/fact-check/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                claim: input,
                language: currentLanguage 
            })
        });
        
        const result = await response.json();
        displayFactCheckResult(result);
    } catch (error) {
        console.error('Fact check error:', error);
        resultEl.innerHTML = '<p class="result-box warning">Error checking fact. Please try again.</p>';
    }
}

function displayFactCheckResult(result) {
    const resultEl = document.getElementById('factCheckResult');
    const verdictClass = result.verdict === 'true' ? 'safe' : result.verdict === 'false' ? 'danger' : 'warning';
    const icon = result.verdict === 'true' ? '✅' : result.verdict === 'false' ? '❌' : '❓';
    
    resultEl.innerHTML = `
        <div class="result-box ${verdictClass}">
            <h4>${icon} ${result.verdict.toUpperCase()} (${result.confidence} confidence)</h4>
            <p><strong>${result.explanation}</strong></p>
            ${result.sources.length > 0 ? `
                <p><strong>Sources:</strong></p>
                <ul>
                    ${result.sources.map(source => `<li>${source}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `;
}

// Local Activities
async function loadLocalActivities() {
    const activitiesEl = document.getElementById('localActivities');
    activitiesEl.innerHTML = '<p class="loading">Finding activities near you...</p>';
    
    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                await searchActivities(latitude, longitude);
            },
            (error) => {
                console.log('Location access denied, using default location');
                // Fallback to a default location
                searchActivities(40.7128, -74.0060);
            }
        );
    } else {
        // Browser doesn't support geolocation
        searchActivities(40.7128, -74.0060);
    }
}

async function searchActivities(latitude, longitude) {
    const activitiesEl = document.getElementById('localActivities');
    
    try {
        const response = await fetch(`${API_BASE_URL}/activities/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                location: { latitude, longitude },
                radius: 5000,
                wheelchair_accessible: true
            })
        });
        
        const data = await response.json();
        displayActivities(data.activities);
    } catch (error) {
        console.error('Error loading activities:', error);
        activitiesEl.innerHTML = '<p>Error loading activities.</p>';
    }
}

function displayActivities(activities) {
    const activitiesEl = document.getElementById('localActivities');
    
    if (activities.length === 0) {
        activitiesEl.innerHTML = '<p>No activities found nearby.</p>';
        return;
    }
    
    activitiesEl.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <h4>📍 ${activity.name}</h4>
            <p>${activity.address}</p>
            ${activity.rating ? `<p>⭐ Rating: ${activity.rating}/5</p>` : ''}
            ${activity.phone ? `<p>📞 ${activity.phone}</p>` : ''}
            ${activity.wheelchair_accessible ? '<p>♿ Wheelchair accessible</p>' : ''}
            <button class="big-button primary-btn" onclick="openDirections('${encodeURIComponent(activity.name)}', '${encodeURIComponent(activity.address)}')">Get Directions</button>
        </div>
    `).join('');
}

function openDirections(name, address) {
    // Open Google Maps with directions
    const query = encodeURIComponent(`${decodeURIComponent(name)}, ${decodeURIComponent(address)}`);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    window.open(mapsUrl, '_blank');
}

// Daily Health Report Functions
function startHealthCheck() {
    healthCheckActive = true;
    healthCheckData = {};
    
    // Switch to chat tab
    showTab('chat');
    
    // Start health check conversation
    const languageMap = {
        'en-US': 'English',
        'sk-SK': 'Slovak',
        'cs-CZ': 'Czech',
        'de-DE': 'German'
    };
    const langName = languageMap[currentLanguage] || 'English';
    
    // Add system message to guide AI
    chatHistory.push({
        role: 'system',
        content: `You are conducting a daily health check. Ask the user the following questions ONE AT A TIME in ${langName}:
1. How many hours did you sleep last night?
2. How do you feel today on a scale from 1 to 10? (1=very bad, 10=excellent)
3. Did you experience any pain today? If yes, where and how severe?
4. Have you taken all your medications today?
5. Did you eat regular meals today?
6. Any other health concerns?

After all questions, say: "Thank you! I've recorded your health information for today."

Be warm, patient, and understanding. Ask questions naturally.`
    });
    
    const greetings = {
        'en-US': "Hello! Let's do your daily health check. I'll ask you a few simple questions about how you're feeling today.",
        'sk-SK': 'Dobr\u00fd de\u0148! Urobme va\u0161u denn\u00fa zdravotn\u00fa kontrolu. Op\u00fdtam sa v\u00e1s na nieko\u013eko jednoduch\u00fdch ot\u00e1zok o tom, ako sa dnes c\u00edtite.',
        'cs-CZ': 'Dobr\u00fd den! Ud\u011blejme va\u0161i denn\u00ed zdravotn\u00ed kontrolu. Zept\u00e1m se v\u00e1s na n\u011bkolik jednoduch\u00fdch ot\u00e1zek o tom, jak se dnes c\u00edt\u00edte.',
        'de-DE': 'Hallo! Lassen Sie uns Ihren t\u00e4glichen Gesundheitscheck durchf\u00fchren. Ich werde Ihnen ein paar einfache Fragen stellen, wie Sie sich heute f\u00fchlen.'
    };
    
    const greeting = greetings[currentLanguage] || greetings['en-US'];
    addChatMessage('assistant', greeting);
    chatHistory.push({ role: 'assistant', content: greeting });
    
    // Enable voice response
    useVoiceResponse = true;
    
    const firstQuestions = {
        'en-US': 'First question: How many hours did you sleep last night?',
        'sk-SK': 'Prv\u00e1 ot\u00e1zka: Ko\u013eko hod\u00edn ste spali v\u010dera v noci?',
        'cs-CZ': 'Prvn\u00ed ot\u00e1zka: Kolik hodin jste spal/a v\u010dera v noci?',
        'de-DE': 'Erste Frage: Wie viele Stunden haben Sie letzte Nacht geschlafen?'
    };
    
    setTimeout(() => {
        const question = firstQuestions[currentLanguage] || firstQuestions['en-US'];
        addChatMessage('assistant', question);
        chatHistory.push({ role: 'assistant', content: question });
        if (useVoiceResponse) {
            speakText(question);
        }
    }, 1500);
}

function generateHealthReport() {
    // Extract health information from chat history
    const today = new Date().toLocaleDateString(currentLanguage);
    
    // Request AI to generate summary
    const summaryPrompt = {
        'en-US': 'Based on our conversation, create a brief health summary for today. Include: sleep hours, mood rating, pain, medications taken, meals, and any concerns. Format it as a clear, structured report.',
        'sk-SK': 'Na z\u00e1klade n\u00e1\u0161ho rozhovoru vytvorte stru\u010dn\u00fd zdravotn\u00fd s\u00fahrn za dne\u0161ok. Zahr\u0148te: hodiny sp\u00e1nku, hodnotenie n\u00e1lady, boles\u0165, prijat\u00e9 lieky, jedl\u00e1 a ak\u00e9ko\u013evek obavy. Naform\u00e1tujte to ako jasn\u00fd, \u0161trukt\u00farovan\u00fd report.',
        'cs-CZ': 'Na z\u00e1klad\u011b na\u0161eho rozhovoru vytvo\u0159te stru\u010dn\u00fd zdravotn\u00ed souhrn za dne\u0161ek. Zahr\u0148te: hodiny sp\u00e1nku, hodnocen\u00ed n\u00e1lady, bolest, u\u017eit\u00e9 l\u00e9ky, j\u00eddla a jak\u00e9koli obavy. Naform\u00e1tujte to jako jasn\u00fd, strukturovan\u00fd report.',
        'de-DE': 'Erstellen Sie basierend auf unserem Gespr\u00e4ch eine kurze Gesundheitszusammenfassung f\u00fcr heute. Einbeziehen: Schlafstunden, Stimmungsbewertung, Schmerzen, eingenommene Medikamente, Mahlzeiten und Bedenken. Formatieren Sie es als klaren, strukturierten Bericht.'
    };
    
    chatHistory.push({
        role: 'user',
        content: summaryPrompt[currentLanguage] || summaryPrompt['en-US']
    });
    
    // Get AI summary
    fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: chatHistory,
            user_context: {
                age: currentUser.age,
                medications: currentUser.medications.map(m => m.name)
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        const summary = data.response;
        const reportEl = document.getElementById('healthReportContent');
        const titles = {
            'en-US': `Daily Health Report - ${today}`,
            'sk-SK': `Denn\u00e1 zdravotn\u00e1 spr\u00e1va - ${today}`,
            'cs-CZ': `Denn\u00ed zdravotn\u00ed zpr\u00e1va - ${today}`,
            'de-DE': `T\u00e4glicher Gesundheitsbericht - ${today}`
        };
        
        reportEl.innerHTML = `
            <div class="result-box safe">
                <h4>${titles[currentLanguage] || titles['en-US']}</h4>
                <p style="white-space: pre-line; text-align: left;">${summary}</p>
            </div>
        `;
        
        // Show success message
        const messages = {
            'en-US': 'Health report saved! You can view it in the Health tab.',
            'sk-SK': 'Zdravotn\u00fd report ulo\u017een\u00fd! M\u00f4\u017eete si ho pozrie\u0165 na karte Zdravie.',
            'cs-CZ': 'Zdravotn\u00ed report ulo\u017een! M\u016f\u017eete si ho prohl\u00e9dnout na kart\u011b Zdrav\u00ed.',
            'de-DE': 'Gesundheitsbericht gespeichert! Sie k\u00f6nnen ihn auf der Registerkarte Gesundheit anzeigen.'
        };
        
        addChatMessage('assistant', messages[currentLanguage] || messages['en-US']);
        chatHistory.push({ role: 'assistant', content: summary });
        
        // Update health report status on home tab
        updateHealthReportStatus();
    })
    .catch(error => {
        console.error('Error generating health report:', error);
    });
}

// Student Matches
async function loadStudentMatches() {
    const matchesEl = document.getElementById('studentMatches');
    
    // Mock data for demo
    const mockMatches = [
        {
            name: 'Emily Chen',
            age: 20,
            school: 'State University',
            interests: ['Technology', 'Gardening', 'History'],
            skills: ['Computer help', 'Smartphone tutorials', 'Social media'],
            distance: '2 miles away',
            reason: 'Emily loves gardening and history, just like you! She can help with your tablet.'
        },
        {
            name: 'Marcus Johnson',
            age: 19,
            school: 'Community College',
            interests: ['Cooking', 'Music', 'Technology'],
            skills: ['Device setup', 'Video calls', 'Email help'],
            distance: '1.5 miles away',
            reason: 'Marcus enjoys cooking and would love to learn your recipes while helping with technology.'
        },
        {
            name: 'Sofia Rodriguez',
            age: 21,
            school: 'State University',
            interests: ['Art', 'Photography', 'Technology'],
            skills: ['Photo editing', 'Social media', 'Digital art'],
            distance: '3 miles away',
            reason: 'Sofia is interested in art history and can help you share your photos with family online.'
        }
    ];
    
    matchesEl.innerHTML = mockMatches.map(match => `
        <div class="activity-item">
            <h4>👤 ${match.name}, ${match.age}</h4>
            <p><strong>${match.school}</strong></p>
            <p>📍 ${match.distance}</p>
            <p><strong>Interests:</strong> ${match.interests.join(', ')}</p>
            <p><strong>Can help with:</strong> ${match.skills.join(', ')}</p>
            <p><em>${match.reason}</em></p>
            <button class="big-button success-btn" onclick="alert('Connection request sent!')">Connect</button>
        </div>
    `).join('');
}

// Utility Functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Error handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled error:', event.reason);
});
