export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ResponsiveImageSource {
  src: string;
  width: number;
}

export interface StoryStage {
  title: string;
  description: string;
  image?: ProjectImage;
}

export interface ProjectItem {
  slug: string;
  legacySlugs?: string[];
  title: string;
  description: string;
  overview?: string;
  categories: string[];
  services: string[];
  year: number | null;
  datePublished?: string;
  tags: string[];
  tools: string[];
  cover: string;
  coverAlt: string;
  coverSources?: ResponsiveImageSource[];
  coverFit?: 'cover' | 'contain';
  gallery: ProjectImage[];
  sceneSequence?: ProjectImage[];
  storyEyebrow?: string;
  storyTitle?: string;
  storyStages?: StoryStage[];
  externalUrl?: string | null;
  featured: boolean;
  grid?: 'wide' | 'portrait' | 'square';
}

export interface ServiceItem {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  index: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  org: string;
}
