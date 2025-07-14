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
  appendMessage('bot', "🌴 Welcome to PalmView Retreat! I’m Ava, your virtual assistant. How may I help you today?");
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
    const reply = data.reply;

    setTimeout(() => {
      typingIndicator.classList.add('hidden');
      typeReply(reply);
    }, 600);
  } catch (err) {
    typingIndicator.classList.add('hidden');
    appendMessage('bot', "Oops! Something went wrong.");
  }
});

// Append messages
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

// Typing effect
function typeReply(text) {
  const msg = document.createElement('div');
  msg.classList.add('message', 'bot');

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);

  let i = 0;
  const typing = setInterval(() => {
    bubble.textContent += text.charAt(i);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    i++;
    if (i >= text.length) clearInterval(typing);
  }, 30);
}