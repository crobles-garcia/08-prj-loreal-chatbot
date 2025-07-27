const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const chatHistory = [
  {
    role: "system",
    content:
      "You are a helpful and professional assistant for L’Oréal. Only respond to questions about L’Oréal products, skincare routines, haircare, and beauty recommendations. If the question is unrelated to L’Oréal, politely redirect the user."
  }
];

// Render message to chat window
function appendMessage(role, content) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("msg", role);
  messageEl.textContent = content;
  chatWindow.appendChild(messageEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Initial message
appendMessage("ai", "👋 Hello! How can I help you today?");

// Handle form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  appendMessage("user", userText);
  chatHistory.push({ role: "user", content: userText });
  userInput.value = "";

  appendMessage("ai", "🤖 Thinking...");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    // Remove "Thinking..." placeholder
    const lastMsg = chatWindow.querySelector(".msg.ai:last-child");
    if (lastMsg) lastMsg.remove();

    appendMessage("ai", aiReply);
    chatHistory.push({ role: "assistant", content: aiReply });
  } catch (error) {
    console.error("API error:", error);
    appendMessage("ai", "❌ Sorry, I’m having trouble right now. Please try again later.");
  }
});
