const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => {
  chatWindow.classList.remove('hidden');
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  chatInput.value = '';

  try {
    const res = await fetch('https://palmview-backend.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    appendMessage('bot', data.reply);
  } catch (err) {
    console.error(err);
    appendMessage('bot', 'Oops! Something went wrong.');
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}