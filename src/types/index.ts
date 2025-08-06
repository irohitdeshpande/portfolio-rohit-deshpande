export interface SiteConfig extends HeaderProps {
  title: string;
  description: string;
  lang: string;
  author: string;
  socialLinks: { text: string; href: string }[];
  socialImage: string;
  canonicalURL?: string;
}

export interface SiteContent {
  hero: HeroProps;
  about: AboutProps;
  education: EducationProps[];
  experience: ExperienceProps[];
  projects: ProjectProps[];
  contact: ContactProps;
  chatbot: ChatbotQA[];
}

export interface HeroProps {
  name: string;
  specialty: string;
  summary: string;
  email: string;
  resume?: string;
  heroImage: string;
}

export interface ExperienceProps {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string | string[];
  image?: string;
}

export interface ProjectProps {
  name: string;
  summary: string;
  image: string;
  date?: string;
  techStack?: string[];
  tags?: string[];
  linkPreview?: string;
  linkSource?: string;
}

export interface AboutProps {
  description: string;
  image: string;
}

export interface HeaderProps {
  siteLogo: string;
  navLinks: { text: string; href: string }[];
}

export interface EducationProps {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade?: string;
  image?: string;
}

export interface ContactProps {
  email: string;
  phone?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export interface ChatbotQA {
  question: string;
  answer: string;
}

