const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');

let firstOpen = true;

// Show chat window
chatToggle.addEventListener('click', () => {
  chatWindow.classList.remove('hidden');

  if (firstOpen) {
    firstOpen = false;
    setTimeout(() => {
      appendMessage('bot', "🌴 Welcome to Palmview Retreat! I’m Ava, your virtual assistant. How may I help you today?");
    }, 500);
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
        message: message,
        systemPrompt: "You are a polite hotel receptionist named Ava for Palmview Retreat in Phuket, Thailand. Greet guests, answer questions about rooms, pricing, spa, beach activities, and politely handle any other requests. Be concise, warm, and helpful."
      })
    });

    const data = await res.json();

    setTimeout(() => {
      typingIndicator.classList.add('hidden');
      typeMessageSlowly('bot', data.reply);
    }, 500);
  } catch (err) {
    typingIndicator.classList.add('hidden');
    console.error(err);
    appendMessage('bot', "Oops! Something went wrong. Please try again.");
  }
});

// Append a message instantly
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

// Type message word-by-word
function typeMessageSlowly(sender, fullText) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);

  let index = 0;

  function typeNextWord() {
    if (index < fullText.length) {
      bubble.textContent += fullText[index];
      index++;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(typeNextWord, 20); // Speed can be adjusted here
    }
  }

  typeNextWord();
}