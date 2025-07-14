const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');

// Show chat window with greeting
chatToggle.addEventListener('click', () => {
  chatWindow.classList.remove('hidden');
  if (!chatMessages.innerHTML.includes("PalmBot")) {
    appendMessage('bot', "🌴 Welcome to Palmview Retreat! I’m Ava, your virtual assistant. How may I help you today?");
  }
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
      body: JSON.stringify({
        message,
        systemPrompt: "You are a polite hotel receptionist for Palmview Retreat. Greet guests, answer questions about amenities, availability, and pricing. Suggest activities. Be charming and concise."
      }),
    });

    const data = await res.json();
    const reply = data.reply;

    typingIndicator.classList.add('hidden');
    typeMessage('bot', reply);
  } catch (err) {
    typingIndicator.classList.add('hidden');
    console.error(err);
    appendMessage('bot', "Oops! Something went wrong.");
  }
});

// Append message to chat instantly
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

// Type message letter by letter
function typeMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  let i = 0;
  const typingSpeed = 20;

  function type() {
    if (i < text.length) {
      bubble.textContent += text.charAt(ihttps://github.com/AJ-Bus/Palmview-Retreat-Demo/commit/ddcf0d1a491d1800a28b511ac87e527a8b1ef6cd);
      i++;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(type, typingSpeed);
    }
  }

  type();
}
