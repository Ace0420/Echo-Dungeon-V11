// Echo Dungeon V11 - Voice Recognition
// Speech-to-text for voice commands

let recognition = null;

function startListening() {
    if (!browserSupport.speechRecognition || !browserSupport.https) {
        speak('Voice recognition requires HTTPS and a compatible browser like Chrome or Edge.');
        return;
    }
    
    if (game.listening) { 
        stopListening(); 
        return; 
    }
    
    try {
        const Recognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognition = new Recognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            game.listening = true;
            micButton.classList.add('listening');
        };
        
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase().trim();
            displayText(`You said: "${command}"`);
            stopListening();
            setTimeout(() => processCommand(command), 500);
        };
        
        recognition.onerror = (event) => {
            stopListening();
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                speak('Voice error. Try again.');
            }
        };
        
        recognition.onend = () => stopListening();
        
        recognition.start();
    } catch (error) {
        speak('Failed to start voice recognition.');
        stopListening();
    }
}

function stopListening() {
    game.listening = false;
    micButton.classList.remove('listening');
    
    if (recognition) {
        try { 
            recognition.stop(); 
        } catch (e) {}
        recognition = null;
    }
}
