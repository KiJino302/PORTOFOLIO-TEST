import {
  PortfolioConfig,
  PortfolioProject,
  ProjectDraftInput,
  SectionConfig,
  SectionId,
  StylePresetCombo,
  ThemeId,
} from '../types/portfolio';

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  description: string;
  bgCanvas: string;
  bgSurface: string;
  bgElevated: string;
  bgIconBox: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderHairline: string;
  accentDefault: string;
  isDark: boolean;
}

export const THEME_PRESETS: Record<ThemeId, ThemeTokens> = {
  'midnight-violet': {
    id: 'midnight-violet',
    name: 'Midnight Violet Studio',
    description: 'Deep nocturnal obsidian canvas with pitch-black cards and electric violet accents.',
    bgCanvas: '#0B0914',
    bgSurface: '#050508',
    bgElevated: '#141122',
    bgIconBox: '#1C1929',
    textPrimary: '#FFFFFF',
    textSecondary: '#D4D4D8',
    textMuted: '#9CA3AF',
    borderHairline: '#1F1B2E',
    accentDefault: '#9B6BFF',
    isDark: true,
  },
  'cinema-noir': {
    id: 'cinema-noir',
    name: 'Cinema Noir & Gold',
    description: '35mm projection room carbon black with warm anamorphic amber-gold highlights.',
    bgCanvas: '#09090B',
    bgSurface: '#121215',
    bgElevated: '#18181C',
    bgIconBox: '#1F1F26',
    textPrimary: '#FAFAFA',
    textSecondary: '#D4D4D8',
    textMuted: '#8E8E99',
    borderHairline: '#27272A',
    accentDefault: '#F2B705',
    isDark: true,
  },
  'cyber-reel': {
    id: 'cyber-reel',
    name: 'Cobalt Motion Lab',
    description: 'Dark color-grading suite slate with luminous sky-cobalt grading accents.',
    bgCanvas: '#070B14',
    bgSurface: '#0D1322',
    bgElevated: '#151E32',
    bgIconBox: '#1A243B',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    borderHairline: '#1E293B',
    accentDefault: '#38BDF8',
    isDark: true,
  },
  'swiss-monograph': {
    id: 'swiss-monograph',
    name: 'Swiss Editorial Paper',
    description: 'Warm archival paper with stark editorial ink and cinnabar red focal accents.',
    bgCanvas: '#FAF8F5',
    bgSurface: '#FFFFFF',
    bgElevated: '#F2EFE9',
    bgIconBox: '#F2EFE9',
    textPrimary: '#111110',
    textSecondary: '#3D3B38',
    textMuted: '#6E6B65',
    borderHairline: '#E4E0D8',
    accentDefault: '#D92B2B',
    isDark: false,
  },
  'nordic-paper': {
    id: 'nordic-paper',
    name: 'Nordic Gallery White',
    description: 'Crisp studio daylight canvas with clean zinc cards and emerald pine accent.',
    bgCanvas: '#F8FAFC',
    bgSurface: '#FFFFFF',
    bgElevated: '#F1F5F9',
    bgIconBox: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    borderHairline: '#E2E8F0',
    accentDefault: '#0F766E',
    isDark: false,
  },
};

/**
 * Library of 5 predefined one-click Color Palette + Typography Combinations
 */
export const STYLE_PRESET_LIBRARY: StylePresetCombo[] = [
  {
    id: 'preset-violet-studio',
    name: 'Midnight Violet Studio',
    tagline: 'Obsidian canvas + Electric Violet + Outfit Geometric Sans',
    theme: 'midnight-violet',
    fontPairing: 'outfit-jakarta',
    accentColor: '#9B6BFF',
    fontBadgeLabel: 'Outfit + Jakarta Sans',
    palettePreview: ['#0B0914', '#050508', '#9B6BFF'],
  },
  {
    id: 'preset-cinema-noir',
    name: '35mm Cinema Noir',
    tagline: 'Carbon darkroom + Anamorphic Gold + Fraunces Editorial Serif',
    theme: 'cinema-noir',
    fontPairing: 'fraunces-jakarta',
    accentColor: '#F2B705',
    fontBadgeLabel: 'Fraunces + Jakarta Sans',
    palettePreview: ['#09090B', '#121215', '#F2B705'],
  },
  {
    id: 'preset-motion-cobalt',
    name: 'Motion Colorist Slate',
    tagline: 'Deep grading slate + Luminous Cyan + Bricolage Grotesque',
    theme: 'cyber-reel',
    fontPairing: 'bricolage-jakarta',
    accentColor: '#38BDF8',
    fontBadgeLabel: 'Bricolage + Jakarta Sans',
    palettePreview: ['#070B14', '#0D1322', '#38BDF8'],
  },
  {
    id: 'preset-swiss-editorial',
    name: 'Swiss Design Monograph',
    tagline: 'Warm archival paper + Cinnabar Red + Bricolage Grotesque',
    theme: 'swiss-monograph',
    fontPairing: 'bricolage-jakarta',
    accentColor: '#D92B2B',
    fontBadgeLabel: 'Bricolage + Jakarta Sans',
    palettePreview: ['#FAF8F5', '#FFFFFF', '#D92B2B'],
  },
  {
    id: 'preset-nordic-minimal',
    name: 'Nordic Daylight Atelier',
    tagline: 'Alabaster white + Pine Emerald + Technical Mono Headers',
    theme: 'nordic-paper',
    fontPairing: 'mono-bricolage',
    accentColor: '#0F766E',
    fontBadgeLabel: 'JetBrains Mono + Jakarta',
    palettePreview: ['#F8FAFC', '#FFFFFF', '#0F766E'],
  },
];

export function applyStylePreset(
  config: PortfolioConfig,
  presetId: string
): PortfolioConfig {
  const found = STYLE_PRESET_LIBRARY.find((p) => p.id === presetId);
  if (!found) return config;

  return {
    ...config,
    design: {
      ...config.design,
      stylePresetId: found.id,
      theme: found.theme,
      fontPairing: found.fontPairing,
      accentColor: found.accentColor,
    },
  };
}

export const ARCHETYPE_TEMPLATES: Record<
  string,
  { label: string; subtitle: string; config: PortfolioConfig }
> = {
  'video-designer': {
    label: 'Video Editor & Visual Designer',
    subtitle: 'Commercial edits, motion graphics, color grading & brand design',
    config: {
      identity: {
        brandMark: 'Alex Rivera',
        fullName: 'Alex Rivera',
        roleKicker: 'Senior Video Editor & Motion Designer · Los Angeles & Remote',
        headline: 'Crafting high-retention commercial edits, kinetic design systems, and cinematic visual stories.',
        subheadline:
          'Dedicated templates, cuts, and visual design direction for every creative discipline. Blending frame-accurate rhythmic editing, 3D motion graphics, and bold brand identity.',
        location: 'Los Angeles, CA · PST (UTC-8)',
        availability: 'Available for Commercial Edits & Design Retainers',
        email: 'alex@riverastudio.tv',
        githubUrl: 'https://vimeo.com',
        linkedinUrl: 'https://linkedin.com',
        xUrl: 'https://x.com',
        ctaLabel: 'Book Edit Suite',
        showreelDuration: '02:14 Showreel (4K 60fps)',
        portraitMotif: 'modular-synth',
      },
      design: {
        stylePresetId: 'preset-violet-studio',
        theme: 'midnight-violet',
        fontPairing: 'outfit-jakarta',
        worksLayout: 'showcase-4col',
        heroLayout: 'split-showcase',
        accentColor: '#9B6BFF',
        showMarqueeDivider: true,
      },
      sections: [
        { id: 'works', label: 'Portfolios', visible: true },
        { id: 'capabilities', label: 'Services', visible: true },
        { id: 'experience', label: 'Credits', visible: true },
        { id: 'testimonials', label: 'Reviews', visible: true },
        { id: 'contact', label: 'Contact', visible: true },
      ],
      metrics: [
        {
          id: 'm1',
          value: '48M+',
          label: 'Total Campaign Views',
          context: 'Across commercial broadcast, YouTube flagships, and social launches',
        },
        {
          id: 'm2',
          value: '140+',
          label: 'Delivered Productions',
          context: 'Music videos, brand films, title sequences, and visual identities',
        },
        {
          id: 'm3',
          value: '4K HDR',
          label: 'Finishing Pipeline',
          context: 'DaVinci Resolve Studio color grading, ProRes 4444 & Dolby Atmos mix',
        },
        {
          id: 'm4',
          value: '48 hrs',
          label: 'First-Cut Turnaround',
          context: 'Streamlined frame.io review workflow with frame-accurate notes',
        },
      ],
      projects: [
        {
          id: 'proj-v1',
          title: 'Commercial Editing',
          subtitleLabel: 'Commercial Showreels',
          client: 'Nike & Sonos Global',
          year: '2026',
          category: 'Video Editing',
          role: 'Lead Offline & Rhythm Editor',
          duration: '01:45',
          featured: true,
          summary:
            'High-energy rhythmic assembly and sound-driven cuts for global product launch anthems shot on ARRI Alexa 35.',
          challenge:
            'Condensing 18 hours of raw multi-cam athlete footage into a 60-second broadcast spot with maximum retention.',
          outcome:
            'Delivered 14 aspect-ratio deliverables with percussion-locked transitions that achieved 84% completion rate.',
          impactMetric: '19.4M organic views in first 14 days · Vimeo Staff Pick',
          liveUrl: 'https://example.com/commercial-reel',
          motif: 'modular-synth',
        },
        {
          id: 'proj-v2',
          title: 'Motion Graphics',
          subtitleLabel: 'Kinetic & 3D Design',
          client: 'Apple Event & Stripe',
          year: '2026',
          category: 'Motion Design',
          role: 'Motion Director',
          duration: '02:10',
          featured: true,
          summary:
            'Bespoke 3D product explode sequences, HUD telemetry overlays, and kinetic typography systems rendered at 120fps.',
          challenge:
            'Explaining complex hardware architecture visually without relying on voiceover narration.',
          outcome:
            'Created tactile Cinema4D + Redshift shaders paired with razor-sharp After Effects typographic choreography.',
          impactMetric: '+165% viewer engagement across keynote broadcast segments',
          liveUrl: 'https://example.com/motion-graphics',
          motif: 'kinetic-grid',
        },
        {
          id: 'proj-v3',
          title: 'Brand Design',
          subtitleLabel: 'Design Portfolios',
          client: 'Atelier Aura & Monolith',
          year: '2025',
          category: 'Visual Design',
          role: 'Brand & Visual Designer',
          duration: 'Case Study',
          featured: false,
          summary:
            'Complete visual identity systems, custom geometric monograms, title card templates, and broadcast styleguides.',
          challenge:
            'Unifying static print typography and dynamic video lower-thirds under a single coherent grid.',
          outcome:
            'Shipped a modular motion & design toolkit enabling the client team to produce daily assets 4x faster.',
          impactMetric: 'Adopted across 12 international markets',
          liveUrl: 'https://example.com/brand-design',
          motif: 'chrono-optics',
        },
        {
          id: 'proj-v4',
          title: 'Color Grading',
          subtitleLabel: '35mm Film Look & DI',
          client: 'A24 Indie & Music Videos',
          year: '2025',
          category: 'Color & Finishing',
          role: 'Senior Colorist',
          duration: '03:20',
          featured: false,
          summary:
            'Photochemical Kodak 2383 print film emulation, halation modeling, and HDR Dolby Vision mastering in DaVinci Resolve.',
          challenge:
            'Matching mixed camera sensors (RED V-Raptor, Sony Venice, and 16mm film) across dusk exterior scenes.',
          outcome:
            'Developed a custom tetrahedral LUT pipeline preserving skin-tone roll-off and rich shadow density.',
          impactMetric: 'Official selection at SXSW & Tribeca Film Festival',
          liveUrl: 'https://example.com/color-grading',
          motif: 'swiss-editorial',
        },
        {
          id: 'proj-v5',
          title: 'Architecture & Spatial',
          subtitleLabel: 'Architecture Portfolios',
          client: 'Nordic Pavilion & Foster',
          year: '2025',
          category: 'Visual Design',
          role: 'Architectural Film Director',
          duration: '02:45',
          featured: false,
          summary:
            'Monochromatic architectural cinema and daylight studies capturing concrete, glass, and brutalist geometry.',
          challenge:
            'Conveying the quiet spatial scale of unbuilt and newly commissioned cultural pavilions.',
          outcome:
            'Combined FPV drone choreography with anamorphic tilt-shift photography and ambient spatial audio.',
          impactMetric: 'Featured in Architectural Digest & Dezeen',
          liveUrl: 'https://example.com/architecture-film',
          motif: 'nordic-pavilion',
        },
        {
          id: 'proj-v6',
          title: 'Sound & Rhythm Cut',
          subtitleLabel: 'Audio-Visual Mastering',
          client: 'Boiler Room & Teenage Eng.',
          year: '2025',
          category: 'Video Editing',
          role: 'Editor & Sound Designer',
          duration: '01:30',
          featured: false,
          summary:
            'Binaural foley synthesis, sub-bass risers, and frame-locked transient cutting for electronic music hardware.',
          challenge:
            'Making miniature synthesizer hardware feel monumental on mobile and desktop speakers.',
          outcome:
            'Layered custom analog synth stems with macro optical lens transitions.',
          impactMetric: '3.8M views on Instagram Reels & YouTube Shorts',
          liveUrl: 'https://example.com/sound-design',
          motif: 'spatial-controller',
        },
        {
          id: 'proj-v7',
          title: 'Title Sequences',
          subtitleLabel: 'Editorial Typography',
          client: 'Netflix Documentary Series',
          year: '2024',
          category: 'Motion Design',
          role: 'Title Designer',
          duration: '01:15',
          featured: false,
          summary:
            'Main-on-end archival title sequences blending tactile paper scans, micro-typography, and optical camera blurs.',
          challenge:
            'Setting the emotional tone for a 6-part investigative series in under 75 seconds.',
          outcome:
            'Crafted an iconic title sequence with a 96% non-skip viewer retention rate.',
          impactMetric: 'Shortlisted for SXSW Title Design Award',
          liveUrl: 'https://example.com/title-sequences',
          motif: 'swiss-editorial',
        },
        {
          id: 'proj-v8',
          title: 'Social & Vertical Reels',
          subtitleLabel: 'Portfolios for Creatives',
          client: 'Red Bull Media & Porsche',
          year: '2024',
          category: 'Video Editing',
          role: 'Lead Short-Form Editor',
          duration: '00:45',
          featured: false,
          summary:
            'Hook-driven 9:16 vertical storytelling, dynamic caption animation, and speed-ramped automotive sequences.',
          challenge:
            'Capturing viewer attention within the first 1.2 seconds without sacrificing premium brand aesthetics.',
          outcome:
            'Engineered a signature speed-ramp and motion-blur language tailored for 120Hz OLED mobile screens.',
          impactMetric: '+310% average share rate across 24 campaign reels',
          liveUrl: 'https://example.com/social-reels',
          motif: 'kinetic-grid',
        },
      ],
      capabilities: [
        {
          id: 'cap-1',
          index: '01.',
          icon: 'film',
          title: 'Offline & Rhythm Editing',
          description:
            'Story-first assembly, pacing, and narrative structure for commercials, documentaries, and brand anthems.',
          deliverables: 'Premiere Pro · DaVinci Resolve · Avid Media Composer',
        },
        {
          id: 'cap-2',
          index: '02.',
          icon: 'sparkles',
          title: '2D/3D Motion Graphics',
          description:
            'Kinetic typography, 3D product visualizations, compositing, and custom broadcast motion templates.',
          deliverables: 'After Effects · Cinema 4D · Redshift',
        },
        {
          id: 'cap-3',
          index: '03.',
          icon: 'palette',
          title: 'Color Grading & Look Dev',
          description:
            '35mm film emulation, shot matching, HDR mastering, and bespoke show LUT creation for cinema & web.',
          deliverables: 'DaVinci Resolve Studio · Dehancer · ACES Pipeline',
        },
        {
          id: 'cap-4',
          index: '04.',
          icon: 'layers',
          title: 'Brand & Visual Design',
          description:
            'Art direction, thumbnail systems, pitch decks, and cohesive design languages across video and web.',
          deliverables: 'Figma · Typography Systems · Creative Direction',
        },
        {
          id: 'cap-5',
          index: '05.',
          icon: 'headphones',
          title: 'Sound Design & Mixing',
          description:
            'Foley layering, custom whooshes/risers, dialogue cleanup, and LUFS broadcast loudness mastering.',
          deliverables: 'Logic Pro · iZotope RX · Spatial Audio',
        },
        {
          id: 'cap-6',
          index: '06.',
          icon: 'sliders',
          title: 'Multi-Format Delivery',
          description:
            'Automated 16:9, 9:16, 4:5, and 1:1 smart re-framing with burned-in dynamic captions and clean masters.',
          deliverables: 'ProRes 4444 · H.265 · Broadcast Masters',
        },
        {
          id: 'cap-7',
          index: '07.',
          icon: 'check-list',
          title: 'Frame.io Review Workflow',
          description:
            'Everything you need to review cuts step by step with timecode-pinned comments and instant version comparison.',
          deliverables: 'Frame.io C2C · Real-Time Revision Tracking',
        },
        {
          id: 'cap-8',
          index: '08.',
          icon: 'book-open',
          title: 'Creative Direction & Treatments',
          description:
            'Visual research, director treatments, storyboards, and pre-production lookbooks for agencies and artists.',
          deliverables: 'Pitch Decks · Storyboards · Shot Lists',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          period: '2023 — Present',
          role: 'Founder, Senior Video Editor & Motion Designer',
          organization: 'Rivera Post & Design Studio',
          location: 'Los Angeles & Remote',
          highlights:
            'Directing post-production, motion design, and visual identity for global commercial campaigns and flagship digital creators.',
        },
        {
          id: 'exp-2',
          period: '2020 — 2023',
          role: 'Lead Motion Designer & Editor',
          organization: 'Framewerk Creative Agency',
          location: 'New York, NY',
          highlights:
            'Edited and animated 85+ commercial spots, product launch films, and broadcast packages for tech and lifestyle brands.',
        },
        {
          id: 'exp-3',
          period: '2018 — 2020',
          role: 'Visual Designer & Junior Colorist',
          organization: 'Chroma Post House',
          location: 'Los Angeles, CA',
          highlights:
            'Designed main-on-end title sequences and assisted DI color grading on independent features and music videos.',
        },
      ],
      testimonials: [
        {
          id: 'test-1',
          quote:
            'Alex turned 14TB of raw multi-cam footage into our highest-performing commercial spot of the year in 72 hours. His sense of musical pacing and motion design polish is unmatched.',
          author: 'Marcus Vance',
          role: 'Executive Producer',
          organization: 'Pulse Cinema Collective',
          outcome: '19.4M campaign views and +165% average watch-through rate.',
        },
        {
          id: 'test-2',
          quote:
            'Rarely do you find a video editor who also thinks like a senior brand designer. Alex built our entire motion typography toolkit so every video feels unmistakably ours.',
          author: 'Elena Rostova',
          role: 'VP of Brand Creative',
          organization: 'Monolith Audio',
          outcome: '4x faster video production turnaround across 12 global markets.',
        },
      ],
    },
  },
  'design-engineer': {
    label: 'Design Engineer & Industrial Architect',
    subtitle: 'Hardware-software systems, spatial interfaces & editorial platforms',
    config: {
      identity: {
        brandMark: 'Soren Lindqvist',
        fullName: 'Soren Lindqvist',
        roleKicker: 'Principal Design Engineer · Stockholm & Zurich',
        headline: 'Architecting tactile interfaces, precision hardware ecosystems, and enduring digital monographs.',
        subheadline:
          'Over 11 years partnering with industrial design studios, foundational technology labs, and cultural institutions to translate complex mechanics into quiet, immediate human tools.',
        location: 'Stockholm, Sweden · CET (UTC+1)',
        availability: 'Booking Q1/Q2 Advisory & Principal Commissions',
        email: 'soren@atelier-lindqvist.se',
        githubUrl: 'https://github.com/sorenlindqvist',
        linkedinUrl: 'https://linkedin.com/in/sorenlindqvist',
        xUrl: 'https://x.com/sorenlindqvist',
        ctaLabel: 'Commission Inquiry',
        showreelDuration: 'Interactive Monograph',
        portraitMotif: 'spatial-controller',
      },
      design: {
        stylePresetId: 'preset-swiss-editorial',
        theme: 'swiss-monograph',
        fontPairing: 'bricolage-jakarta',
        worksLayout: 'bento',
        heroLayout: 'split-showcase',
        accentColor: '#D92B2B',
        showMarqueeDivider: true,
      },
      sections: [
        { id: 'works', label: 'Works', visible: true },
        { id: 'capabilities', label: 'Capabilities', visible: true },
        { id: 'experience', label: 'Experience', visible: true },
        { id: 'testimonials', label: 'Endorsements', visible: true },
        { id: 'contact', label: 'Contact', visible: true },
      ],
      metrics: [
        {
          id: 'm1',
          value: '14.2M+',
          label: 'Daily Active Devices',
          context: 'Running embedded tactile UI frameworks shipped across 2021–2026',
        },
        {
          id: 'm2',
          value: '+164%',
          label: 'Conversion Lift',
          context: 'Average enterprise activation gain across 9 flagship product re-architectures',
        },
        {
          id: 'm3',
          value: '18',
          label: 'International Design Awards',
          context: 'Including Red Dot Best of the Best, iF Gold, and D&AD Graphite Pencil',
        },
        {
          id: 'm4',
          value: '99.98%',
          label: 'Frame Pacing Stability',
          context: 'Sub-8ms interaction latency across bespoke WebGL & embedded Rust surfaces',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Klangwerk Field Synthesizer',
          subtitleLabel: 'Hardware & Spatial UI',
          client: 'Klangwerk Audio GmbH',
          year: '2026',
          category: 'Hardware & UI',
          role: 'Lead Industrial & Interaction Architect',
          duration: 'Hardware',
          featured: true,
          summary:
            'A machined anodized aluminum field workstation pairing rotary magnetic encoders with a 120Hz high-contrast OLED acousticograph.',
          challenge:
            'Musicians struggled with multi-layered menu diving on portable synthesizers under harsh stage and outdoor sunlight conditions.',
          outcome:
            'Engineered a zero-depth parameter mapping system where every physical encoder gesture projects real-time harmonic envelopes at 120fps.',
          impactMetric: '42,000 units sold in first 90 days · Red Dot Best of the Best 2026',
          liveUrl: 'https://klangwerk.example.com/field-console',
          motif: 'modular-synth',
        },
        {
          id: 'proj-2',
          title: 'Kunsthalle Basel Archive',
          subtitleLabel: 'Editorial Monographs',
          client: 'Kunsthalle Basel',
          year: '2025',
          category: 'Editorial & Web',
          role: 'Principal Design Technologist',
          duration: 'Archive',
          featured: false,
          summary:
            'An archival exhibition publishing system indexing 48,000 high-resolution plates, curatorial essays, and spatial floorplans.',
          challenge:
            'Decades of exhibition catalogues were trapped in static PDFs with slow load times and fragmented citation metadata.',
          outcome:
            'Built a keyboard-first Swiss grid reader with instant deep-zoom plate inspection and automated bibliographic export.',
          impactMetric: '+210% average session duration (11m 40s) across 650k researchers',
          liveUrl: 'https://archive.kunsthalle.example.ch',
          motif: 'swiss-editorial',
        },
        {
          id: 'proj-3',
          title: 'Vektor Spatial Optics',
          subtitleLabel: 'Autonomous Controllers',
          client: 'Vektor Robotics AG',
          year: '2025',
          category: 'Hardware & UI',
          role: 'Design Systems Lead',
          duration: 'Robotics',
          featured: false,
          summary:
            'Precision inspection cockpit and tactile jog-wheel controller for sub-micron semiconductor wafer metrology.',
          challenge:
            'Cleanroom operators experienced high cognitive fatigue interpreting 14 simultaneous telemetry streams on legacy Windows interfaces.',
          outcome:
            'Consolidated anomaly detection into a calm monochromatic optical reticle with haptic detent feedback.',
          impactMetric: '-63% operator inspection error rate across 4 European fabrication plants',
          liveUrl: 'https://vektor-optics.example.ch',
          motif: 'spatial-controller',
        },
        {
          id: 'proj-4',
          title: 'Lysefjord Timber Pavilion',
          subtitleLabel: 'Architecture Portfolios',
          client: 'Snøhetta & Nordic Energy',
          year: '2024',
          category: 'Architecture & Spatial',
          role: 'Spatial Computing Director',
          duration: 'Spatial',
          featured: true,
          summary:
            'Architectural environmental twin and public visitor installation visualizing real-time geothermal and tidal energy harvesting.',
          challenge:
            'Visitors and municipal planners needed an intuitive way to understand how the pavilion produces 2.4x its annual energy footprint.',
          outcome:
            'Created a serene architectural cross-section simulation driven by live environmental sensors mounted in the fjord.',
          impactMetric: '380,000 onsite visitors · Featured at Venice Architecture Biennale',
          liveUrl: 'https://lysefjord-pavilion.example.no',
          motif: 'nordic-pavilion',
        },
      ],
      capabilities: [
        {
          id: 'cap-1',
          index: '01.',
          icon: 'sliders',
          title: 'Design Engineering & Tactile Systems',
          description:
            'Bridging industrial hardware controls, custom shaders, and zero-latency web applications with production-grade TypeScript, Rust, and WebGL.',
          deliverables: 'Interactive Prototypes · Production Component Libraries',
        },
        {
          id: 'cap-2',
          index: '02.',
          icon: 'book-open',
          title: 'Editorial Direction & Digital Monographs',
          description:
            'Translating complex research, institutional archives, and flagship product launches into authoritative, high-retention editorial publications.',
          deliverables: 'Bespoke Typography Systems · Archival Search Interfaces',
        },
        {
          id: 'cap-3',
          index: '03.',
          icon: 'layers',
          title: 'Multi-Surface Design Systems',
          description:
            'Establishing governed token architectures, WCAG AAA accessibility compliance, and spatial math rules across desktop, mobile, and hardware displays.',
          deliverables: 'Design Token Pipelines · Cross-Platform UI Kits',
        },
        {
          id: 'cap-4',
          index: '04.',
          icon: 'sparkles',
          title: 'Spatial & Shader Prototyping',
          description:
            'Real-time optical reticles, custom acousticographs, and hardware-accelerated canvas instruments.',
          deliverables: 'WebGL Shaders · Hardware Telemetry Consoles',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          period: '2023 — Present',
          role: 'Founder & Principal Design Engineer',
          organization: 'Atelier Lindqvist',
          location: 'Stockholm & Zurich',
          highlights:
            'Leading bespoke hardware-software interfaces and flagship digital monographs for European robotics, audio, and cultural partners.',
        },
        {
          id: 'exp-2',
          period: '2019 — 2023',
          role: 'Staff Interaction Architect',
          organization: 'Teenage Acoustic Labs',
          location: 'Stockholm, Sweden',
          highlights:
            'Directed the embedded OLED interface architecture and companion web studio for 4 award-winning portable synthesizers.',
        },
      ],
      testimonials: [
        {
          id: 'test-1',
          quote:
            'Before Soren joined our hardware program, our synthesizer firmware felt like an oscilloscope manual. He unified our physical rotary encoders and OLED typography into an instrument musicians can play blindfolded.',
          author: 'Lukas Bergström',
          role: 'VP of Hardware Engineering',
          organization: 'Klangwerk Audio GmbH',
          outcome: 'Cut onboarding time from 45 minutes to under 3 minutes; 4.94/5 owner satisfaction score.',
        },
      ],
    },
  },
};

export function getContrastingButtonTextColor(hexColor: string): string {
  const clean = (hexColor || '').replace('#', '').trim();
  if (clean.length !== 6) return '#FFFFFF';
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.58 ? '#09090B' : '#FFFFFF';
}

export function getDefaultPortfolioConfig(): PortfolioConfig {
  return structuredClone(ARCHETYPE_TEMPLATES['video-designer'].config);
}

export function extractProjectCategories(projects: PortfolioProject[]): string[] {
  const seen = new Set<string>();
  for (const project of projects) {
    const trimmed = project.category.trim();
    if (trimmed) {
      seen.add(trimmed);
    }
  }
  return ['All Works', ...Array.from(seen)];
}

export function filterProjectsByCategory(
  projects: PortfolioProject[],
  selectedCategory: string,
  searchQuery = ''
): PortfolioProject[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return projects.filter((proj) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'All Works' ||
      proj.category.toLowerCase() === selectedCategory.toLowerCase();

    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    return (
      proj.title.toLowerCase().includes(normalizedQuery) ||
      proj.client.toLowerCase().includes(normalizedQuery) ||
      proj.summary.toLowerCase().includes(normalizedQuery) ||
      proj.category.toLowerCase().includes(normalizedQuery) ||
      (proj.subtitleLabel && proj.subtitleLabel.toLowerCase().includes(normalizedQuery))
    );
  });
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateProjectDraft(draft: ProjectDraftInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!draft.title || draft.title.trim().length < 3) {
    errors.title = 'Project title must be at least 3 characters.';
  }
  if (!draft.client || draft.client.trim().length < 2) {
    errors.client = 'Client or studio name is required.';
  }
  if (!draft.category || draft.category.trim().length < 2) {
    errors.category = 'Category is required (e.g., Video Editing).';
  }
  if (!draft.year || !/^\d{4}$/.test(draft.year.trim())) {
    errors.year = 'Enter a valid 4-digit year (e.g., 2026).';
  }
  if (!draft.summary || draft.summary.trim().length < 10) {
    errors.summary = 'Provide a concise summary (at least 10 characters).';
  }
  if (!draft.impactMetric || draft.impactMetric.trim().length < 4) {
    errors.impactMetric = 'Include a concrete outcome or metric.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function addProjectToConfig(
  config: PortfolioConfig,
  draft: ProjectDraftInput,
  customId?: string
): { config: PortfolioConfig; validation: ValidationResult } {
  const validation = validateProjectDraft(draft);
  if (!validation.valid) {
    return { config, validation };
  }

  const newProject: PortfolioProject = {
    id: customId || `proj-${Date.now()}`,
    title: draft.title.trim(),
    subtitleLabel: draft.subtitleLabel?.trim() || `${draft.category.trim()} Portfolio`,
    client: draft.client.trim(),
    year: draft.year.trim(),
    category: draft.category.trim(),
    role: draft.role.trim() || 'Lead Editor & Designer',
    duration: draft.duration?.trim() || '01:30',
    featured: Boolean(draft.featured),
    summary: draft.summary.trim(),
    challenge:
      draft.challenge.trim() ||
      'Delivering high-retention visual storytelling and cohesive design across formats.',
    outcome:
      draft.outcome.trim() ||
      'Produced a frame-accurate edit and motion system with measurable audience lift.',
    impactMetric: draft.impactMetric.trim(),
    liveUrl: draft.liveUrl.trim() || 'https://example.com',
    motif: draft.motif || 'modular-synth',
    customImageUrl: draft.customImageUrl?.trim() || undefined,
    customVideoUrl: draft.customVideoUrl?.trim() || undefined,
  };

  return {
    config: {
      ...config,
      projects: [newProject, ...config.projects],
    },
    validation,
  };
}

export function detectMediaUrlKind(urlOrMime: string): 'video' | 'image' {
  const lower = (urlOrMime || '').trim().toLowerCase();
  if (
    lower.startsWith('data:video/') ||
    lower.startsWith('video/') ||
    /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/.test(lower)
  ) {
    return 'video';
  }
  return 'image';
}

export function updateProjectMedia(
  config: PortfolioConfig,
  projectId: string,
  media: { customImageUrl?: string; customVideoUrl?: string }
): PortfolioConfig {
  return {
    ...config,
    projects: config.projects.map((proj) =>
      proj.id === projectId
        ? {
            ...proj,
            customImageUrl: media.customImageUrl,
            customVideoUrl: media.customVideoUrl,
          }
        : proj
    ),
  };
}

export function moveSectionOrder(
  sections: SectionConfig[],
  sectionId: SectionId,
  direction: 'up' | 'down'
): SectionConfig[] {
  const index = sections.findIndex((s) => s.id === sectionId);
  if (index === -1) return sections;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= sections.length) return sections;

  const copy = [...sections];
  const [moved] = copy.splice(index, 1);
  copy.splice(targetIndex, 0, moved);
  return copy;
}

export function toggleSectionVisibility(
  sections: SectionConfig[],
  sectionId: SectionId
): SectionConfig[] {
  return sections.map((sec) =>
    sec.id === sectionId ? { ...sec, visible: !sec.visible } : sec
  );
}

export function parseImportedPortfolioJson(rawJson: string): {
  config?: PortfolioConfig;
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.identity ||
      typeof parsed.identity.fullName !== 'string' ||
      !parsed.design ||
      !Array.isArray(parsed.projects) ||
      !Array.isArray(parsed.sections)
    ) {
      return {
        error: 'Invalid portfolio schema: missing identity, design, sections, or projects array.',
      };
    }
    return { config: parsed as PortfolioConfig };
  } catch (err) {
    return {
      error: err instanceof Error ? `JSON syntax error: ${err.message}` : 'Failed to parse JSON.',
    };
  }
}

export function generateStandalonePortfolioHtml(config: PortfolioConfig): string {
  const theme = THEME_PRESETS[config.design.theme] || THEME_PRESETS['midnight-violet'];
  const accent = config.design.accentColor || theme.accentDefault;
  const btnText = getContrastingButtonTextColor(accent);
  const visibleSections = new Set(
    config.sections.filter((s) => s.visible).map((s) => s.id)
  );

  const escapeHtml = (str: string) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const projectsHtml = config.projects
    .map(
      (p) => `
      <article class="card">
        <div class="meta">${escapeHtml(p.category)} · ${escapeHtml(p.year)} · ${escapeHtml(p.client)}</div>
        <h3>${escapeHtml(p.title)}</h3>
        <div class="subtitle">${escapeHtml(p.subtitleLabel)}</div>
        <p>${escapeHtml(p.summary)}</p>
        <div class="metric">${escapeHtml(p.impactMetric)}</div>
      </article>`
    )
    .join('\n');

  const capabilitiesHtml = config.capabilities
    .map(
      (c) => `
      <div class="card">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.description)}</p>
      </div>`
    )
    .join('\n');

  const experienceHtml = config.experience
    .map(
      (e) => `
      <div class="exp-row">
        <div class="exp-period">${escapeHtml(e.period)}</div>
        <div>
          <h4>${escapeHtml(e.role)} — ${escapeHtml(e.organization)}</h4>
          <div class="meta">${escapeHtml(e.location)}</div>
          <p>${escapeHtml(e.highlights)}</p>
        </div>
      </div>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(config.identity.fullName)} — ${escapeHtml(config.identity.roleKicker)}</title>
  <style>
    :root {
      --bg: ${theme.bgCanvas};
      --surface: ${theme.bgSurface};
      --text: ${theme.textPrimary};
      --muted: ${theme.textMuted};
      --border: ${theme.borderHairline};
      --accent: ${accent};
      --btn-text: ${btnText};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif;
      line-height: 1.6;
      padding: 0 24px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 24px 0; border-bottom: 1px solid var(--border);
    }
    .hero { padding: 72px 0 48px; border-bottom: 1px solid var(--border); }
    .kicker { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
    h1 { font-size: clamp(2.25rem, 4vw, 3.5rem); line-height: 1.1; margin-bottom: 20px; max-width: 24ch; }
    .sub { font-size: 18px; color: var(--muted); max-width: 65ch; margin-bottom: 32px; }
    .btn {
      display: inline-block; background: var(--accent); color: var(--btn-text);
      padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600;
    }
    .metrics {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px; padding: 36px 0; border-bottom: 1px solid var(--border);
    }
    .metric-val { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; }
    section { padding: 64px 0; border-bottom: 1px solid var(--border); }
    h2 { font-size: 28px; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
    .card { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; }
    .meta { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
    .subtitle { font-size: 13px; color: var(--accent); font-weight: 600; margin-bottom: 8px; }
    .card h3 { font-size: 18px; margin-bottom: 6px; }
    .metric { margin-top: 16px; font-size: 13px; font-weight: 600; color: var(--accent); }
    .exp-row { display: grid; grid-template-columns: 180px 1fr; gap: 24px; padding: 20px 0; border-top: 1px solid var(--border); }
    footer { padding: 48px 0; font-size: 13px; color: var(--muted); display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <strong>${escapeHtml(config.identity.brandMark)}</strong>
      <a class="btn" href="mailto:${escapeHtml(config.identity.email)}">${escapeHtml(config.identity.ctaLabel)}</a>
    </header>
    <div class="hero">
      <div class="kicker">${escapeHtml(config.identity.roleKicker)} · ${escapeHtml(config.identity.availability)}</div>
      <h1>${escapeHtml(config.identity.headline)}</h1>
      <p class="sub">${escapeHtml(config.identity.subheadline)}</p>
      <a class="btn" href="mailto:${escapeHtml(config.identity.email)}">${escapeHtml(config.identity.ctaLabel)}</a>
    </div>
    <div class="metrics">
      ${config.metrics
        .map(
          (m) => `<div><div class="metric-val">${escapeHtml(m.value)}</div><strong>${escapeHtml(m.label)}</strong><div class="meta">${escapeHtml(m.context)}</div></div>`
        )
        .join('')}
    </div>
    ${visibleSections.has('works') ? `<section id="works"><h2>Selected Portfolios & Showreels</h2><div class="grid">${projectsHtml}</div></section>` : ''}
    ${visibleSections.has('capabilities') ? `<section id="capabilities"><h2>Services & Creative Toolkit</h2><div class="grid">${capabilitiesHtml}</div></section>` : ''}
    ${visibleSections.has('experience') ? `<section id="experience"><h2>Credits & Experience</h2>${experienceHtml}</section>` : ''}
    <footer>
      <span>© ${new Date().getFullYear()} ${escapeHtml(config.identity.fullName)}. All rights reserved.</span>
      <span>${escapeHtml(config.identity.location)}</span>
    </footer>
  </div>
</body>
</html>`;
}
