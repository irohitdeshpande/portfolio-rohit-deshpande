const c={apiEndpoint:"http://localhost:11434/api/generate",model:"llama3.2:1b",maxTokens:600,temperature:.7,timeout:1e4};async function g(){return!0}async function l(n){try{console.log("Sending request to /api/chat with message:",n);const e=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:n})});if(console.log("Response status:",e.status),console.log("Response headers:",Object.fromEntries(e.headers.entries())),!e.ok){const t=await e.text();throw console.error(`HTTP ${e.status}: ${t}`),new Error(`HTTP ${e.status}`)}const o=await e.json();return console.log("Response data:",o),o.success?{success:!0,response:o.response,source:"external-ai",confidence:.9}:{success:!1,response:o.response||"I'm here to help! Feel free to ask about Rohit's projects, experience, or contact information.",source:"fallback",confidence:.5}}catch(e){return console.error("External AI API error:",e),{success:!1,response:"I'm experiencing some technical difficulties. Please try asking about Rohit's projects or contact information!",source:"external-ai",confidence:0}}}const u=`
You are Rohit Deshpande, a Computer Engineering student at K.J. Somaiya College of Engineering with a passion for software development and data science. Here is your background:

EDUCATION:
- B.Tech Computer Engineering at K.J. Somaiya College (2022-2026) - GPA 8.40
- Class 12 CISCE Board: 95.40% (2020-2022)
- Class 10 CISCE Board: 95.80% (2010-2020)

EXPERIENCE:
- Software Engineer Intern at Arcon TechSolutions (Jun-Jul 2025): Backend systems, CRUD APIs, SQL, .NET 8 migration
- Operations Team Member at CSI-KJSCE (Jul 2023-May 2024): Event management, Tech Olympics, hackathons

TECHNICAL SKILLS:
- Languages: Python, TypeScript, JavaScript, C++, SQL
- Web Development: Astro, React, Node.js, TailwindCSS, HTML/CSS
- Data Science & AI: Scikit-learn, TensorFlow, OpenCV, Pandas, NumPy
- Tools: Git, MongoDB, Firebase, Postman, Jupyter

KEY PROJECTS:
- Portfolio Website (Astro, TypeScript, TailwindCSS)
- IntervAI: Mock Interview Platform (Vite, Firebase, Gemini API)
- Customer Churn Prediction (ML with Python, Scikit-learn)
- Face Mask Detector & AI Health Assistant (OpenCV, TensorFlow)
- Tweet Sentiment Analysis (NLTK, Streamlit)
- Quizify: AI-Driven Quiz Platform (MERN stack, Gemini API)

PERSONALITY:
- Enthusiastic about AI/ML and problem-solving
- Always eager to learn new technologies
- Driven by creating impactful solutions
- Based in Mumbai, India
- Approachable and loves discussing technology

INSTRUCTIONS:
- Respond as Rohit in first person ("I am", "My experience", etc.)
- Write in a natural, conversational, and friendly tone, like a real person
- Avoid repetitive greetings (e.g., do not start every answer with "Namaskar" or "Hello")
- Do not repeat the same phrases in every answer
- Give detailed, thoughtful, and well-structured answers (150-250 words if needed)
- If the user asks for details, provide in-depth explanations and examples
- Use relevant emojis naturally, but not in every sentence
- Occasionally add Marathi touches ("Namaskar", "Dhanyawad") only if it fits the context
- Focus on the specific aspect the user is asking about
- Never cut off answers midway; always complete your thought
- If the user asks for a summary, keep it concise; otherwise, be as helpful as possible
- Do not use generic chatbot phrases; answer as if you are Rohit
`;async function p(n=c){try{const e=new AbortController,o=setTimeout(()=>e.abort(),2e3),t=await fetch(`${n.apiEndpoint.replace("/api/generate","/api/tags")}`,{method:"GET",signal:e.signal});return clearTimeout(o),t.ok}catch(e){return console.log("Local LLM not available:",e),!1}}async function h(n,e=c){try{const o=new AbortController,t=setTimeout(()=>o.abort(),e.timeout),s=`${u}

User Question: ${n}

Rohit's Response:`,a=await fetch(e.apiEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:e.model,prompt:s,stream:!1,options:{num_predict:e.maxTokens,temperature:e.temperature}}),signal:o.signal});if(clearTimeout(t),!a.ok)throw new Error(`HTTP error! status: ${a.status}`);const r=await a.json();if(r.response&&r.response.trim())return{success:!0,response:r.response.trim(),source:"local-llm",confidence:.9};throw new Error("Empty response from LLM")}catch(o){return console.warn("LLM generation failed:",o),{success:!1,response:"",source:"local-llm",confidence:0}}}function m(n,e){const o=n.length>e.length?n:e,t=n.length>e.length?e:n;if(o.length===0)return 1;const s=d(o,t);return(o.length-s)/o.length}function d(n,e){const o=Array(e.length+1).fill(null).map(()=>Array(n.length+1).fill(null));for(let t=0;t<=n.length;t++)o[0][t]=t;for(let t=0;t<=e.length;t++)o[t][0]=t;for(let t=1;t<=e.length;t++)for(let s=1;s<=n.length;s++){const a=n[s-1]===e[t-1]?0:1;o[t][s]=Math.min(o[t][s-1]+1,o[t-1][s]+1,o[t-1][s-1]+a)}return o[e.length][n.length]}const i={greetings:{keywords:["hello","hi","hey","good morning","good evening","howdy","greetings","kasa kay","namaste","sup","namaskar"],responses:["Namaskar! � I'm Rohit Deshpande! Kasa kay? Feel free to ask me about my projects and skills!","Hello! � Welcome to my portfolio! I'd love to share about my tech journey with you!","Hi there! � Great to meet you! What would you like to know about my work?"]},aboutMe:{keywords:["tell me about","who are you","about yourself","introduce","background"],responses:["I'm a passionate Computer Engineering student at K.J. Somaiya College! 🎓 Love working on AI/ML and web development projects.","I'm Rohit Deshpande from Mumbai! 💻 A tech enthusiast who combines coding skills with creative problem-solving!"]},skills:{keywords:["skills","technologies","programming","tech stack","languages","expertise"],responses:["My expertise includes Python, TypeScript, React, and AI/ML tools! 💻 Also work with TensorFlow and Scikit-learn.","I work with web development (React, Astro), data science (Python, Pandas), and AI technologies! 🚀"]},projects:{keywords:["projects","work","built","developed","portfolio"],responses:["I've built IntervAI (mock interview platform), ML prediction models, and AI applications! 🚀 Each project teaches me something new!","My portfolio has everything from web apps to ML models! 💡 Love working on innovative solutions!"]},education:{keywords:["education","college","university","degree","studies","academic"],responses:["Studying Computer Engineering at K.J. Somaiya College! 🎓 Maintaining 8.40 GPA and loving every moment!","I'm at K.J. Somaiya College doing Computer Engineering! 📚 Academic performance has been great with 8.40 GPA!"]},contact:{keywords:["contact","reach","email","connect","hire","work together"],responses:["Connect with me at rohitsdeshpande4work@gmail.com or LinkedIn! 📧 Always excited to discuss new opportunities!","Would love to connect! 🤝 Check out my contact section - I'm very responsive to messages!"]},thanks:{keywords:["thank you","thanks","appreciate","grateful","dhanyawad"],responses:["Dhanyawad! � Happy to help! Kai pan vichar aahe tya?","You're welcome! 😊 Feel free to ask anything else!"]},goodbye:{keywords:["bye","goodbye","see you","farewell","take care"],responses:["Bye bye! 👋 Bhetu punha soon! Thanks for visiting my portfolio!","Take care! 🚀 Don't hesitate to reach out anytime!"]}};function y(n){const e=n.toLowerCase();let o={category:"",score:0};for(const[t,s]of Object.entries(i))for(const a of s.keywords){const r=m(e,a);r>.6&&r>o.score&&(o={category:t,score:r}),e.includes(a)&&o.score<.8&&(o={category:t,score:.8})}if(o.score>.6){const t=i[o.category].responses;return{success:!0,response:t[Math.floor(Math.random()*t.length)],source:"pattern",confidence:o.score}}return null}async function f(n){if(!n.trim())return{success:!0,response:"I'm here to help! Feel free to ask me about my skills, projects, or experience! 😊",source:"fallback"};try{const o=await l(n);if(o.success)return o}catch{console.log("External AI failed, trying alternatives...")}if(await p()){const o=await h(n);if(o.success)return o}const e=y(n);return e&&e.confidence&&e.confidence>.7?e:{success:!0,response:"That's an interesting question! 🤔 I'd love to help you learn more about my background. Try asking about my skills, projects, or experience!",source:"fallback"}}export{l as generateExternalAIResponse,h as generateLLMResponse,f as getChatbotResponse,g as isExternalAIAvailable,p as isLLMAvailable};
