import type { SiteConfig, SiteContent } from "../types";

export const SITE_CONFIG: SiteConfig = {
  title: "Rohit Deshpande — Software Engineer",
  author: "Rohit Deshpande",
  description:
    "Computer Engineering Student | Software & Data Science Focused | Driven by Passion for AI & ML",
  lang: "en",
  siteLogo: "/alejandro-small.jpg",
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
  socialImage: "/zen-og.png",
  canonicalURL: "https://portfolio-rohit-deshpande.vercel.app",
};

export const SITE_CONTENT: SiteContent = {
  hero: {
    name: "ROHIT DESHPANDE",
    specialty: "Software Engineer | Data Science Enthusiast",
    summary: "Computer Engineering Student with a drive for Analysis, Coding, Data and Impactful Problem Solving.",
    email: "rohitsdeshpande4work@gmail.com",
  },
  about: {
    description: `
      Hi, I’m Alejandro Múnez, a passionate Mobile and Web Developer with a knack for crafting seamless digital experiences. With a strong background in both Android and iOS development, as well as front-end web technologies, I thrive in the intersection where creativity meets technology.

      Over the years, I’ve honed my skills in building robust, user-friendly applications that not only meet the needs of users but also push the boundaries of what’s possible. My projects range from innovative mobile applications to responsive web designs, all with a focus on performance, security, and scalability.
    `,
    image: "/alejandro-big.jpg",
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
      degree: "Class 12 (Higher Secondary)",
      grade: "95.40%",
      startDate: "2020",
      endDate: "2022",
      image: "/singhania-school.jpg",
    },
    {
      institution: "Hiranandani Foundation School, Thane",
      degree: "Class 10 (Secondary)",
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
      endDate: "July 2025",
      summary: "Developed a complete database project with CRUD APIs as part of a self-driven learning initiative, enhancing skills in SQL, backend development, and API integration. Improved the PAM Alert Service by optimizing performance, refining relational mappings, and implementing logging for 23% better traceability. Created documentation, flowcharts, and tested 1000+ API endpoints using Postman. Initiated migration of the alert service to a new .NET 8 Worker Service framework."
    },
    {
      company: "Computer Society of India (CSI) - KJSCE",
      position: "Operations Team Member",
      startDate: "July 2023",
      endDate: "May 2024",
      summary: "Contributed to the planning and execution of major technical events at CSI KJSCE, including Road to Programming (400+ participants), KJSCE Ideathon, Tech Olympics, and Devopia—one of Mumbai’s largest hackathons. Designed competition questions, managed online rounds, tracked scores, and handled backend logistics. Supported social media outreach by analyzing engagement patterns and implementing content strategies, resulting in 500+ daily viewers during peak events."
    }
  ],
  projects: [
    {
      name: "Portfolio Website",
      summary: "A personal portfolio website showcasing my projects and skills.",
      date: "Aug 2025",
      techStack: ["Astro", "TypeScript", "TailwindCSS"],
      tags: ["portfolio", "web", "frontend"],
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/portfolio.png",
    },
    {
      name: "AI Powered Mock Interview Platform",
      summary: "A platform for conducting mock technical interviews.",
      date: "May 2025",
      techStack: ["Vite", "React", "Firebase", "Gemini API"],
      tags: ["AI", "interview", "platform"],
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/mock-interview.png",
    },
    {
      name: "Customer Churn Prediction",
      summary: "A machine learning model to predict customer churn.",
      date: "May 2025",
      techStack: ["Python", "scikit-learn", "Pandas"],
      tags: ["machine-learning", "churn", "random-forest"],
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/clone-ig.png",
    },
    {
      name: "Face Mask Detector and AI Health Assistant",
      summary: "A machine learning model to detect face masks and provide health assistance.",
      date: "Apr 2025",
      techStack: ["Python", "TensorFlow", "OpenCV", "Flask"],
      tags: ["AI", "health", "computer-vision"],
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/clone-ig.png",
    },
    {
      name: "Sentiment Analysis Classifier",
      summary: "A machine learning model to classify sentiment from text data.",
      date: "Feb 2025",
      techStack: ["Python", "NLTK", "scikit-learn"],
      tags: ["NLP", "sentiment", "machine-learning"],
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/clone-ig.png",
    },
    {
      name: "Quiz Platform with AI Based Question Generation",
      summary: "A platform for creating and taking quizzes with AI-generated questions.",
      date: "Nov 2024",
      techStack: ["React", "Node.js", "Gemini API"],
      tags: ["quiz", "AI", "platform"],
      linkPreview: "/",
      linkSource: "https://github.com/immois/astro-zen",
      image: "/clone-ig.png",
    }
  ],
  contact: {
    email: "rohitsdeshpande4work@gmail.com",
    phone: "+918291692070",
    socials: {
      linkedin: "https://www.linkedin.com/in/irohitdeshpande/",
      github: "https://github.com/irohitdeshpande"
    }
  }
};

// #5755ff
