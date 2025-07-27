const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const chatHistory = [
  {
    role: "system",
    content: `You are a helpful and professional virtual assistant for L’Oréal. 
Only answer questions related to L’Oréal products, skincare routines, haircare, makeup, and beauty-related topics. 
If a user asks something unrelated (like history, tech, math, etc.), politely reply: 
"I'm here to help with L’Oréal products and beauty-related questions. Let me know how I can support your beauty journey!" 
Ask for the user's name early on if not provided, and use it occasionally in responses.`
  }
];

// Render initial welcome
appendMessage("ai", "💄 Hi there! I’m here to help you find the perfect L’Oréal products and routines. What would you like to know?");

// Main chat handler
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold text
    .replace(/\n/g, "<br>") // new lines
    .replace(/(\d+)\.\s/g, "<br><strong>$1.</strong> "); // numbered list start
}
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  userInput.value = "";

  // Group user + assistant messages in one block
  const groupEl = document.createElement("div");
  groupEl.classList.add("msg-group");

  const userMsg = document.createElement("div");
  userMsg.classList.add("msg", "user");
  userMsg.textContent = userText;
  groupEl.appendChild(userMsg);

  const aiMsg = document.createElement("div");
  aiMsg.classList.add("msg", "ai");
  aiMsg.textContent = "✨ Loading your personalized beauty advice...";

  groupEl.appendChild(aiMsg);

  chatWindow.appendChild(groupEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Update history
  chatHistory.push({ role: "user", content: userText });

  try {
    const response = await fetch("https://proj8-loreal.croblesg.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: chatHistory
      })
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    aiMsg.innerHTML = formatMarkdown(aiReply);
    chatHistory.push({ role: "assistant", content: aiReply });
  } catch (error) {
    console.error("API error:", error);
    aiMsg.textContent = "❌ Sorry, I’m having trouble right now. Please try again later.";
  }

  chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Reusable function for standalone messages (e.g. initial greeting)
function appendMessage(role, content) {
  const groupEl = document.createElement("div");
  groupEl.classList.add("msg-group");

  const msgEl = document.createElement("div");
  msgEl.classList.add("msg", role);
  msgEl.textContent = content;

  groupEl.appendChild(msgEl);
  chatWindow.appendChild(groupEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

