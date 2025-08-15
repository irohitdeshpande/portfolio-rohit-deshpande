import { NodeRAGService } from './nodeRAGService.js';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Portfolio RAG Population Script
 * Run this script to populate your RAG database with curated information about yourself
 * Usage: npx tsx scripts/populate-rag.ts
 */

// Your portfolio information - customize this!
const PORTFOLIO_DATA = {
  personal: {
    name: "Rohit Deshpande",
    title: "Full-Stack Developer & AI Engineer",
    location: "India",
    email: "contact@rohitdeshpande.dev",
    summary: `Passionate full-stack developer with expertise in modern web technologies, 
    AI/ML implementations, and scalable system architecture. Experienced in React, Node.js, 
    Python, and cloud technologies. Strong background in building innovative solutions 
    that bridge technology and user experience.`
  },

  skills: {
    frontend: [
      "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", 
      "Tailwind CSS", "Astro", "Vue.js", "Responsive Design"
    ],
    backend: [
      "Node.js", "Express.js", "Python", "FastAPI", "PostgreSQL", "MongoDB", 
      "RESTful APIs", "GraphQL", "Microservices"
    ],
    aiml: [
      "Machine Learning", "Deep Learning", "NLP", "Computer Vision", 
      "TensorFlow", "PyTorch", "OpenAI API", "LangChain", "RAG Systems"
    ],
    cloud: [
      "AWS", "Azure", "Vercel", "Docker", "CI/CD", "Git", "Linux"
    ],
    tools: [
      "VS Code", "Git", "Docker", "Postman", "Figma", "Jupyter Notebooks"
    ]
  },

  experience: [
    {
      company: "Tech Innovators Ltd",
      position: "Senior Full-Stack Developer",
      duration: "2022 - Present",
      description: `Lead development of scalable web applications using React and Node.js. 
      Implemented AI-powered features including chatbots and recommendation systems. 
      Managed cloud infrastructure and deployment pipelines.`,
      achievements: [
        "Reduced application load time by 40% through optimization",
        "Built RAG-powered chatbot serving 10k+ users monthly",
        "Led team of 4 developers on major product redesign"
      ]
    },
    {
      company: "StartupXYZ",
      position: "Full-Stack Developer",
      duration: "2020 - 2022",
      description: `Developed and maintained multiple client projects using modern web technologies. 
      Collaborated with design teams to create user-centric applications.`,
      achievements: [
        "Delivered 15+ successful client projects",
        "Implemented responsive designs for mobile-first approach",
        "Integrated third-party APIs and payment systems"
      ]
    }
  ],

  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Computer Science",
      duration: "2016 - 2020",
      description: "Specialized in Software Engineering and AI. Graduated with honors."
    }
  ],

  projects: [
    {
      name: "AI-Powered Portfolio Website",
      description: `Modern portfolio website built with Astro and enhanced with RAG-powered chatbot. 
      Features include responsive design, dark mode, and intelligent Q&A system.`,
      technologies: ["Astro", "TypeScript", "Tailwind CSS", "OpenAI", "Pinecone", "Vercel"],
      highlights: [
        "RAG system for accurate information retrieval",
        "Serverless architecture with optimal performance",
        "Modern UI with accessibility focus"
      ]
    },
    {
      name: "E-Commerce Platform",
      description: `Full-stack e-commerce solution with modern payment integration and 
      admin dashboard. Built for scalability and performance.`,
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      highlights: [
        "Handles 1000+ concurrent users",
        "Integrated payment processing",
        "Real-time inventory management"
      ]
    },
    {
      name: "Data Analytics Dashboard",
      description: `Interactive dashboard for business intelligence with real-time data 
      visualization and ML-powered insights.`,
      technologies: ["Python", "FastAPI", "React", "D3.js", "TensorFlow"],
      highlights: [
        "Real-time data processing",
        "Predictive analytics features",
        "Interactive data visualization"
      ]
    }
  ],

  expertise: {
    webDevelopment: `Expert in modern web development practices including responsive design, 
    performance optimization, and accessibility. Proficient in both frontend and backend 
    technologies with a focus on creating seamless user experiences.`,
    
    aiIntegration: `Specialized in integrating AI capabilities into web applications. 
    Experience with chatbots, recommendation systems, and data analysis tools. 
    Knowledgeable in RAG systems, vector databases, and LLM integration.`,
    
    systemArchitecture: `Strong understanding of scalable system design, microservices 
    architecture, and cloud deployment strategies. Experience with CI/CD pipelines 
    and DevOps practices.`
  },

  interests: [
    "Artificial Intelligence and Machine Learning",
    "Open Source Contributions",
    "Tech Blogging and Knowledge Sharing",
    "Continuous Learning and Skill Development",
    "Building Innovative Web Solutions"
  ]
};

class PortfolioRAGPopulator {
  private documents: Array<{content: string, metadata: any}> = [];
  private ragService: NodeRAGService;

  constructor() {
    console.log('🚀 Starting Portfolio RAG Population...');
    this.ragService = new NodeRAGService();
  }

  /**
   * Convert portfolio data into document chunks for RAG ingestion
   */
  private prepareDocuments() {
    console.log('📝 Preparing portfolio documents...');

    // Personal Information
    this.documents.push({
      content: `Personal Information:
Name: ${PORTFOLIO_DATA.personal.name}
Title: ${PORTFOLIO_DATA.personal.title}
Location: ${PORTFOLIO_DATA.personal.location}
Email: ${PORTFOLIO_DATA.personal.email}

Professional Summary:
${PORTFOLIO_DATA.personal.summary}`,
      metadata: {
        category: 'personal',
        type: 'profile',
        source: 'portfolio_data'
      }
    });

    // Skills
    Object.entries(PORTFOLIO_DATA.skills).forEach(([category, skills]) => {
      this.documents.push({
        content: `${category.toUpperCase()} Skills:
${skills.join(', ')}

Rohit is proficient in ${category} technologies including: ${skills.join(', ')}.`,
        metadata: {
          category: 'skills',
          type: category,
          source: 'portfolio_data'
        }
      });
    });

    // Experience
    PORTFOLIO_DATA.experience.forEach((exp, index) => {
      this.documents.push({
        content: `Work Experience at ${exp.company}:
Position: ${exp.position}
Duration: ${exp.duration}

Description: ${exp.description}

Key Achievements:
${exp.achievements.map(achievement => `• ${achievement}`).join('\n')}`,
        metadata: {
          category: 'experience',
          company: exp.company,
          position: exp.position,
          source: 'portfolio_data'
        }
      });
    });

    // Education
    PORTFOLIO_DATA.education.forEach((edu, index) => {
      this.documents.push({
        content: `Education:
Institution: ${edu.institution}
Degree: ${edu.degree}
Duration: ${edu.duration}

Description: ${edu.description}`,
        metadata: {
          category: 'education',
          institution: edu.institution,
          source: 'portfolio_data'
        }
      });
    });

    // Projects
    PORTFOLIO_DATA.projects.forEach((project, index) => {
      this.documents.push({
        content: `Project: ${project.name}

Description: ${project.description}

Technologies Used: ${project.technologies.join(', ')}

Key Highlights:
${project.highlights.map(highlight => `• ${highlight}`).join('\n')}`,
        metadata: {
          category: 'projects',
          project_name: project.name,
          technologies: project.technologies,
          source: 'portfolio_data'
        }
      });
    });

    // Expertise Areas
    Object.entries(PORTFOLIO_DATA.expertise).forEach(([area, description]) => {
      this.documents.push({
        content: `Expertise in ${area.replace(/([A-Z])/g, ' $1').toLowerCase()}:

${description}`,
        metadata: {
          category: 'expertise',
          area: area,
          source: 'portfolio_data'
        }
      });
    });

    // Interests
    this.documents.push({
      content: `Professional Interests and Passions:

${PORTFOLIO_DATA.interests.map(interest => `• ${interest}`).join('\n')}

Rohit is passionate about ${PORTFOLIO_DATA.interests.join(', ')}.`,
      metadata: {
        category: 'interests',
        source: 'portfolio_data'
      }
    });

    console.log(`✅ Prepared ${this.documents.length} documents for ingestion`);
  }

  /**
   * Ingest documents into RAG system
   */
  private async ingestDocuments() {
    console.log('🔄 Starting RAG ingestion...');

    if (!this.ragService.isAvailable()) {
      throw new Error('❌ RAG services not available. Check your API keys in .env file.');
    }

    for (let i = 0; i < this.documents.length; i++) {
      const doc = this.documents[i];
      console.log(`📤 Ingesting document ${i + 1}/${this.documents.length}: ${doc.metadata.category}`);

      try {
        // Use the text ingestion method instead of PDF
        const success = await this.ragService.ingestText(doc.content, doc.metadata);
        
        if (success) {
          console.log(`✅ Successfully ingested: ${doc.metadata.category}`);
        } else {
          console.log(`❌ Failed to ingest: ${doc.metadata.category}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error ingesting ${doc.metadata.category}:`, error);
      }
    }
  }

  /**
   * Test the RAG system with sample queries
   */
  private async testRAGSystem() {
    console.log('\n🧪 Testing RAG system with sample queries...');

    const testQueries = [
      "What are Rohit's main skills?",
      "Tell me about Rohit's work experience",
      "What projects has Rohit worked on?",
      "What is Rohit's educational background?",
      "What are Rohit's areas of expertise?"
    ];

    for (const query of testQueries) {
      console.log(`\n❓ Query: "${query}"`);
      try {
        const response = await this.ragService.generateResponse(query);
        console.log(`🤖 Response: ${response.response.substring(0, 150)}...`);
        console.log(`📊 Confidence: ${(response.confidence * 100).toFixed(1)}%`);
      } catch (error) {
        console.error(`❌ Error testing query:`, error);
      }
    }
  }

  /**
   * Main execution function
   */
  async run() {
    try {
      console.log('🎯 Portfolio RAG Population Starting...\n');

      // Step 1: Prepare documents
      this.prepareDocuments();

      // Step 2: Ingest documents
      await this.ingestDocuments();

      // Step 3: Test the system
      await this.testRAGSystem();

      console.log('\n🎉 Portfolio RAG population completed successfully!');
      console.log('💡 Your chatbot is now ready to answer questions about your portfolio.');
      
    } catch (error) {
      console.error('❌ RAG population failed:', error);
      process.exit(1);
    }
  }
}

// Run the populator
const populator = new PortfolioRAGPopulator();
populator.run();
