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
      degree: "B.Tech Computer Engineering",
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
      techStack: ["Astro", "TypeScript", "TailwindCSS"],
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
};

// #5755ff
