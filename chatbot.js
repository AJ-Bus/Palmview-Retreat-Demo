const chatToggle = document.getElementById("chat-toggle");
const chatWindow = document.getElementById("chat-window");
const chatClose = document.getElementById("chat-close");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

chatToggle.addEventListener("click", () => {
  chatWindow.classList.toggle("hidden");
  chatInput.focus();
});

chatClose.addEventListener("click", () => {
  chatWindow.classList.add("hidden");
});

// Chatbot responses and simple booking state
let bookingState = null;
let bookingData = {};

const faq = [
  {
    question: /rooms|room types|what rooms/i,
    answer: `We offer Deluxe Room ($60/night), Family Suite ($85/night), and Garden Bungalow ($75/night).`
  },
  {
    question: /deluxe room/i,
    answer: `The Deluxe Room has a king bed, private balcony, and a beautiful garden view.`
  },
  {
    question: /family suite/i,
    answer: `The Family Suite features two bedrooms, a kitchen, and a relaxing pool view.`
  },
  {
    question: /garden bungalow/i,
    answer: `The Garden Bungalow offers a queen bed, garden patio, and a bathtub for ultimate comfort.`
  },
  {
    question: /check-?in/i,
    answer: `Check-in time is 2:00 PM.`
  },
  {
    question: /check-?out/i,
    answer: `Check-out time is 11:00 AM.`
  },
  {
    question: /cancellation/i,
    answer: `You can cancel free of charge up to 48 hours before your arrival.`
  },
  {
    question: /pets/i,
    answer: `Sorry, pets are not allowed at our hotel.`
  },
  {
    question: /amenities|services/i,
    answer: `We offer a swimming pool, spa & massage, fitness center, garden lounge, free parking, complimentary breakfast, airport pickup, room service, and laundry services.`
  },
  {
    question: /price|cost/i,
    answer: `Room prices start at $60 per night.`
  },
  {
    question: /contact|phone|email|whatsapp/i,
    answer: `You can contact us by phone or WhatsApp at +66 912 345 678, or email bookings@palmviewretreat.com.`
  },
  {
    question: /book|reservation|reserve/i,
    answer: `Great! Let's start your booking. What's your full name?`,
    action: "startBooking"
  },
];

function botReply(message) {
  const div = document.createElement("div");
  div.classList.add("message", "bot");
  div.textContent = message;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function userReply(message) {
  const div = document.createElement("div");
  div.classList.add("message", "user");
  div.textContent = message;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Booking flow handler
function handleBooking(input) {
  if (!bookingData.name) {
    bookingData.name = input;
    botReply(`Thanks, ${bookingData.name}! What is your check-in date? (e.g., 2025-08-01)`);
  } else if (!bookingData.checkin) {
    bookingData.checkin = input;
    botReply(`Got it. What is your check-out date? (e.g., 2025-08-05)`);
  } else if (!bookingData.checkout) {
    bookingData.checkout = input;
    botReply(`Which room would you like to book? (Deluxe Room, Family Suite, Garden Bungalow)`);
  } else if (!bookingData.room) {
    const roomInput = input.toLowerCase();
    if (["deluxe room", "family suite", "garden bungalow"].includes(roomInput)) {
      bookingData.room = input;
      botReply(`Thanks! Confirming your booking for a ${bookingData.room} from ${bookingData.checkin} to ${bookingData.checkout}.`);
      botReply(`We will contact you shortly to finalize. For questions, call +66 912 345 678.`);
      bookingState = null;
      bookingData = {};
    } else {
      botReply(`Please choose a valid room: Deluxe Room, Family Suite, or Garden Bungalow.`);
    }
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userText = chatInput.value.trim();
  if (!userText) return;
  userReply(userText);
  chatInput.value = "";

  if (bookingState === "booking") {
    handleBooking(userText);
    return;
  }

  let matched = false;
  for (const item of faq) {
    if (item.question.test(userText)) {
      if (item.action === "startBooking") {
        bookingState = "booking";
        bookingData = {};
      }
      botReply(item.answer);
      matched = true;
      break;
    }
  }

  if (!matched) {
    botReply("Sorry, I didn't understand that. Please ask about rooms, prices, booking, or amenities.");
  }
});