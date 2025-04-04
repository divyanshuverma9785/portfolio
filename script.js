// Replace with your actual xAI API key
const apiKey = 'xai-2rTfpfShd6YMkFrnPyqiFSXhXIBQZPF1HzWMwgP8R7KI90JEXa55VzGLFo8tVAcbsbNgatV9jnWJQNi8';

// API endpoint for Grok Cloud (xAI)
const apiUrl = 'https://api.x.ai/v1/chat/completions';

// Structured prompt with your resume details (customize this)
const resumePrompt = `

Below is the resume of Divyanshu Vemra. Please answer any questions about their work experience, skills, projects, and certifications based on this information.
DIVYANSHU VERMA
UG (IV Year II Semester)
BS-MS (Economics), IIT Roorkee
Contact: +91 9772427180 | Email: d_verma@hs.iitr.ac.in
Registration No.: 21322012/2025

-------------------------------------------------------------------
AREA OF INTEREST
-------------------------------------------------------------------
- Data Analytics
- Machine Learning
- Statistics
- Leadership

-------------------------------------------------------------------
EDUCATION
-------------------------------------------------------------------
BS-MS Economics (4th Year) - IIT Roorkee (2024) - CGPA: 7.000
Class XII (Intermediate) - Matrix High School, Sikar (2020) - 89.20%
Class X (Matriculate) - Jhunjhunu Academy, Wisdom City (2018) - 82.60%

-------------------------------------------------------------------
INTERNSHIPS
-------------------------------------------------------------------
Business Analyst Internship | Worthy Advisors
(June 2023 to August 2023)
- Led market research and statistical analysis; contributed to 20+ client engagements.
- Analyzed financial data of 350+ companies.
- Worked closely with founders and CFOs to improve lead generation and trust.
- Boosted client engagement by 150% and increased monthly visitors by 1.5k.

Research Internship | University of London
(November 2023 to May 2024)
- First-author of Meta-analysis paper accepted at International Arsenic Congress 2024.
- Worked under Prof. Vijaya Gupta (IIM Mumbai) and Prof. Louiza Campos (UCL).
- Contributed to web scraping, literature review, data curation, and bibliometric analysis.

-------------------------------------------------------------------
PROJECTS
-------------------------------------------------------------------
Stock Sentiment Analysis via ML | Finance Club IITR
(May 2024 to June 2024)
- Built stock price prediction model using news sentiment analysis (97% accuracy).
- Created sentiment-based trading strategy with strong simulated returns.

Data-Driven Conference Management Portal | IIT Roorkee
(December 2023)
- Developed CMP system to manage speakers, attendees, logistics.
- Scheduled launch for IAHS 2025 conference.

TOI Analysis: India, Malaysia, Mauritius | HSS Dept., IITR
(August 2023 to December 2023)
- Comparative analysis of RTAs using Trade Overlap Index.
- Conducted econometric analysis using panel regression.

Inventory Management Portal | Tinkering Lab, IITR
(December 2022 to February 2023)
- Developed portal to manage lab inventory; improved efficiency by 30%.
- Persuaded 3 departments to adopt the system.

-------------------------------------------------------------------
AWARDS & ACHIEVEMENTS
-------------------------------------------------------------------
- ENCORE Award, IIT Roorkee for all-round excellence.
- Gold Medal in 100m race (Departmental Sports Fiesta 2024).
- 1st Place in BRAND BLITZ competition, Delhi University.
- All India 2nd Runner-up im BAJA SAE 2023 (Cost Evaluation).

-------------------------------------------------------------------
SKILLS
-------------------------------------------------------------------
Languages: Python, R, C++
Software: SolidWorks, Excel, Stata, RStudio, SQL, Tableau

Certifications:
- IITG Winter Consulting 2023
- Python (Basic to Advanced)

-------------------------------------------------------------------
POSITIONS OF RESPONSIBILITY & EXTRA-CURRICULARS
-------------------------------------------------------------------
Head Organizer | Smart India Hackathon 2024
(December 2024)
- Led 20+ member team in Grand Finale under Ministry of Education.
- Managed logistics for 150+ participants across 25 teams.
- Coordinated with NTRO, media, and government officials.

Additional Secretary | Tinkering Lab, IIT Roorkee
(April 2024 in Present)
- Organized TinkerQuest24 (Pan-India Hackathon) with 25+ team members.
- Mentored 1000+ first-year students on tech and innovation.
- Hosted workshops: Metaverse, 3D Printing, and more with 500+ attendees.
- Created and deployed lab Inventory Portal.
- Launched "Think-Thursday" campaign 5x engagement increase.

-------------------------------------------------------------------
`;



// Function to send a message to the chatbot
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    const chatHistory = document.getElementById('chat-history');

    // Add user message to history
    chatHistory.innerHTML += `<div class="user-message">${userInput}</div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Clear input field
    document.getElementById('user-input').value = '';

    // Show loading indicator
    chatHistory.innerHTML += `<div class="assistant-message">Thinking...</div>`;
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-beta', // Specify the Grok model (adjust if needed)
                messages: [
                    { role: 'system', content: resumePrompt },
                    { role: 'user', content: userInput }
                ],
                temperature: 0.7,
                stream: false
            })
        });

        const data = await response.json();

        // Remove loading message
        chatHistory.removeChild(chatHistory.lastChild);

        // Add assistant response
        const assistantMessage = data.choices[0].message.content.trim();
        chatHistory.innerHTML += `<div class="assistant-message">${assistantMessage}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        chatHistory.removeChild(chatHistory.lastChild);
        chatHistory.innerHTML += `<div class="assistant-message">Sorry, there was an error processing your request.</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}

// Event listeners
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
document.querySelector('.group-chatbot').addEventListener('click', () => {
    const chatBox = document.getElementById('chat-box');
    chatBox.style.display = chatBox.style.display === 'block' ? 'none' : 'block';
});