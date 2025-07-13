const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');

// Show chat window
chatToggle.addEventListener('click', () => {
  chatWindow.classList.remove('hidden');
});

// Hide chat window
chatClose.addEventListener('click', () => {
  chatWindow.classList.add('hidden');
});

// Handle chat form submission
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  chatInput.value = '';
  typingIndicator.classList.remove('hidden');

  try {
    const res = await fetch('https://palmview-backend.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    // Simulate delay for realism
    setTimeout(() => {
      typingIndicator.classList.add('hidden');
      appendMessage('bot', data.reply);
    }, 800); // You can adjust typing delay here
  } catch (err) {
    typingIndicator.classList.add('hidden');
    console.error(err);
    appendMessage('bot', "Oops! Something went wrong.");
  }
});

// Append message to chat
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.textContent = text;

  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}