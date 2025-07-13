const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Show chat
chatToggle.addEventListener('click', () => {
  chatWindow.classList.remove('hidden');
  if (chatMessages.children.length === 0) {
    appendMessage('bot', "👋 Hi there! I'm PalmView AI. How can I assist you today?");
  }
});

// Hide chat
chatClose.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

// Send message
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  chatInput.value = '';

  // Typing animation
  const typingEl = document.createElement('div');
  typingEl.classList.add('message', 'bot');
  typingEl.innerText = 'PalmView AI is typing...';
  chatMessages.appendChild(typingEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch('https://palmview-backend.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    chatMessages.removeChild(typingEl);
    appendMessage('bot', data.reply);
  } catch (err) {
    chatMessages.removeChild(typingEl);
    appendMessage('bot', "❌ Oops! Something went wrong.");
    console.error(err);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.innerText = text;

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.innerText = sender === 'user' ? '🧑' : '🤖';

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}