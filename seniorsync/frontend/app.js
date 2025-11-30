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
let lastHealthCheckDate = null;
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
    loadNews();
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
    const confirmMessages = {
        'en-US': 'Send emergency alert to your family contacts?',
        'sk-SK': 'Odoslať núdzovú výzvu vašim rodinným kontaktom?',
        'cs-CZ': 'Odeslat nouzovou výzvu vašim rodinným kontaktům?',
        'de-DE': 'Notruf an Ihre Familienkontakte senden?'
    };
    
    if (!confirm(confirmMessages[currentLanguage] || confirmMessages['en-US'])) {
        return;
    }
    
    try {
        // Send Telegram alert (new method)
        const telegramAlertData = {
            alert_type: 'emergency',
            message: 'Emergency button pressed by user',
            health_data: healthCheckData,
            user_name: currentUser.name,
            language: currentLanguage
        };
        
        await sendTelegramAlert(telegramAlertData);
        
        // Also try old emergency endpoint (for SMS if Twilio configured)
        try {
            await fetch(`${API_BASE_URL}/emergency/alert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_name: currentUser.name,
                    contacts: [
                        { name: 'Family Contact', phone: '+1234567890', relationship: 'family' }
                    ],
                    location: 'Home'
                })
            });
        } catch (e) {
            // Ignore SMS errors
        }
        
        const successMessages = {
            'en-US': '✅ Emergency alert sent to your family!',
            'sk-SK': '✅ Núdzová výzva odoslaná vašej rodine!',
            'cs-CZ': '✅ Nouzová výzva odeslána vaší rodině!',
            'de-DE': '✅ Notruf an Ihre Familie gesendet!'
        };
        
        alert(successMessages[currentLanguage] || successMessages['en-US']);
    } catch (error) {
        const errorMessages = {
            'en-US': '⚠️ Emergency alert may not have been sent. Please contact family directly.',
            'sk-SK': '⚠️ Núdzová výzva možno nebola odoslaná. Prosím kontaktujte rodinu priamo.',
            'cs-CZ': '⚠️ Nouzová výzva možná nebyla odeslána. Prosím kontaktujte rodinu přímo.',
            'de-DE': '⚠️ Notruf wurde möglicherweise nicht gesendet. Bitte kontaktieren Sie die Familie direkt.'
        };
        
        alert(errorMessages[currentLanguage] || errorMessages['en-US']);
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
    const btnEl = document.getElementById('startHealthCheckBtn');
    
    if (!btnEl) return;
    
    const today = new Date().toDateString();
    const completedToday = (lastHealthCheckDate === today) && reportEl && reportEl.innerHTML.trim() !== '';
    
    if (completedToday) {
        // Report completed today - show View Report
        btnEl.textContent = t('viewTodaysReport') || t('startHealthCheckBtn');
        btnEl.onclick = () => {
            // Just scroll to show the report, don't restart
            reportEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
    } else {
        // No report yet or new day - allow starting
        btnEl.textContent = t('startHealthCheckBtn');
        btnEl.onclick = startHealthCheck;
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
                // Check for emergency commands
                const emergencyPatterns = [
                    /\b(emergency|help|need help|urgent)\b/i,
                    /\b(pomoc|núdzová situácia)\b/i,  // Slovak
                    /\b(nouzové|potřebuji pomoc)\b/i,  // Czech
                    /\b(notfall|hilfe|ich brauche hilfe)\b/i  // German
                ];
                
                let isEmergency = false;
                for (const pattern of emergencyPatterns) {
                    if (pattern.test(transcriptLower)) {
                        isEmergency = true;
                        break;
                    }
                }
                
                if (isEmergency) {
                    // Send emergency alert
                    const emergencyMessages = {
                        'en-US': 'Emergency help requested via voice command',
                        'sk-SK': 'Pomoc požadovaná hlasovým príkazom',
                        'cs-CZ': 'Pomoc požadována hlasovým příkazem',
                        'de-DE': 'Notfallhilfe per Sprachbefehl angefordert'
                    };
                    
                    sendTelegramAlert({
                        alert_type: 'emergency',
                        message: emergencyMessages[currentLanguage] || emergencyMessages['en-US'],
                        health_data: healthCheckData
                    });
                    
                    // Show confirmation
                    const confirmations = {
                        'en-US': 'Emergency alert sent! Help is being notified.',
                        'sk-SK': 'Pomoc bola zavolaná! Oznámenie bolo odoslané.',
                        'cs-CZ': 'Nüzová výzva odeslána! Pomoc byla informována.',
                        'de-DE': 'Notruf gesendet! Hilfe wird benachrichtigt.'
                    };
                    
                    addChatMessage('assistant', confirmations[currentLanguage] || confirmations['en-US']);
                    updateVoiceStatus('');
                    return;
                }
                
                // Check for news keyword commands
                const newsPatterns = [
                    /news about (.+)/i,
                    /správy o (.+)/i,  // Slovak
                    /zprávy o (.+)/i,  // Czech
                    /nachrichten über (.+)/i  // German
                ];
                
                let newsKeywordFound = false;
                for (const pattern of newsPatterns) {
                    const match = transcript.match(pattern);
                    if (match && newsKeywords.length > 0) {
                        const spokenKeyword = match[1].toLowerCase().trim();
                        
                        // Find closest matching keyword
                        const matchedKeyword = newsKeywords.find(kw => 
                            kw.toLowerCase().includes(spokenKeyword) || 
                            spokenKeyword.includes(kw.toLowerCase())
                        );
                        
                        if (matchedKeyword) {
                            // Switch to social tab and select keyword
                            showTab('connections');
                            selectNewsKeyword(matchedKeyword);
                            updateVoiceStatus('');
                            newsKeywordFound = true;
                            break;
                        }
                    }
                }
                
                if (!newsKeywordFound) {
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
        
        // Check if health check is complete (check for completion phrases in all languages)
        const completionPhrases = [
            'recorded your health information',
            'zaznamenal som vaše zdravotné informácie',
            'zaznamenal jsem vaše zdravotní informace',
            'ihre gesundheitsinformationen aufgezeichnet',
            'dennú zdravotnú kontrolu',
            'denní zdravotní kontrolu',
            'gesundheitscheck'
        ];
        
                const isComplete = completionPhrases.some(phrase => 
            aiResponse.toLowerCase().includes(phrase.toLowerCase())
        );
        
        if (healthCheckActive && isComplete) {
            healthCheckActive = false;
            
            // Extract health data from conversation
            extractHealthDataFromChat();
            
            generateHealthReport();
        }        // Speak the response only if user used voice input
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
// ==========================================
// News Functions
// ==========================================

let newsArticles = [];
let newsKeywords = [];
let selectedKeyword = null;

async function loadNews() {
    const newsSection = document.getElementById('newsSection');
    if (!newsSection) return;
    
    newsSection.innerHTML = '<p class="loading">' + t('loadingNews') + '</p>';
    
    // Map current language to country code
    const languageToCountry = {
        'en-US': 'us',
        'sk-SK': 'sk',
        'cs-CZ': 'cz',
        'de-DE': 'de'
    };
    
    const country = languageToCountry[currentLanguage] || 'us';
    const languageCode = currentLanguage.split('-')[0];
    
    try {
        const response = await fetch(`${API_BASE_URL}/news/news?country=${country}&language=${languageCode}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        newsArticles = data.articles;
        
        // Extract keywords from articles
        extractNewsKeywords();
        displayNewsKeywords();
    } catch (error) {
        console.error('Error loading news:', error);
        newsSection.innerHTML = '<p>Unable to load news at this time.</p>';
    }
}

function extractNewsKeywords() {
    const keywordMap = new Map();
    
    // Common stop words to filter out
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'has', 'have', 'been', 'will', 'would', 'could', 'should']);
    
    newsArticles.forEach(article => {
        const text = (article.title + ' ' + (article.description || '')).toLowerCase();
        const words = text.match(/\b[a-z]{4,}\b/g) || [];
        
        words.forEach(word => {
            if (!stopWords.has(word)) {
                keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
            }
        });
    });
    
    // Sort by frequency and take top keywords
    newsKeywords = Array.from(keywordMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(entry => entry[0]);
}

function displayNewsKeywords() {
    const newsSection = document.getElementById('newsSection');
    
    if (newsKeywords.length === 0) {
        newsSection.innerHTML = '<p>No news available at this time.</p>';
        return;
    }
    
    const translations = {
        'en-US': { selectTopic: 'Select a topic to see related news:', voiceCmd: 'Say "news about [topic]" or click a topic' },
        'sk-SK': { selectTopic: 'Vyberte tému pre zobrazenie súvisiacich správ:', voiceCmd: 'Povedzte "správy o [téma]" alebo kliknite na tému' },
        'cs-CZ': { selectTopic: 'Vyberte téma pro zobrazení souvisejících zpráv:', voiceCmd: 'Řekněte "zprávy o [téma]" nebo klikněte na téma' },
        'de-DE': { selectTopic: 'Wählen Sie ein Thema, um verwandte Nachrichten zu sehen:', voiceCmd: 'Sagen Sie "Nachrichten über [Thema]" oder klicken Sie auf ein Thema' }
    };
    
    const t = translations[currentLanguage] || translations['en-US'];
    
    newsSection.innerHTML = `
        <div style="margin-bottom: 20px;">
            <p style="color: rgba(255,255,255,0.9); font-size: 1.1em; margin-bottom: 10px;">${t.selectTopic}</p>
            <p style="color: rgba(255,255,255,0.6); font-size: 0.9em; margin-bottom: 15px;">🎤 ${t.voiceCmd}</p>
            <div class="keyword-container" style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${newsKeywords.map(keyword => `
                    <button class="keyword-btn" onclick="selectNewsKeyword('${keyword}')" style="
                        padding: 10px 20px;
                        background: rgba(74, 144, 226, 0.2);
                        border: 2px solid #4A90E2;
                        border-radius: 25px;
                        color: #fff;
                        font-size: 1em;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">${keyword}</button>
                `).join('')}
            </div>
        </div>
        <div id="selectedNewsArticles"></div>
    `;
}

function selectNewsKeyword(keyword) {
    selectedKeyword = keyword;
    
    // Filter articles containing the keyword
    const filteredArticles = newsArticles.filter(article => {
        const text = (article.title + ' ' + (article.description || '')).toLowerCase();
        return text.includes(keyword.toLowerCase());
    });
    
    displayFilteredNews(filteredArticles, keyword);
}

function displayFilteredNews(articles, keyword) {
    const articlesEl = document.getElementById('selectedNewsArticles');
    
    if (!articles || articles.length === 0) {
        articlesEl.innerHTML = `<p style="color: rgba(255,255,255,0.7);">No articles found for "${keyword}"</p>`;
        return;
    }
    
    articlesEl.innerHTML = `
        <h4 style="color: #4A90E2; margin: 20px 0 15px 0; font-size: 1.2em;">📰 News about "${keyword}" (${articles.length})</h4>
        ${articles.map(article => `
            <div class="news-item" style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 3px solid #4A90E2;">
                ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">` : ''}
                <h4 style="margin: 10px 0; font-size: 1.1em; color: #fff;">${article.title}</h4>
                ${article.description ? `<p style="color: rgba(255,255,255,0.8); margin: 10px 0;">${article.description}</p>` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="color: rgba(255,255,255,0.6); font-size: 0.9em;">${article.source}</span>
                    <a href="${article.url}" target="_blank" class="big-button primary-btn" style="padding: 8px 15px; font-size: 0.9em;">${t('readMore')}</a>
                </div>
            </div>
        `).join('')}
    `;
}

// ==========================================
// Activities Functions
// ==========================================

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
    // Check if already completed today
    const today = new Date().toDateString();
    if (lastHealthCheckDate === today) {
        // Just show the report
        showTab('health');
        return;
    }
    
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

After all questions, say one of these completion messages based on the language:
- English: "Thank you! I've recorded your health information for today."
- Slovak: "Ďakujem! Zaznamenal som vaše zdravotné informácie za dnes."
- Czech: "Děkuji! Zaznamenal jsem vaše zdravotní informace za dnes."
- German: "Danke! Ich habe Ihre Gesundheitsinformationen für heute aufgezeichnet."

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

function extractHealthDataFromChat() {
    // Parse recent chat messages to extract health information
    // Get both user messages and AI questions for context
    const recentConversation = chatHistory.slice(-12);
    
    // Track the last question asked to match answers
    let lastSleepQuestion = false;
    let lastRatingQuestion = false;
    let lastMedicationQuestion = false;
    let lastMealQuestion = false;
    let lastPainQuestion = false;
    
    recentConversation.forEach((entry, index) => {
        const msg = entry.content.toLowerCase();
        
        // Check if AI asked about sleep
        if (entry.role === 'assistant' && (msg.includes('sleep') || msg.includes('spali') || msg.includes('spal') || msg.includes('geschlafen'))) {
            lastSleepQuestion = true;
            lastRatingQuestion = false;
        }
        
        // Check if AI asked about mood/health rating
        if (entry.role === 'assistant' && (msg.includes('feel') || msg.includes('scale') || msg.includes('cítite') || msg.includes('cítíte') || msg.includes('fühlen') || msg.includes('rating'))) {
            lastRatingQuestion = true;
            lastSleepQuestion = false;
        }
        
        // Check if AI asked about medications
        if (entry.role === 'assistant' && (msg.includes('medic') || msg.includes('liek') || msg.includes('lék'))) {
            lastMedicationQuestion = true;
        }
        
        // Check if AI asked about meals
        if (entry.role === 'assistant' && (msg.includes('meal') || msg.includes('eat') || msg.includes('jedl') || msg.includes('essen') || msg.includes('jídl'))) {
            lastMealQuestion = true;
        }
        
        // Check if AI asked about pain
        if (entry.role === 'assistant' && (msg.includes('pain') || msg.includes('boles') || msg.includes('schmerz'))) {
            lastPainQuestion = true;
        }
        
        // Process user responses
        if (entry.role === 'user') {
            // Extract sleep hours - only if sleep was asked OR keyword present
            const sleepMatch = msg.match(/(\d+)\s*(hour|hodín|hodin|stunden)/i);
            if (sleepMatch && sleepMatch[1] && !healthCheckData.sleep) {
                const hours = parseInt(sleepMatch[1]);
                // Only accept reasonable sleep values (0-24 hours)
                if (hours >= 0 && hours <= 24) {
                    healthCheckData.sleep = sleepMatch[1];
                    console.log('✅ Captured sleep hours (with keyword):', sleepMatch[1]);
                    lastSleepQuestion = false;
                }
            } else if (lastSleepQuestion && !healthCheckData.sleep) {
                // If sleep was just asked and no "hour" keyword, look for standalone number
                const numMatch = msg.match(/\b(\d+)\b/);
                if (numMatch) {
                    const hours = parseInt(numMatch[1]);
                    if (hours >= 0 && hours <= 24) {
                        healthCheckData.sleep = numMatch[1];
                        console.log('✅ Captured sleep hours (standalone):', numMatch[1]);
                        lastSleepQuestion = false;
                    }
                }
            }
            
            // Extract health rating - only if rating was asked OR specific format
            const ratingMatch = msg.match(/\b(\d+)\s*\/\s*10\b|\b(\d+)\s*(out of|z)\s*10\b/i);
            if (ratingMatch) {
                healthCheckData.health_rating = ratingMatch[1] || ratingMatch[2];
                lastRatingQuestion = false;
            } else if (lastRatingQuestion && !healthCheckData.health_rating) {
                // Look for standalone number between 1-10 only if rating was just asked
                const simpleRating = msg.match(/\b([1-9]|10)\b/);
                if (simpleRating) {
                    healthCheckData.health_rating = simpleRating[1];
                    lastRatingQuestion = false;
                }
            }
            
            // Extract pain info - either contains keyword OR follows pain question
            if (msg.includes('pain') || msg.includes('boles') || msg.includes('schmerz') || lastPainQuestion) {
                healthCheckData.pain = entry.content;  // Store original case
                lastPainQuestion = false;  // Reset flag
            }
            
            // Extract medication status - either contains keyword OR follows medication question
            const hasMedicKeyword = msg.includes('medic') || msg.includes('liek') || msg.includes('lék');
            const hasYes = msg.includes('yes') || msg.includes('áno') || msg.includes('ano') || msg.includes('ja');
            const hasNo = msg.includes('no') || msg.includes('nie') || msg.includes('ne') || msg.includes('nein');
            
            if (hasMedicKeyword || lastMedicationQuestion) {
                if (hasYes) {
                    healthCheckData.medications = 'Yes, taken';
                    lastMedicationQuestion = false;  // Reset flag
                } else if (hasNo) {
                    healthCheckData.medications = 'No, not taken';
                    lastMedicationQuestion = false;  // Reset flag
                }
            }
            
            // Extract meal status - either contains keyword OR follows meal question
            const hasMealKeyword = msg.includes('meal') || msg.includes('eat') || msg.includes('jedl') || msg.includes('essen') || msg.includes('jídl');
            
            if (hasMealKeyword || lastMealQuestion) {
                if (hasYes) {
                    healthCheckData.meals = 'Yes, regular meals';
                    lastMealQuestion = false;  // Reset flag
                } else if (hasNo) {
                    healthCheckData.meals = 'No, skipped meals';
                    lastMealQuestion = false;  // Reset flag
                }
            }
        }
    });
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
        
        // Save report to database and check concerns
        saveHealthReportToDatabase(summary);
        
        // Update health report status on home tab
        updateHealthReportStatus();
    })
    .catch(error => {
        console.error('Error generating health report:', error);
    });
}

async function saveHealthReportToDatabase(summary) {
    try {
        console.log('=== Health check data before parsing ===');
        console.log('healthCheckData.sleep:', healthCheckData.sleep);
        console.log('healthCheckData.health_rating:', healthCheckData.health_rating);
        console.log('Full healthCheckData:', healthCheckData);
        console.log('Summary:', summary);
        
        // Parse sleep hours properly - extract number from response, default to 0 if not found
        let sleepHours = 0;
        if (healthCheckData.sleep) {
            const sleepMatch = healthCheckData.sleep.toString().match(/(\d+)/);
            if (sleepMatch) {
                sleepHours = parseInt(sleepMatch[1]);
                console.log('✅ Parsed sleepHours:', sleepHours);
            } else {
                console.log('⚠️ Could not parse sleep hours from:', healthCheckData.sleep);
            }
        } else {
            console.log('❌ healthCheckData.sleep is empty or undefined');
        }

        // Parse mood rating - extract number, default to 0 if not found
        let moodRating = 0;
        if (healthCheckData.health_rating) {
            const ratingMatch = healthCheckData.health_rating.toString().match(/(\d+)/);
            if (ratingMatch) {
                moodRating = parseInt(ratingMatch[1]);
                console.log('✅ Parsed moodRating:', moodRating);
            }
        }
        
        // Parse pain severity from pain description
        let painSeverity = 0;
        const painStr = (healthCheckData.pain || '').toLowerCase();
        if (painStr.includes('severe') || painStr.includes('7') || painStr.includes('8') || painStr.includes('9') || painStr.includes('10')) {
            painSeverity = 8;
        } else if (painStr.includes('moderate') || painStr.includes('5') || painStr.includes('6')) {
            painSeverity = 5;
        } else if (painStr.includes('mild') || painStr.includes('3') || painStr.includes('4')) {
            painSeverity = 3;
        } else if (painStr !== 'no' && painStr !== 'none' && painStr.length > 0) {
            painSeverity = 1;
        }
        
        // Handle medicationsTaken - check if the field exists and has content
        let medicationsTaken = "No";
        const medsData = healthCheckData.medications;
        if (medsData && typeof medsData === 'string') {
            const medsStr = medsData.toLowerCase();
            if (medsStr.includes('yes') || medsStr.includes('taken') || medsStr.includes('áno') || medsStr.includes('ano') || medsStr.includes('ja')) {
                medicationsTaken = "Yes";
            }
        }
        
        // Handle meals - check if the field exists and has content
        let meals = "Yes";
        const mealsData = healthCheckData.meals;
        if (mealsData && typeof mealsData === 'string') {
            const mealsStr = mealsData.toLowerCase();
            if (mealsStr.includes('no') || mealsStr.includes('skipped') || mealsStr.includes('nie') || mealsStr.includes('ne') || mealsStr.includes('nein')) {
                meals = "No";
            }
        }
        
        // Handle healthConcerns - check if summary exists and has concerning content
        let healthConcerns = "Yes";
        if (summary && typeof summary === 'string' && summary.length > 0) {
            const summaryLower = summary.toLowerCase();
            const concernKeywords = ['concern', 'worried', 'problem', 'issue', 'severe', 'obava', 'problém', 'sorge', 'poor', 'bad'];
            if (concernKeywords.some(keyword => summaryLower.includes(keyword))) {
                healthConcerns = "No";
            }
        }
        
        const reportData = {
            userId: 1,
            sleepHours: sleepHours,
            moodRating: moodRating,
            pain: healthCheckData.pain && healthCheckData.pain.toLowerCase() !== 'no' && healthCheckData.pain.toLowerCase() !== 'none' ? "No" : "Yes",
            painSeverity: painSeverity,
            medicationsTaken: medicationsTaken,
            meals: meals,
            healthConcerns: healthConcerns
        };
        
        console.log('Saving health report to database:', reportData);
        
        // Check for health concerns and send alert if needed (using parsed data)
        await checkHealthConcerns(reportData);
        
        const response = await fetch(`${API_BASE_URL}/eldercare/send-report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Health report saved to database successfully');
        } else {
            console.warn('⚠️ Failed to save health report to database:', result.message);
        }
    } catch (error) {
        console.error('Error saving health report to database:', error);
    }
}

async function checkHealthConcerns(reportData) {
    let concerns = [];
    let concernDetails = {};
    
    // Check sleep (using parsed sleepHours)
    if (reportData.sleepHours !== undefined) {
        const sleep = reportData.sleepHours;
        if (sleep < 4) {
            concerns.push('Very low sleep hours');
            concernDetails.sleepHours = sleep + ' hours (too low)';
        } else if (sleep > 12) {
            concerns.push('Excessive sleep hours');
            concernDetails.sleepHours = sleep + ' hours (excessive)';
        } else {
            concernDetails.sleepHours = sleep + ' hours';
        }
    }
    
    // Check health rating (using parsed moodRating)
    if (reportData.moodRating !== undefined) {
        const rating = reportData.moodRating;
        if (rating < 4) {
            concerns.push('Poor health rating');
            concernDetails.moodRating = rating + '/10';
        } else {
            concernDetails.moodRating = rating + '/10';
        }
    }
    
    // Check pain (using parsed pain and painSeverity)
    if (reportData.pain === "Yes") {
        if (reportData.painSeverity >= 7) {
            concerns.push('Severe pain reported');
            concernDetails.pain = 'Yes (severity: ' + reportData.painSeverity + '/10)';
        } else {
            concernDetails.pain = 'Yes (severity: ' + reportData.painSeverity + '/10)';
        }
    } else {
        concernDetails.pain = 'No';
    }
    
    // Check medications (using parsed medicationsTaken)
    if (reportData.medicationsTaken === "No") {
        concerns.push('Medications not taken');
        concernDetails.medicationsTaken = 'No';
    } else {
        concernDetails.medicationsTaken = 'Yes';
    }
    
    // Check meals (using parsed meals)
    if (reportData.meals === "No") {
        concerns.push('Meals skipped');
        concernDetails.meals = 'No';
    } else {
        concernDetails.meals = 'Yes';
    }
    
    // Check health concerns (using parsed healthConcerns)
    if (reportData.healthConcerns === "Yes") {
        concerns.push('Health concerns reported');
        concernDetails.healthConcerns = 'Yes';
    } else {
        concernDetails.healthConcerns = 'No';
    }
    
    // Send alert if there are concerns
    if (concerns.length > 0) {
        await sendTelegramAlert({
            alert_type: 'health_concern',
            message: 'Health check revealed concerning conditions: ' + concerns.join(', '),
            health_data: concernDetails
        });
    }
}

async function sendTelegramAlert(alertData) {
    try {
        const response = await fetch(`${API_BASE_URL}/telegram/alert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertData)
        });
        
        if (response.ok) {
            console.log('Emergency alert sent to Telegram');
        } else {
            console.error('Failed to send Telegram alert:', await response.text());
        }
    } catch (error) {
        console.error('Error sending Telegram alert:', error);
    }
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
