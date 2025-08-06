import type { SiteConfig, SiteContent } from "../types";

export const SITE_CONFIG: SiteConfig = {
  title: "Rohit Deshpande — Software Engineer",
  author: "Rohit Deshpande",
  description:
    "Computer Engineering Student | Software & Data Science Focused | Driven by Passion for AI & ML",
  lang: "en",
  siteLogo: "/rohit-logo.jpg",
  navLinks: [
    { text: "About", href: "#about" },
    { text: "Education", href: "#education" },
    { text: "Experience", href: "#experience" },
    { text: "Projects", href: "#projects" },
    { text: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { text: "GitHub", href: "https://github.com/irohitdeshpande" },
    { text: "LinkedIn", href: "https://www.linkedin.com/in/irohitdeshpande/" },
    { text: "Instagram", href: "https://www.instagram.com/irohitdeshpande/" },
  ],
  socialImage: "/rohit-logo.png",
  canonicalURL: "https://portfolio-rohit-deshpande.vercel.app",
};

export const SITE_CONTENT: SiteContent = {
  hero: {
    name: "ROHIT DESHPANDE",
    specialty: "Software Engineer | Data Science Enthusiast",
    summary:
      "Computer Engineering Student with a drive for Analysis, Coding, Data and Impactful Problem Solving.",
    email: "rohitsdeshpande4work@gmail.com",
    resume:
      "https://somaiya0-my.sharepoint.com/:b:/g/personal/rohit_sd_somaiya_edu/EcTycmheCOFDoUBHYXe8Et8BxUMp62ub4MhYDLCBxnxy8Q?e=s8o056",
    heroImage: "/rohitdeshpande.jpg",
  },
  about: {
    description: `I'm a Computer Engineering student at K.J. Somaiya College of Engineering, driven by a passion for software development and data science. My journey has been marked by a commitment to learning and innovation, with a focus on AI and machine learning. I thrive on challenges that require analytical thinking and creative problem-solving, and I'm always eager to explore new technologies and methodologies to enhance my skills and contribute to impactful projects. Whether it's through internships, academic projects, or personal endeavors, I strive to make a meaningful impact in the tech world.
    `,
    image: "/rohitdeshpande.jpg",
  },
  education: [
    {
      institution: "K.J. Somaiya College of Engineering, Vidyavihar",
      degree: "B.Tech Computer Engineering, Hons. in Data Science & Analytics",
      grade: "GPA 8.40 (Till 6th Semester)",
      startDate: "2022",
      endDate: "2026",
      image: "/somaiya-campus.jpg",
    },
    {
      institution: "Smt. Sulochanadevi Singhania School, Thane",
      degree: "Class 12 (CISCE Board)",
      grade: "95.40%",
      startDate: "2020",
      endDate: "2022",
      image: "/singhania-school.jpg",
    },
    {
      institution: "Hiranandani Foundation School, Thane",
      degree: "Class 10 (CISCE Board)",
      grade: "95.80%",
      startDate: "2010",
      endDate: "2020",
      image: "/hfs-campus.jpg",
    },
  ],
  experience: [
    {
      company: "Arcon TechSolutions",
      position: "Software Engineer Intern",
      startDate: "Jun 2025",
      endDate: "Jul 2025",
      summary:
        "During my internship at ARCON, I gained hands-on experience in understanding and improving large-scale backend systems. I took the initiative to build a complete database project with CRUD APIs, which deepened my expertise in SQL, backend logic, and real-world API integration. Alongside this, I worked on modernizing existing workflows by optimizing performance, refining relational mappings, and implementing structured logging to enhance system traceability. I also began the migration of key components to a .NET 8 Worker Service framework, gaining exposure to scalable and maintainable architectures. Throughout the internship, I created detailed documentation, designed workflow diagrams, and tested over 1000 API endpoints using Postman—sharpening my ability to design, debug, and document robust backend systems.",
      image: "/arcon-logo.jpg",
    },
    {
      company: "CSI - KJSCE",
      position: "Operations Team Member",
      startDate: "Jul 2023",
      endDate: "May 2024",
      summary:
        "As a core member of the Operations Team at CSI KJSCE, I played a key role in planning and executing major technical events such as Road to Programming (400+ participants), KJSCE Ideathon, Tech Olympics, and Devopia—one of Mumbai's largest hackathons. I led the organizing efforts for Tech Olympics, ensuring smooth coordination across multiple events, making it one of the most efficiently run editions. My responsibilities included designing competition questions, managing online rounds, tracking participant scores, and handling backend logistics. I also contributed to social media strategy by analyzing engagement patterns and implementing content ideas, which helped drive over 500 daily viewers during peak activity. This experience sharpened my leadership, coordination, and event execution skills in a fast-paced, high-stakes environment.",
      image: "/csi-logo.jpg",
    },
  ],
  projects: [
    {
      name: "Portfolio Website",
      summary:
        "A personal portfolio built with Astro and TailwindCSS to showcase my skills, projects, and experience. Designed with performance, accessibility, and responsiveness in mind.",
      date: "Aug 2025",
      techStack: ["Astro", "TypeScript", "TailwindCSS", "OpenAI", "Groq"],
      tags: [
      ],
      linkPreview: "https://portfolio-rohit-deshpande.vercel.app/",
      linkSource: "https://github.com/irohitdeshpande/portfolio-rohit-deshpande",
      image: "/portfolio-website.png",
    },
    {
      name: "IntervAI: Mock Interview Platform",
      summary:
        "A web-based platform that conducts technical mock interviews using Google’s Gemini API. Supports real-time voice input, AI-generated questions, and performance feedback for job seekers.",
      date: "May 2025",
      techStack: ["Vite", "TypeScript", "Firebase", "Clerk", "Gemini API"],
      tags: [
      ],
      linkPreview: "https://interv-ai.vercel.app/",
      linkSource: "https://github.com/irohitdeshpande/ai-mock-interviewer",
      image: "/mock-interviewer.png",
    },
    {
      name: "Customer Churn Prediction (ML)",
      summary:
        "A machine learning model that predicts customer churn based on behavioral and transactional data. Utilizes Random Forest and logistic regression for classification, with insights visualized in Jupyter.",
      date: "May 2025",
      techStack: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
      tags: [
        
      ],
      linkPreview: "/",
      linkSource: "https://github.com/irohitdeshpande/customer-churn-prediction",
      image: "/customer-churn.png",
    },
    {
      name: "Careshield: Face Mask Detector & AI Health Assistant",
      summary:
        "A real-time face mask detection system using OpenCV and MobileNetV2. Integrated with an AI chatbot (Gemini API) to provide health tips, creating a complete safety assistant solution.",
      date: "Apr 2025",
      techStack: ["Python", "TensorFlow", "OpenCV", "Flask", "Gemini API"],
      tags: [
        
      ],
      linkPreview: "/",
      linkSource: "https://github.com/irohitdeshpande/Face-Mask-Detector",
      image: "/face-mask.png",
    },
    {
      name: "Tweets Sentiment Analysis Classifier",
      summary:
        "A text classification system that uses traditional NLP methods (TF-IDF, NLTK) and logistic regression to analyze sentiment from tweets. Built with a lightweight Streamlit frontend for user input and visualization.",
      date: "Feb 2025",
      techStack: ["Python", "NLTK", "Scikit-learn", "Streamlit"],
      tags: [
        
      ],
      linkPreview: "https://text-sentiment-01.streamlit.app/",
      linkSource: "https://github.com/irohitdeshpande/sentiment-analysis-text",
      image: "/sentiment-analysis.png",
    },
    {
      name: "Quizify: AI-Driven Quiz Platform",
      summary:
        "A full-stack MERN application where evaluators can create, assign, and track quizzes. Supports AI-based question generation via Gemini API and features analytics dashboards for performance insights.",
      date: "Nov 2024",
      techStack: ["React", "Node.js", "MongoDB", "Gemini API"],
      tags: [
       
      ],
      linkPreview: "/",
      linkSource: "https://github.com/irohitdeshpande/ai-quiz-mern",
      image: "/quiz-app.png",
    },
  ],
  contact: {
    email: "rohitsdeshpande4work@gmail.com",
    phone: "+918291692070",
    socials: {
      linkedin: "https://www.linkedin.com/in/irohitdeshpande/",
      github: "https://github.com/irohitdeshpande",
    },
  },
  chatbot: [
    // Basic Information
    {
      question: "What is your name?",
      answer: "Namaskar! I'm Rohit Deshpande, a Computer Engineering student from Mumbai! 🙏",
    },
    {
      question: "Where are you from?",
      answer: "I'm from Mumbai, Maharashtra! Born and raised in this amazing city! 🏙️",
    },
    {
      question: "Tell me about yourself",
      answer: "I'm a passionate Computer Engineering student at K.J. Somaiya College with a love for AI/ML and software development. Always excited to solve real-world problems through technology! 🚀",
    },

    // Technical Skills
    {
      question: "What are your technical skills?",
      answer: "I work with Python, TypeScript, JavaScript, and C++ for programming. For web development, I use React, Astro, Node.js, and TailwindCSS. In AI/ML, I'm skilled with TensorFlow, Scikit-learn, OpenCV, Pandas, and NumPy. I also use Git, MongoDB, Firebase, and Postman for development workflows! 💻",
    },
    {
      question: "What programming languages do you know?",
      answer: "My main languages are Python (for AI/ML and backend), TypeScript/JavaScript (for web development), C++ (for algorithms), and SQL (for databases). Python is my strongest language! 🐍",
    },
    {
      question: "What frameworks do you use?",
      answer: "I love working with React for frontend, Astro for static sites, Node.js for backend, and TailwindCSS for styling. For AI/ML, I use TensorFlow, Scikit-learn, and OpenCV. Currently exploring more modern frameworks! ⚡",
    },

    // Projects
    {
      question: "What projects have you built?",
      answer: "I've built some exciting projects! IntervAI (AI mock interview platform), Customer Churn Prediction models, Face Mask Detector with AI health assistant, Sentiment Analysis tool, and Quizify (AI quiz platform). Each project taught me something new! 🛠️",
    },
    {
      question: "Tell me about IntervAI",
      answer: "IntervAI is my AI-powered mock interview platform built with Vite, TypeScript, and Google's Gemini API. It conducts real-time technical interviews with voice input and provides detailed performance feedback. Really proud of this one! 🎯",
    },
    {
      question: "What's your latest project?",
      answer: "My latest project is this portfolio website built with Astro and TypeScript! It showcases all my work and includes an AI-powered chatbot (that's me!) 😊",
    },

    // Education & Experience
    {
      question: "Where do you study?",
      answer: "I'm studying Computer Engineering at K.J. Somaiya College of Engineering, Vidyavihar. Maintaining a GPA of 8.40 and loving every moment of learning! 🎓",
    },
    {
      question: "Do you have work experience?",
      answer: "Yes! I interned as a Software Engineer at Arcon TechSolutions where I worked on backend systems, CRUD APIs, and .NET 8 migration. Also been part of CSI-KJSCE operations team organizing major tech events! 💼",
    },
    {
      question: "What did you do at your internship?",
      answer: "At Arcon TechSolutions, I built complete database projects with CRUD APIs, worked on SQL optimization, implemented structured logging, and helped migrate systems to .NET 8. Tested over 1000 API endpoints too! 🔧",
    },

    // Contact & Social
    {
      question: "How can I contact you?",
      answer: "You can connect with me through: 📧 Email: rohitsdeshpande4work@gmail.com | 💼 LinkedIn: https://www.linkedin.com/in/irohitdeshpande/ | 💻 GitHub: https://github.com/irohitdeshpande | 📱 Phone: +918291692070. I'm very responsive and always excited to connect!",
    },
    {
      question: "What are your social media links?",
      answer: "Here are my links: LinkedIn: https://www.linkedin.com/in/irohitdeshpande/ (professional updates), GitHub: https://github.com/irohitdeshpande (my code), Instagram: https://www.instagram.com/irohitdeshpande/ (casual updates)! 🔗",
    },
    {
      question: "Can I see your resume?",
      answer: "Absolutely! You can check out my detailed resume at the link in my contact section. It has all my experience, projects, and achievements documented! 📄",
    },

    // Personal & Hobbies
    {
      question: "What are your hobbies?",
      answer: "I love coding personal projects, exploring new AI/ML papers, playing cricket, watching tech YouTube channels, and trying new Mumbai street food! Also enjoy photography and listening to music! 🎵",
    },
    {
      question: "What do you do for fun?",
      answer: "Apart from coding, I enjoy exploring Mumbai's food scene, playing cricket with friends, binge-watching tech documentaries, and working on side projects. Weekend hackathons are my favorite! 🍛",
    },
    {
      question: "What motivates you?",
      answer: "I'm motivated by the potential of technology to solve real problems! Whether it's helping job seekers with IntervAI or predicting customer behavior - I love building things that make a difference! 💡",
    },

    // Career & Future
    {
      question: "What are your career goals?",
      answer: "I want to work as a Software Engineer specializing in AI/ML applications! Dream is to build products that impact millions of users. Eventually, I'd love to start my own tech company! 🌟",
    },
    {
      question: "What type of job are you looking for?",
      answer: "Looking for Software Engineer or Data Scientist roles where I can work on AI/ML projects, backend systems, or full-stack development. Open to both startups and established companies! 🎯",
    },
    {
      question: "Are you available for internships?",
      answer: "Currently focusing on my final year, but always open to exciting opportunities! Feel free to reach out with interesting projects or roles! 🚀",
    },

    // Technology & Learning
    {
      question: "What are you learning currently?",
      answer: "Currently diving deep into advanced ML algorithms, exploring cloud technologies (AWS/Azure), and learning more about system design. Also experimenting with new JavaScript frameworks! 📚",
    },
    {
      question: "What's your favorite technology?",
      answer: "I absolutely love Python for its versatility - from AI/ML to web backends! TypeScript is a close second for making JavaScript more reliable. Also fascinated by AI/ML breakthroughs! 🐍",
    },
    {
      question: "What are you passionate about?",
      answer: "I'm passionate about using AI and software to solve real-world problems! Love the intersection of technology and human needs. Also passionate about sharing knowledge and helping others learn coding! ❤️",
    },

    // Fun Questions
    {
      question: "What's your favorite Mumbai spot?",
      answer: "Love hanging out at Marine Drive for its serenity, and the energy at Bandra! Mumbai's vibe is unmatched! 🌊",
    },
    {
      question: "Do you speak Marathi?",
      answer: "Ho, nakkii! (Yes, of course!) Born and raised Mumbaikar! Love mixing Marathi with English while talking - it's our Mumbai style! 😄",
    },
    {
      question: "What's your coding setup?",
      answer: "I code on VS Code with various extensions, use Git for version control, and love working on both Windows and Linux environments. Multiple monitors are a must! 💻",
    },
  ],
};

// #5755ff
