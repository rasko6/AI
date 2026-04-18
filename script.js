import { pipeline } from 'https://jsdelivr.net';

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let generator;

// Helper to display messages
function addMessage(text, sender) {
    const msg = document.createElement('p');
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// AI Initialization
async function initAI() {
    addMessage("Loading.. (please wait)", "System");
    try {
        generator = await pipeline('text-generation', 'Xenova/SmolLM-135M-Instruct');
        addMessage("Ready", "AI");
    } catch (e) {
        addMessage("Error loading model. Check your internet connection.", "System");
    }
}

initAI();

// Handling the "Send" action
async function handleChat() {
    const text = userInput.value.trim();
    if (!text || !generator) return;

    addMessage(text, "You");
    userInput.value = '';

    // Create a simple chat prompt
    const prompt = `User: ${text}\nAI:`;

    const output = await generator(prompt, {
        max_new_tokens: 64,
        temperature: 0.8, // More "human" and creative
        do_sample: true,
        top_k: 50,
        repetition_penalty: 1.2
    });

    // Clean up the output to show only the AI's reply
    let reply = output[0].generated_text.split('AI:').pop().trim();
    
    addMessage(reply, "AI");
}

sendBtn.onclick = handleChat;

// Allow pressing "Enter" to send
userInput.onkeypress = (e) => { if (e.key === 'Enter') handleChat(); };
