export { renderers } from '../../renderers.mjs';

const prerender = false;
async function POST({ request }) {
  try {
    const contentType = request.headers.get("content-type");
    console.log("Request content-type:", contentType);
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType);
      return new Response(JSON.stringify({
        error: "Content-Type must be application/json"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let requestData;
    try {
      const rawBody = await request.text();
      console.log("Raw request body:", rawBody);
      if (!rawBody || rawBody.trim() === "") {
        return new Response(JSON.stringify({
          error: "Request body is empty"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      requestData = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return new Response(JSON.stringify({
        error: "Invalid JSON in request body"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { message } = requestData;
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({
        error: "Invalid message"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const openaiKey = "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";
    const groqKey = "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";
    console.log("API Keys status:", {
      openai: openaiKey ? "Available" : "Missing",
      groq: groqKey ? "Available" : "Missing"
    });
    const PORTFOLIO_CONTEXT = `
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
`;
    let response, provider;
    if (openaiKey && openaiKey.trim()) {
      try {
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: PORTFOLIO_CONTEXT },
              { role: "user", content: message }
            ],
            max_tokens: 600,
            temperature: 0.7
          })
        });
        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          response = data.choices[0]?.message?.content;
          provider = "OpenAI GPT-4";
        }
      } catch (error) {
        console.error("OpenAI API error:", error);
      }
    }
    if (!response && groqKey && groqKey.trim()) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              { role: "system", content: PORTFOLIO_CONTEXT },
              { role: "user", content: message }
            ],
            max_tokens: 600,
            temperature: 0.7
          })
        });
        if (groqResponse.ok) {
          const data = await groqResponse.json();
          response = data.choices[0]?.message?.content;
          provider = "Groq Llama3";
        }
      } catch (error) {
        console.error("Groq API error:", error);
      }
    }
    if (response) {
      return new Response(JSON.stringify({
        success: true,
        response: response.trim(),
        source: "external-ai",
        provider
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        response: "I'm here to help! Feel free to ask about Rohit's projects, experience, or contact information.",
        source: "fallback",
        provider: "Pattern Matching"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error("API endpoint error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
