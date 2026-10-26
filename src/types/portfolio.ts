export type ThemeId =
  | 'midnight-violet'
  | 'cinema-noir'
  | 'cyber-reel'
  | 'swiss-monograph'
  | 'nordic-paper';

export type FontPairingId =
  | 'outfit-jakarta'
  | 'fraunces-jakarta'
  | 'bricolage-jakarta'
  | 'mono-bricolage';

export type WorksLayoutId = 'showcase-4col' | 'bento' | 'editorial-index';

export type HeroLayoutId = 'split-showcase' | 'editorial-monograph';

export type SectionId = 'works' | 'capabilities' | 'experience' | 'testimonials' | 'contact';

export type VisualMotifId =
  | 'spatial-controller'
  | 'swiss-editorial'
  | 'modular-synth'
  | 'nordic-pavilion'
  | 'chrono-optics'
  | 'kinetic-grid';

export type ServiceIconId =
  | 'film'
  | 'sparkles'
  | 'layers'
  | 'palette'
  | 'sliders'
  | 'headphones'
  | 'check-list'
  | 'book-open';

export interface StylePresetCombo {
  id: string;
  name: string;
  tagline: string;
  theme: ThemeId;
  fontPairing: FontPairingId;
  accentColor: string;
  fontBadgeLabel: string;
  palettePreview: [string, string, string];
}

export interface PortfolioMetric {
  id: string;
  value: string;
  label: string;
  context: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitleLabel: string;
  client: string;
  year: string;
  category: string;
  role: string;
  duration?: string;
  featured: boolean;
  summary: string;
  challenge: string;
  outcome: string;
  impactMetric: string;
  liveUrl: string;
  motif: VisualMotifId;
  customImageUrl?: string;
  customVideoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  highlights: string;
}

export interface CapabilityItem {
  id: string;
  index: string;
  icon: ServiceIconId;
  title: string;
  description: string;
  deliverables: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  outcome: string;
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  visible: boolean;
}

export interface PortfolioConfig {
  identity: {
    brandMark: string;
    fullName: string;
    roleKicker: string;
    headline: string;
    subheadline: string;
    location: string;
    availability: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    xUrl: string;
    ctaLabel: string;
    showreelDuration: string;
    portraitMotif: VisualMotifId;
    customPortraitUrl?: string;
    customShowreelVideoUrl?: string;
  };
  design: {
    stylePresetId: string;
    theme: ThemeId;
    fontPairing: FontPairingId;
    worksLayout: WorksLayoutId;
    heroLayout: HeroLayoutId;
    accentColor: string;
    showMarqueeDivider: boolean;
  };
  sections: SectionConfig[];
  metrics: PortfolioMetric[];
  projects: PortfolioProject[];
  capabilities: CapabilityItem[];
  experience: ExperienceItem[];
  testimonials: TestimonialItem[];
}

export interface ProjectDraftInput {
  title: string;
  subtitleLabel?: string;
  client: string;
  year: string;
  category: string;
  role: string;
  duration?: string;
  featured: boolean;
  summary: string;
  challenge: string;
  outcome: string;
  impactMetric: string;
  liveUrl: string;
  motif: VisualMotifId;
  customImageUrl?: string;
  customVideoUrl?: string;
}
