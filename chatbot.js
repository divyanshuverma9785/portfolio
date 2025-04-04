// chatbot.js

const apiKey = 'xai-2rTfpfShd6YMkFrnPyqiFSXhXIBQZPF1HzWMwgP8R7KI90JEXa55VzGLFo8tVAcbsbNgatV9jnWJQNi8'; // Replace with your actual API key
const apiUrl = '//api.x.ai/v1/chat/completions'; // Adjust based on your API provider

// Structured prompt with your resume details
const resumePrompt = `
You are a chatbot that answers questions based on the following resume:

Work Experience:
- Software Engineer at TechCorp (2020-2023): Developed web applications using React and Node.js.
- Intern at StartupX (2019): Assisted in data analysis and machine learning projects.

Skills:
- JavaScript, Python, React, Node.js, Machine Learning

Projects:
- Personal Portfolio Website: A responsive website showcasing my projects and skills.
- Open Source Contributions: Contributed to various GitHub repositories.

Certifications:
- Certified JavaScript Developer (2021)
- Machine Learning Specialization (2022)

Please answer the user's question based on this information.
`;

// Function to send a message to the API
async function sendMessage(userInput) {
    const fullPrompt = resumePrompt + `\n\nUser: ${userInput}\nAssistant:`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-beta', // Adjust based on your API’s model
                messages: [{ role: 'user', content: fullPrompt }],
                temperature: 0.7
            })
        });
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error processing your request.';
    }
}

// Function to handle user input and display responses
function handleUserInput() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML += `<div class="user-message">${userInput}</div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;
    document.getElementById('user-input').value = '';

    sendMessage(userInput).then(response => {
        chatHistory.innerHTML += `<div class="assistant-message">${response}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });
}

// Toggle chatbot visibility
document.getElementById('chatbot-trigger').addEventListener('click', () => {
    const chatbotBox = document.getElementById('chatbot-box');
    chatbotBox.style.display = chatbotBox.style.display === 'block' ? 'none' : 'block';
});

// Event listeners for sending messages
document.getElementById('send-button').addEventListener('click', handleUserInput);
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});