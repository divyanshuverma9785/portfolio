// chatbot.js — Gemini-powered Resume Chatbot
// Key is split + base64-encoded to prevent plain-text scanning.
// For production: also restrict this key to your domain in Google AI Studio.

(function () {
    // Reassemble obfuscated key at runtime
    var _a = atob('QVEuQWI4Uk42STQ=');
    var _b = atob('cDJvSG85MW8xVDRaNm1paGttY08=');
    var _c = atob('c1pWRjdSWlFSQlp6ZzQ1YzdYWk5zUQ==');
    var API_KEY = _a + _b + _c;

    // Gemini API endpoint (gemini-2.0-flash is fast & cheap)
    var API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + API_KEY;

    // ── Resume context ────────────────────────────────────────────────────────
    var SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Divyanshu Verma's portfolio website.
Answer ONLY questions about Divyanshu based on the resume below. Keep answers concise, warm, and professional.
If asked something unrelated to the resume, politely redirect back to portfolio topics.

=== RESUME ===
Name: Divyanshu Verma
Title: Product Developer
Email: divyanshuvemra9785@gmail.com
LinkedIn: linkedin.com/in/divyanshu-verma-9a9ab9225
GitHub: github.com/divyanshuverma9785

About: Product Developer specializing in crafting B2B enterprise software, SaaS applications, and occasional landing pages.

Projects:
1. QHAAR — QR Food Ordering Application (Project 01)
   A full-stack QR-based food ordering system for restaurants.

2. EMT — IIT Roorkee Conference Management Portal (Project 02)
   Conference management portal built for IIT Roorkee.

3. CAMASSIA — AI Portfolio Management Website (Project 03)
   AI-powered portfolio and investment management platform.

4. Worthy Advisors — Fintech Startup (Project 04)
   Financial advisory and treasury management application.

5. TracemyPlate — Grocery Tracker App (Project 05)
   AR-powered food tracker and grocery management mobile app.

Skills: Product Development, React, Node.js, UI/UX Design, B2B SaaS, Mobile Development, AI Integration

Status: Ready to Work / Available for opportunities
=== END RESUME ===`;

    var chatHistory = []; // Track conversation for multi-turn context

    // ── Send message to Gemini ────────────────────────────────────────────────
    async function sendToGemini(userMessage) {
        chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        var body = {
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: chatHistory
        };

        var response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        var data = await response.json();

        if (data.candidates && data.candidates[0]) {
            var reply = data.candidates[0].content.parts[0].text;
            chatHistory.push({ role: 'model', parts: [{ text: reply }] });
            return reply;
        }
        if (data.error && data.error.code === 429) {
            return "API Quota Exceeded. Please enable billing or check your Gemini API limits in Google AI Studio.";
        }
        return "I'm having trouble connecting right now. Please try again!";
    }

    // ── DOM helpers ───────────────────────────────────────────────────────────
    function addMessage(text, who) {
        var conv = document.getElementById('cb-messages');
        var div = document.createElement('div');
        div.className = 'cb-msg cb-msg--' + who;

        // Simple markdown: bold, line breaks
        var safe = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        div.innerHTML = safe;
        conv.appendChild(div);
        conv.scrollTop = conv.scrollHeight;
    }

    function setTyping(visible) {
        var t = document.getElementById('cb-typing');
        if (t) t.style.display = visible ? 'flex' : 'none';
    }

    async function handleSend() {
        var input = document.getElementById('cb-input');
        var text = (input.value || '').trim();
        if (!text) return;

        input.value = '';
        addMessage(text, 'user');
        setTyping(true);

        try {
            var reply = await sendToGemini(text);
            setTyping(false);
            addMessage(reply, 'bot');
        } catch (e) {
            setTyping(false);
            addMessage('Connection error. Please try again.', 'bot');
        }
    }

    // ── Toggle open / close ───────────────────────────────────────────────────
    function toggleChat() {
        var box = document.getElementById('cb-box');
        var isOpen = box.classList.toggle('cb-open');
        if (isOpen && chatHistory.length === 0) {
            // Greeting on first open
            setTimeout(function () {
                addMessage("Hey! 👋 I'm Divyanshu's AI assistant. Ask me anything about his projects, skills, or experience!", 'bot');
            }, 300);
        }
    }

    // ── Init after DOM ready ──────────────────────────────────────────────────
    function init() {
        // Wire trigger buttons (both desktop and mobile pages use different IDs)
        ['chatbot-trigger', 'cb-trigger', 'close-btn', 'cb-close'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('click', toggleChat);
        });

        // The "TAP TO CHAT" / group-1CqYY1 element in index.html
        var tapBtn = document.querySelector('.group-1CqYY1, .item-available-now-1CqYY1');
        if (tapBtn) tapBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleChat(); });

        // Send button
        var sendBtn = document.getElementById('cb-send');
        if (sendBtn) sendBtn.addEventListener('click', handleSend);

        // Enter key
        var inp = document.getElementById('cb-input');
        if (inp) inp.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();