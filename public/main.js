
const chatBox = document.getElementById('chat');
const status = document.getElementById('status');

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = `${role === 'user' ? 'You' : 'Jailbreak'}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(message) {
  appendMessage('user', message);

  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  appendMessage('bot', data.reply);

  if (data.voiceStreamUrl) {
    const audio = new Audio(data.voiceStreamUrl);
    audio.play();
  }

  listen(); // Restart listening after response
}

function listen() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;

  status.textContent = '🎤 Listening...';

  recognition.onresult = (event) => {
    const voiceInput = event.results[0][0].transcript;
    status.textContent = '✅ Got it, replying...';
    sendMessage(voiceInput);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    status.textContent = '⚠️ Error: ' + event.error;
    setTimeout(() => listen(), 3000);
  };

  recognition.onend = () => {
    status.textContent = '🎤 Ready when you are...';
  };

  recognition.start();
}

window.addEventListener('load', () => {
  listen();
});
