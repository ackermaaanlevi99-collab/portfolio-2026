export interface HeroContent {
  eyebrow: string;
  title: string;
  highlightWord?: string;
  subtitle: string;
  primaryButton: { label: string; href: string };
  secondaryButton: { label: string; href: string };
  scrollIndicator: string;
  background: { type: string; image?: string; video?: string };
}

export interface Service {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  image?: string | null;
  gif?: string | null;
  button?: { label: string; href: string };
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  category: string;
  year: string;
  tags: string[];
  thumbnail: string;
  cover: string;
  gallery: string[];
  gif?: string | null;
  video?: string | null;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets?: string[];
}

export interface AboutContent {
  name: string;
  role: string;
  story: string;
  experience: ExperienceItem[];
  skills: string[];
  education?: { title: string; institution: string }[];
}

export interface Client {
  name: string;
  logo?: string | null;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactContent {
  heading: string;
  subheading: string;
  email: string;
  phone: string;
  whatsappUrl: string;
  behance: string;
  location: string;
  formOptions: { services: string[] };
}
