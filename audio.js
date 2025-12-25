// Echo Dungeon V11 - Audio System
// Text-to-speech for blind accessibility

const micButton = document.getElementById('micButton');
const textDisplay = document.getElementById('textDisplay');

// Display text for screen readers
function displayText(text) {
    textDisplay.innerHTML = text;
}

// Speak text aloud using text-to-speech
function speak(text, callback) {
    displayText(text);
    
    if (!browserSupport.speechSynthesis) {
        if (callback) setTimeout(callback, 2000);
        return;
    }
    
    try {
        speechSynthesis.cancel();
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
            utterance.rate = 0.9;
            
            if (callback) {
                utterance.onend = callback;
                utterance.onerror = callback;
            }
            
            speechSynthesis.speak(utterance);
        }, 100);
    } catch (error) {
        if (callback) setTimeout(callback, 2000);
    }
}

// Speak a sequence of messages one after another
function speakSequence(messages, callback) {
    if (messages.length === 0) {
        if (callback) callback();
        return;
    }
    
    const [first, ...rest] = messages;
    speak(first, () => {
        if (rest.length > 0) {
            setTimeout(() => speakSequence(rest, callback), 500);
        } else if (callback) {
            callback();
        }
    });
}
