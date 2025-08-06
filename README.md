# Rohit Deshpande - Portfolio Website

This repository contains the source code for the personal portfolio website of Rohit Deshpande, a Computer Engineering student at K.J. Somaiya College of Engineering. The website is designed to showcase academic achievements, technical skills, professional experience, and selected projects. It features a modern, responsive design and an integrated AI-powered chatbot that can answer questions about the portfolio content.

## Project Overview

The portfolio website is built using Astro, TypeScript, and TailwindCSS. It is structured as a single-page application with multiple sections, including About, Education, Experience, Projects, Skills, and Contact. The site is optimized for performance, accessibility, and search engine visibility.

### Key Features

- AI-powered chatbot with multi-provider support (OpenAI GPT-4, Groq Llama3, and local Ollama)
- Fallback system for chatbot responses (External AI, Local LLM, Pattern Matching, Default)
- Context-aware AI that understands the portfolio content and background
- Responsive, mobile-first design with a clean and professional interface
- Dark mode support and accessible color schemes
- Interactive project showcase with live demos and source code links
- Secure environment variable management for API keys

### Technology Stack

- **Framework:** Astro (Static Site Generator)
- **Styling:** TailwindCSS
- **Language:** TypeScript
- **Icons:** Custom SVG icons
- **Deployment:** Vercel
- **AI Integration:** OpenAI GPT-4, Groq API, Local Ollama

### Portfolio Sections

1. Hero: Introduction and contact information
2. About: Background and motivation
3. Education: Academic history and timeline
4. Experience: Professional and internship experience
5. Projects: Selected projects with details and links
6. Skills: Technical skills and tools
7. Contact: Methods to connect

### Chatbot Capabilities

The integrated chatbot can answer questions about:

- Technical skills, programming languages, and tools
- Project details and achievements
- Professional and internship experience
- Academic background and performance
- Personal interests and career goals
- Contact information and social profiles

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/irohitdeshpande/portfolio-rohit-deshpande.git
cd portfolio-rohit-deshpande
pnpm install
```

Start the development server:

```bash
pnpm dev
```

### Environment Configuration

To enable AI chatbot features, create a `.env` file in the project root with the following variables:

```
OPENAI_API_KEY=your_openai_key_here
GROQ_API_KEY=your_groq_key_here
```

These keys are optional but recommended for enhanced chatbot responses.

### Available Commands

| Command         | Description                                 |
|-----------------|---------------------------------------------|
| pnpm install    | Install project dependencies                |
| pnpm dev        | Start the local development server           |
| pnpm build      | Build the production site to the ./dist/ dir |
| pnpm preview    | Preview the production build locally         |
| pnpm check      | Run Astro type checking                      |

## Performance and Accessibility

The website is optimized for fast load times, accessibility, and SEO. It follows best practices for responsive design, color contrast, and keyboard navigation. Performance metrics (such as Lighthouse scores) are consistently high.

## Contact

For questions, collaboration, or professional inquiries, please use one of the following methods:

- Email: rohitsdeshpande4work@gmail.com
- LinkedIn: https://www.linkedin.com/in/irohitdeshpande/
- GitHub: https://github.com/irohitdeshpande
- Instagram: https://www.instagram.com/irohitdeshpande/

## License

This project is open source and available under the MIT License.

---

To try the AI chatbot, visit the live website and click the chat icon. The chatbot can answer questions about the portfolio, projects, skills, and experience, using information from the site and AI providers.
