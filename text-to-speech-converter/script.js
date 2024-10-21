const apiUrl = 'https://xz6u7sbqqd.execute-api.us-east-2.amazonaws.com/dev/TTS'; // replace with your API endpoint

const charCountElement = document.getElementById('charCount');
const textInputElement = document.getElementById('textInput');
const convertButton = document.getElementById('convertButton');
const loadingMessage = document.getElementById('loadingMessage');
const audioOutputElement = document.getElementById('audioOutput');
const downloadButton = document.getElementById('downloadButton');
const loginButton = document.getElementById('loginButton');
const authErrorMessage = document.getElementById('authErrorMessage');
const authSuccessMessage = document.getElementById('authSuccessMessage');
const authContainer = document.getElementById('authContainer');
const ttsContainer = document.getElementById('ttsContainer');
const stopButton = document.getElementById('stopButton');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const historyList = document.getElementById('historyList');
const modal = document.getElementById('myModal');
const modalMessage = document.getElementById('modalMessage');
const modalClose = document.getElementById('modalClose');

textInputElement.addEventListener('input', updateCharCount);
convertButton.addEventListener('click', convertToSpeech);
loginButton.addEventListener('click', login);

function updateCharCount() {
    const maxChars = 500;
    const remaining = maxChars - textInputElement.value.length;
    charCountElement.textContent = `${remaining} characters remaining`;
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                authSuccessMessage.textContent = result.message;
                authErrorMessage.textContent = '';
                ttsContainer.style.display = 'block';
                authContainer.style.display = 'none';
            } else {
                authErrorMessage.textContent = result.message;
                authSuccessMessage.textContent = '';
            }
        } catch (error) {
            authErrorMessage.textContent = 'Error logging in. Please try again.';
            authSuccessMessage.textContent = '';
        }
    } else {
        authErrorMessage.textContent = 'Please enter both username and password.';
    }
}

async function convertToSpeech() {
    const text = textInputElement.value.trim();
    const language = document.getElementById('languageSelect').value;
    const voice = document.getElementById('voiceSelect').value;
    const rate = document.getElementById('rateRange').value;
    const pitch = document.getElementById('pitchRange').value;
    const volume = document.getElementById('volumeRange').value;
    const format = document.getElementById('audioFormatSelect').value;

    if (text) {
        loadingMessage.style.display = 'block';
        try {
            const response = await fetch(`${apiUrl}/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, language, voice, rate, pitch, volume, format })
            });

            const result = await response.json();

            if (response.ok) {
                loadingMessage.style.display = 'none';
                const audioUrl = result.audioUrl;
                audioOutputElement.src = audioUrl;
                audioOutputElement.style.display = 'block';
                downloadButton.href = audioUrl;
                downloadButton.style.display = 'inline-block';
            } else {
                showModal(result.message);
            }
        } catch (error) {
            showModal('Error converting text to speech. Please try again.');
        } finally {
            loadingMessage.style.display = 'none';
        }
    } else {
        showModal('Please enter some text to convert.');
    }
}

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const textInput = document.getElementById('textInput');
    const languageSelect = document.getElementById('languageSelect');
    const voiceSelect = document.getElementById('voiceSelect');
    const previewButton = document.getElementById('previewButton');
    const convertButton = document.getElementById('convertButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const loadingMessage = document.getElementById('loadingMessage');
    const history = document.getElementById('history');
    const charCount = document.getElementById('charCount');
    const downloadButton = document.getElementById('downloadButton');
    const progressBar = document.getElementById('progressBar');
    const pitchRange = document.getElementById('pitchRange');
    const volumeRange = document.getElementById('volumeRange');
    const rateRange = document.getElementById('rateRange');
    const stopButton = document.getElementById('stopButton');
    const loginButton = document.getElementById('loginButton');
    const authContainer = document.getElementById('authContainer');
    const ttsContainer = document.getElementById('ttsContainer');
    let voices = [];
    let isSpeaking = false;

    // Load voices
    function loadVoices() {
        voices = speechSynthesis.getVoices();
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
        // Set a default voice if available
        if (voices.length > 0) {
            voiceSelect.value = voices[0].name;
        }
    }

    // Handle voice selection
    voiceSelect.addEventListener('change', function() {
        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
        document.getElementById('voiceDescription').textContent = selectedVoice ? `Selected voice: ${selectedVoice.name}` : '';
    });

    // Preview voice
    previewButton.addEventListener('click', function() {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        utterance.voice = voices.find(voice => voice.name === voiceSelect.value);
        utterance.rate = parseFloat(rateRange.value);
        utterance.pitch = parseFloat(pitchRange.value);
        utterance.volume = parseFloat(volumeRange.value);

        speechSynthesis.speak(utterance);
    });

    // Convert text to speech
    convertButton.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) {
            alert('Please enter some text to convert.');
            return;
        }

        loadingMessage.style.display = 'block';
        progressBar.style.width = '0';
        isSpeaking = true;

        const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.pitch = parseFloat(pitchRange.value);
        utterance.volume = parseFloat(volumeRange.value);
        utterance.rate = parseFloat(rateRange.value);

        utterance.onstart = () => {
            loadingMessage.style.display = 'none';
            stopButton.style.display = 'inline';
            audioPlayer.style.display = 'none'; // Hide player during conversion
        };

        utterance.onend = async () => {
            loadingMessage.style.display = 'none';
            stopButton.style.display = 'none';
            isSpeaking = false;

            // Generate and download audio
            const audioBlob = await generateAudioBlob(text, selectedVoice, pitchRange.value, volumeRange.value, rateRange.value);
            if (audioBlob) {
                audioPlayer.src = URL.createObjectURL(audioBlob);
                audioPlayer.style.display = 'block'; // Show player
                downloadButton.style.display = 'inline'; // Show download button
            } else {
                alert('Failed to generate audio.');
            }
        };

        try {
            speechSynthesis.speak(utterance);
        } catch (error) {
            loadingMessage.style.display = 'none';
            alert('An error occurred while processing your request. Please try again.');
        }
    });

    // Stop speaking functionality
    stopButton.addEventListener('click', () => {
        speechSynthesis.cancel();
        stopButton.style.display = 'none';
        isSpeaking = false;
    });

    // Update character count
    textInput.addEventListener('input', function() {
        const remaining = 500 - textInput.value.length;
        charCount.textContent = `${remaining} characters remaining`;
    });

    // Load voices when available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    } else {
        loadVoices();
    }

    // Function to download audio
    downloadButton.addEventListener('click', () => {
        if (!audioPlayer.src) {
            alert('No audio available to download.');
            return;
        }
        const link = document.createElement('a');
        link.href = audioPlayer.src;
        link.download = 'audio_output.mp3'; // Change the file format if necessary
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Function to generate audio blob (replace with actual API call)
    async function generateAudioBlob(text, voice, pitch, volume, rate) {
        // Replace with actual audio generation logic. This is a placeholder.
        return new Blob([text], { type: 'audio/mp3' }); // Simulating an audio blob
    }

    // Login functionality
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch('https://xz6u7sbqqd.execute-api.us-east-2.amazonaws.com/dev/TTS/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (data.success) {
                showMessage('Login successful!', 'success');
                authContainer.style.display = 'none';
                ttsContainer.style.display = 'block';
            } else {
                showMessage(data.message || 'Invalid username or password.', 'error');
            }
        } catch (error) {
            showMessage('An error occurred. Please try again later.', 'error');
        }
    });

    function showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer'); // Assuming you have a message container
        messageContainer.textContent = message;
        messageContainer.className = type; // Set class based on type (success/error)
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }
});

