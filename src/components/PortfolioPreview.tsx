import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Send,
  Play,
  Film,
  Sparkles,
  Layers,
  Palette,
  Sliders,
  Headphones,
  ListChecks,
  BookOpen,
} from 'lucide-react';
import {
  FontPairingId,
  PortfolioConfig,
  PortfolioProject,
  SectionId,
  ServiceIconId,
} from '../types/portfolio';
import {
  THEME_PRESETS,
  extractProjectCategories,
  filterProjectsByCategory,
  getContrastingButtonTextColor,
} from '../utils/portfolioLogic';
import { ArchitecturalArtwork } from './ArchitecturalArtwork';
import { ProjectLightboxModal } from './ProjectLightboxModal';

interface PortfolioPreviewProps {
  config: PortfolioConfig;
}

export function getDisplayFontClass(pairing: FontPairingId): string {
  switch (pairing) {
    case 'fraunces-jakarta':
      return 'font-display-fraunces';
    case 'outfit-jakarta':
      return 'font-display-outfit';
    case 'mono-bricolage':
      return 'font-mono-jetbrains';
    case 'bricolage-jakarta':
    default:
      return 'font-display-bricolage';
  }
}

function renderServiceIcon(iconId: ServiceIconId, color: string) {
  const props = { className: 'w-5 h-5', style: { color } };
  switch (iconId) {
    case 'film':
      return <Film {...props} />;
    case 'sparkles':
      return <Sparkles {...props} />;
    case 'palette':
      return <Palette {...props} />;
    case 'layers':
      return <Layers {...props} />;
    case 'headphones':
      return <Headphones {...props} />;
    case 'sliders':
      return <Sliders {...props} />;
    case 'check-list':
      return <ListChecks {...props} />;
    case 'book-open':
    default:
      return <BookOpen {...props} />;
  }
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ config }) => {
  const {
    identity,
    design,
    sections,
    metrics,
    projects,
    capabilities,
    experience,
    testimonials,
  } = config;

  const theme = THEME_PRESETS[design.theme] || THEME_PRESETS['midnight-violet'];
  const accentColor = design.accentColor || theme.accentDefault;
  const accentTextColor = getContrastingButtonTextColor(accentColor);
  const displayFontClass = getDisplayFontClass(design.fontPairing);

  const [selectedCategory, setSelectedCategory] = useState<string>('All Works');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightboxProject, setActiveLightboxProject] =
    useState<PortfolioProject | null>(null);

  // Commission Inquiry Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [projectScope, setProjectScope] = useState('Commercial Video Edit & Finishing');
  const [messageBody, setMessageBody] = useState('');
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [submittedInquiries, setSubmittedInquiries] = useState<
    { id: string; name: string; scope: string; timestamp: string }[]
  >([]);

  const categories = extractProjectCategories(projects);
  const filteredProjects = filterProjectsByCategory(
    projects,
    selectedCategory,
    searchQuery
  );

  const visibleSections = sections.filter((s) => s.visible);

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !messageBody.trim()) {
      setInquiryError('Please complete your name, email, and project brief.');
      return;
    }
    setInquiryError(null);
    setSubmittedInquiries((prev) => [
      {
        id: `inq-${Date.now()}`,
        name: senderName.trim(),
        scope: projectScope,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
    setSenderName('');
    setSenderEmail('');
    setMessageBody('');
  };

  const renderSection = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'works':
        return (
          <section
            key="works"
            id="works"
            className="py-16 md:py-24 border-b"
            style={{ borderColor: theme.borderHairline }}
          >
            {/* Centered Editorial Header matching Reference Image 2 */}
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance mb-3 ${displayFontClass}`}
              >
                Dedicated cuts and visual design for every creative field
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: theme.textMuted }}
              >
                Explore curated commercial edits, motion graphics, color grading suites, and brand design systems. Click any card to inspect the full case study.
              </p>
            </div>

            {/* Interactive Category Filter Segmented Control + Search */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <div
                className="flex flex-wrap items-center gap-1 p-1 rounded-xl border"
                style={{
                  backgroundColor: theme.bgSurface,
                  borderColor: theme.borderHairline,
                }}
                role="group"
                aria-label="Filter projects by category"
              >
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className="px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      style={{
                        backgroundColor: isActive ? theme.bgElevated : 'transparent',
                        color: isActive ? theme.textPrimary : theme.textMuted,
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div>
                <label htmlFor="works-search" className="sr-only">
                  Filter works by keyword
                </label>
                <input
                  id="works-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reel or client..."
                  className="px-3.5 py-1.5 rounded-xl border text-xs focus:outline-none"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderHairline,
                    color: theme.textPrimary,
                  }}
                />
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div
                className="p-12 rounded-2xl border text-center"
                style={{
                  backgroundColor: theme.bgSurface,
                  borderColor: theme.borderHairline,
                }}
              >
                <p className="text-sm font-medium mb-3" style={{ color: theme.textSecondary }}>
                  No portfolio cards match the current filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All Works');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                  style={{ backgroundColor: accentColor, color: accentTextColor }}
                >
                  Reset Filter
                </button>
              </div>
            ) : design.worksLayout === 'showcase-4col' ? (
              /* 4-Column Media Showcase Cards matching Reference Image 2 */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group relative rounded-2xl overflow-hidden border aspect-4/3 transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: theme.bgSurface,
                      borderColor: theme.borderHairline,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveLightboxProject(project)}
                      aria-label={`Open ${project.title} — ${project.subtitleLabel || project.category}`}
                      className="w-full h-full block text-left relative cursor-pointer"
                    >
                      <ArchitecturalArtwork
                        motif={project.motif}
                        customImageUrl={project.customImageUrl}
                        customVideoUrl={project.customVideoUrl}
                        accentColor={accentColor}
                        isDark={true}
                        title={project.title}
                        subtitle={project.client}
                        className="w-full h-full"
                      />

                      {/* Measured Contrast Scrim for Bottom-Left Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />

                      {/* Subtle Top-Right Duration / Reel Indicator */}
                      {project.duration && (
                        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 text-[11px] font-mono-jetbrains text-white/80">
                          <Play className="w-3 h-3 fill-current" />
                          <span>{project.duration}</span>
                        </div>
                      )}

                      {/* Bottom-Left Bold Title + Colored Subtitle matching Reference Image 2 */}
                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <h3
                          className={`text-lg font-bold tracking-tight text-white leading-snug ${displayFontClass}`}
                        >
                          {project.title}
                        </h3>
                        <div
                          className="text-sm font-medium mt-0.5 truncate"
                          style={{ color: accentColor }}
                        >
                          {project.subtitleLabel || `${project.category} Portfolios`}
                        </div>
                      </div>
                    </button>
                  </article>
                ))}
              </div>
            ) : design.worksLayout === 'editorial-index' ? (
              /* Editorial Index List Layout */
              <div className="divide-y border-t border-b" style={{ borderColor: theme.borderHairline }}>
                {filteredProjects.map((project, idx) => (
                  <article
                    key={project.id}
                    className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center group"
                    style={{ borderColor: theme.borderHairline }}
                  >
                    <div className="lg:col-span-7 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: theme.textMuted }}>
                        <span className="font-mono-jetbrains">0{idx + 1}.</span>
                        <span>{project.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{project.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.client}</span>
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold tracking-tight ${displayFontClass}`}>
                        <button
                          type="button"
                          onClick={() => setActiveLightboxProject(project)}
                          className="text-left hover:underline cursor-pointer"
                        >
                          {project.title}
                        </button>
                      </h3>
                      <p className="text-sm leading-relaxed max-w-2xl" style={{ color: theme.textSecondary }}>
                        {project.summary}
                      </p>
                      <div className="pt-2 text-xs font-semibold tabular-nums" style={{ color: accentColor }}>
                        {project.impactMetric}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <button
                        type="button"
                        onClick={() => setActiveLightboxProject(project)}
                        aria-label={`Inspect case study: ${project.title}`}
                        className="block w-full rounded-xl overflow-hidden border aspect-16/10 cursor-pointer"
                        style={{ borderColor: theme.borderHairline }}
                      >
                        <ArchitecturalArtwork
                          motif={project.motif}
                          customImageUrl={project.customImageUrl}
                          customVideoUrl={project.customVideoUrl}
                          accentColor={accentColor}
                          isDark={theme.isDark}
                          title={project.title}
                          subtitle={`${project.client} · ${project.year}`}
                          className="w-full h-full"
                        />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Bento Grid Layout */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project) => {
                  const isWideBento = project.featured;
                  return (
                    <article
                      key={project.id}
                      className={`group rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                        isWideBento ? 'md:col-span-2' : 'md:col-span-1'
                      }`}
                      style={{
                        backgroundColor: theme.bgSurface,
                        borderColor: theme.borderHairline,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveLightboxProject(project)}
                        aria-label={`Inspect case study: ${project.title}`}
                        className={`w-full overflow-hidden border-b block text-left cursor-pointer ${
                          isWideBento ? 'aspect-21/9' : 'aspect-4/3'
                        }`}
                        style={{ borderColor: theme.borderHairline }}
                      >
                        <ArchitecturalArtwork
                          motif={project.motif}
                          customImageUrl={project.customImageUrl}
                          customVideoUrl={project.customVideoUrl}
                          accentColor={accentColor}
                          isDark={theme.isDark}
                          title={project.title}
                          subtitle={`${project.client} · ${project.year}`}
                          className="w-full h-full"
                        />
                      </button>

                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div
                            className="flex flex-wrap items-center gap-2 text-xs mb-2"
                            style={{ color: theme.textMuted }}
                          >
                            <span>{project.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{project.year}</span>
                            <span aria-hidden="true">·</span>
                            <span>{project.client}</span>
                          </div>

                          <h3
                            className={`text-xl md:text-2xl font-bold tracking-tight mb-2 text-balance ${displayFontClass}`}
                          >
                            <button
                              type="button"
                              onClick={() => setActiveLightboxProject(project)}
                              className="text-left hover:underline cursor-pointer"
                            >
                              {project.title}
                            </button>
                          </h3>

                          <p
                            className="text-sm leading-relaxed max-w-2xl"
                            style={{ color: theme.textSecondary }}
                          >
                            {project.summary}
                          </p>
                        </div>

                        <div
                          className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-4"
                          style={{ borderColor: theme.borderHairline }}
                        >
                          <span
                            className="text-xs font-semibold tabular-nums"
                            style={{ color: accentColor }}
                          >
                            {project.impactMetric}
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveLightboxProject(project)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0 hover:underline cursor-pointer"
                            style={{ color: theme.textPrimary }}
                          >
                            <span>Watch & Read</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );

      case 'capabilities':
        return (
          <section
            key="capabilities"
            id="capabilities"
            className="py-16 md:py-24 border-b"
            style={{ borderColor: theme.borderHairline }}
          >
            <div className="mb-10">
              <div className="text-xs mb-2" style={{ color: theme.textMuted }}>
                Post-Production & Design Capabilities
              </div>
              <h2
                className={`text-2xl md:text-4xl font-bold tracking-tight text-balance ${displayFontClass}`}
              >
                Services, Workflow & Studio Toolkit
              </h2>
            </div>

            {/* 4-Column Dark Rounded Cards with Top-Left Icon Box matching Reference Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {capabilities.map((cap) => (
                <div
                  key={cap.id}
                  className="p-6 rounded-2xl border flex flex-col justify-between transition-colors"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderHairline,
                  }}
                >
                  <div>
                    {/* Top-Left Rounded-XL Icon Container matching Reference Image 1 */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: theme.bgIconBox }}
                    >
                      {renderServiceIcon(cap.icon || 'film', accentColor)}
                    </div>

                    <h3
                      className={`text-lg font-bold tracking-tight mb-2.5 ${displayFontClass}`}
                      style={{ color: theme.textPrimary }}
                    >
                      {cap.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: theme.textMuted }}
                    >
                      {cap.description}
                    </p>
                  </div>

                  <div
                    className="mt-5 pt-3 border-t text-xs"
                    style={{
                      borderColor: theme.borderHairline,
                      color: theme.textSecondary,
                    }}
                  >
                    {cap.deliverables}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'experience':
        return (
          <section
            key="experience"
            id="experience"
            className="py-16 md:py-24 border-b"
            style={{ borderColor: theme.borderHairline }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <div className="text-xs mb-2" style={{ color: theme.textMuted }}>
                  Production Credits & Trajectory
                </div>
                <h2
                  className={`text-2xl md:text-4xl font-bold tracking-tight text-balance ${displayFontClass}`}
                >
                  Studio Experience & Credits
                </h2>
                <p
                  className="text-sm leading-relaxed mt-3"
                  style={{ color: theme.textMuted }}
                >
                  Editing and designing high-impact commercial campaigns, title sequences, and brand systems.
                </p>
              </div>

              <div className="lg:col-span-8 divide-y border-t border-b" style={{ borderColor: theme.borderHairline }}>
                {experience.map((item) => (
                  <div
                    key={item.id}
                    className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4"
                    style={{ borderColor: theme.borderHairline }}
                  >
                    <div
                      className="sm:col-span-4 text-xs font-mono-jetbrains tabular-nums"
                      style={{ color: theme.textMuted }}
                    >
                      <div>{item.period}</div>
                      <div className="mt-1">{item.location}</div>
                    </div>
                    <div className="sm:col-span-8">
                      <h3 className="text-base font-bold" style={{ color: theme.textPrimary }}>
                        {item.role} · <span style={{ color: accentColor }}>{item.organization}</span>
                      </h3>
                      <p
                        className="text-sm leading-relaxed mt-2"
                        style={{ color: theme.textSecondary }}
                      >
                        {item.highlights}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section
            key="testimonials"
            id="testimonials"
            className="py-16 md:py-24 border-b"
            style={{ borderColor: theme.borderHairline }}
          >
            <div className="mb-10">
              <div className="text-xs mb-2" style={{ color: theme.textMuted }}>
                Client & Producer Reviews
              </div>
              <h2
                className={`text-2xl md:text-4xl font-bold tracking-tight text-balance ${displayFontClass}`}
              >
                Endorsements from Producers & Creative Directors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <blockquote
                  key={t.id}
                  className="p-6 md:p-8 rounded-2xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderHairline,
                  }}
                >
                  <p
                    className={`text-base md:text-lg leading-relaxed mb-6 ${displayFontClass}`}
                    style={{ color: theme.textPrimary }}
                  >
                    “{t.quote}”
                  </p>
                  <footer className="pt-4 border-t" style={{ borderColor: theme.borderHairline }}>
                    <div className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                      {t.author}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                      {t.role} · {t.organization}
                    </div>
                    <div
                      className="text-xs font-semibold mt-2 tabular-nums"
                      style={{ color: accentColor }}
                    >
                      Verified Outcome: {t.outcome}
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        );

      case 'contact':
        return (
          <section
            key="contact"
            id="contact"
            className="py-16 md:py-24 border-b"
            style={{ borderColor: theme.borderHairline }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs" style={{ color: theme.textMuted }}>
                  Booking & Inquiries · {identity.availability}
                </div>
                <h2
                  className={`text-2xl md:text-4xl font-bold tracking-tight text-balance ${displayFontClass}`}
                >
                  Book Edit Suite or Design Retainer
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                  Share your project timeline, raw footage scope, or brand design brief for a same-day estimate.
                </p>

                <div className="pt-4 space-y-2 text-xs" style={{ color: theme.textMuted }}>
                  <div>
                    Direct Email:{' '}
                    <a
                      href={`mailto:${identity.email}`}
                      className="font-semibold underline"
                      style={{ color: theme.textPrimary }}
                    >
                      {identity.email}
                    </a>
                  </div>
                  <div>Studio Location: {identity.location}</div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <form
                  onSubmit={handleCommissionSubmit}
                  className="p-6 md:p-8 rounded-2xl border space-y-4"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderHairline,
                  }}
                  noValidate
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none"
                        style={{
                          backgroundColor: theme.bgElevated,
                          borderColor: theme.borderHairline,
                          color: theme.textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: theme.textSecondary }}
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="marcus@pulsecinema.tv"
                        className="w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none"
                        style={{
                          backgroundColor: theme.bgElevated,
                          borderColor: theme.borderHairline,
                          color: theme.textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-scope"
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Project Type
                    </label>
                    <select
                      id="contact-scope"
                      value={projectScope}
                      onChange={(e) => setProjectScope(e.target.value)}
                      className="w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none"
                      style={{
                        backgroundColor: theme.bgElevated,
                        borderColor: theme.borderHairline,
                        color: theme.textPrimary,
                      }}
                    >
                      <option value="Commercial Video Edit & Finishing">
                        Commercial Video Edit & Finishing
                      </option>
                      <option value="2D/3D Motion Graphics Package">
                        2D/3D Motion Graphics Package
                      </option>
                      <option value="Brand Identity & Visual Design">
                        Brand Identity & Visual Design
                      </option>
                      <option value="Color Grading & Show LUTs">
                        Color Grading & Show LUTs
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-brief"
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: theme.textSecondary }}
                    >
                      Project Brief & Delivery Date *
                    </label>
                    <textarea
                      id="contact-brief"
                      rows={3}
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder="Describe deliverables, aspect ratios, and target delivery window..."
                      className="w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none"
                      style={{
                        backgroundColor: theme.bgElevated,
                        borderColor: theme.borderHairline,
                        color: theme.textPrimary,
                      }}
                    />
                  </div>

                  {inquiryError && (
                    <p className="text-xs font-medium text-red-500" role="alert">
                      {inquiryError}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <span className="text-xs" style={{ color: theme.textMuted }}>
                      Direct response within 24 hours.
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: accentColor, color: accentTextColor }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Project Brief</span>
                    </button>
                  </div>
                </form>

                {submittedInquiries.length > 0 && (
                  <div
                    className="mt-4 p-4 rounded-xl border space-y-2"
                    style={{
                      backgroundColor: theme.bgSurface,
                      borderColor: theme.borderHairline,
                    }}
                    role="status"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: accentColor }}>
                      <Check className="w-4 h-4" />
                      <span>Booked Inquiries ({submittedInquiries.length})</span>
                    </div>
                    {submittedInquiries.map((inq) => (
                      <div key={inq.id} className="text-xs" style={{ color: theme.textSecondary }}>
                        {inq.name} · {inq.scope} · {inq.timestamp}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div
      id="top"
      className="min-h-screen flex-1 font-body-jakarta transition-colors duration-200"
      style={{
        backgroundColor: theme.bgCanvas,
        color: theme.textPrimary,
      }}
    >
      {/* Strict 3-Zone Top Bar Contract */}
      <header
        className="flex items-center justify-between gap-8 px-6 md:px-12 py-5 border-b"
        style={{ borderColor: theme.borderHairline }}
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className={`text-lg font-bold tracking-tight whitespace-nowrap shrink-0 ${displayFontClass}`}
          style={{ color: theme.textPrimary }}
        >
          {identity.brandMark}
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav
          aria-label="Portfolio sections"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
          style={{ color: theme.textSecondary }}
        >
          {visibleSections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="hover:underline transition-colors whitespace-nowrap shrink-0"
            >
              {sec.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
            style={{ backgroundColor: accentColor, color: accentTextColor }}
          >
            {identity.ctaLabel}
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <section
          className="py-12 md:py-20 border-b"
          style={{ borderColor: theme.borderHairline }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column: Typographic Hierarchy */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2">
              <div className="space-y-5">
                <div
                  className="flex flex-wrap items-center gap-2 text-xs"
                  style={{ color: theme.textMuted }}
                >
                  <span>{identity.roleKicker}</span>
                  <span aria-hidden="true">·</span>
                  <span>{identity.availability}</span>
                </div>

                <h1
                  className={`text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-bold tracking-tight leading-[1.12] text-balance ${displayFontClass}`}
                >
                  {identity.headline}
                </h1>

                <p
                  className="text-base md:text-lg leading-relaxed max-w-[62ch]"
                  style={{ color: theme.textSecondary }}
                >
                  {identity.subheadline}
                </p>
              </div>

              <div className="pt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#works"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentColor, color: accentTextColor }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Showreels</span>
                </a>
                <a
                  href="#contact"
                  className="px-5 py-2.5 rounded-lg border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                  style={{
                    borderColor: theme.borderHairline,
                    backgroundColor: theme.bgSurface,
                    color: theme.textPrimary,
                  }}
                >
                  {identity.ctaLabel}
                </a>
              </div>
            </div>

            {/* Right Column: Matching-Height Showreel Container */}
            <div className="lg:col-span-5 flex">
              <button
                type="button"
                onClick={() => projects[0] && setActiveLightboxProject(projects[0])}
                aria-label="Play featured showreel"
                className="w-full rounded-2xl overflow-hidden border min-h-[300px] lg:h-full relative group text-left cursor-pointer"
                style={{ borderColor: theme.borderHairline }}
              >
                <ArchitecturalArtwork
                  motif={identity.portraitMotif}
                  customImageUrl={identity.customPortraitUrl}
                  customVideoUrl={identity.customShowreelVideoUrl}
                  accentColor={accentColor}
                  isDark={true}
                  title={identity.fullName}
                  subtitle={identity.showreelDuration || '2026 Showreel'}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">
                      Featured Director & Editor Showreel
                    </div>
                    <div className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>
                      {identity.showreelDuration || '02:14 Showreel (4K 60fps)'}
                    </div>
                  </div>
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: accentColor, color: accentTextColor }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Full-Width 4-Column Quantitative Proof Row Below Hero Split */}
          <div
            className="mt-12 pt-10 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            style={{ borderColor: theme.borderHairline }}
          >
            {metrics.map((m) => (
              <div key={m.id}>
                <div
                  className={`text-2xl md:text-3xl font-bold tracking-tight tabular-nums ${displayFontClass}`}
                  style={{ color: theme.textPrimary }}
                >
                  {m.value}
                </div>
                <div
                  className="text-xs font-semibold mt-1"
                  style={{ color: theme.textPrimary }}
                >
                  {m.label}
                </div>
                <div
                  className="text-xs mt-1 leading-relaxed"
                  style={{ color: theme.textMuted }}
                >
                  {m.context}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Ordered Portfolio Sections */}
        {visibleSections.map((sec) => renderSection(sec.id))}
      </main>

      {/* Clean Footer */}
      <footer
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
        style={{ color: theme.textMuted }}
      >
        <div>
          © {new Date().getFullYear()} {identity.fullName}. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={identity.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Vimeo
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={identity.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={identity.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            X (Twitter)
          </a>
          <span aria-hidden="true">·</span>
          <span>{identity.location}</span>
        </div>
      </footer>

      {/* Fullscreen Lightbox Modal for Case Studies */}
      <ProjectLightboxModal
        project={activeLightboxProject}
        onClose={() => setActiveLightboxProject(null)}
        theme={theme}
        accentColor={accentColor}
        displayFontClass={displayFontClass}
      />
    </div>
  );
};
