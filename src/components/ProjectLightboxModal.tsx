import React, { useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { PortfolioProject } from '../types/portfolio';
import { ThemeTokens, getContrastingButtonTextColor } from '../utils/portfolioLogic';
import { ArchitecturalArtwork } from './ArchitecturalArtwork';

interface ProjectLightboxModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  theme: ThemeTokens;
  accentColor: string;
  displayFontClass: string;
}

export const ProjectLightboxModal: React.FC<ProjectLightboxModalProps> = ({
  project,
  onClose,
  theme,
  accentColor,
  displayFontClass,
}) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-project-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 md:p-10 transition-all"
        style={{
          backgroundColor: theme.bgCanvas,
          borderColor: theme.borderHairline,
          color: theme.textPrimary,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Metadata & Close Button */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b" style={{ borderColor: theme.borderHairline }}>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs mb-2" style={{ color: theme.textMuted }}>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.year}</span>
              <span aria-hidden="true">·</span>
              <span>Client: {project.client}</span>
              <span aria-hidden="true">·</span>
              <span>Role: {project.role}</span>
            </div>
            <h2
              id="lightbox-project-title"
              className={`text-2xl md:text-3xl font-bold tracking-tight text-balance ${displayFontClass}`}
            >
              {project.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="p-2.5 rounded-lg border transition-colors shrink-0 cursor-pointer"
            style={{
              borderColor: theme.borderHairline,
              color: theme.textPrimary,
              backgroundColor: theme.bgSurface,
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Resolution Artwork or Video Showcase */}
        <div className="my-5 rounded-xl overflow-hidden border aspect-21/9 max-h-[300px]" style={{ borderColor: theme.borderHairline }}>
          <ArchitecturalArtwork
            motif={project.motif}
            customImageUrl={project.customImageUrl}
            customVideoUrl={project.customVideoUrl}
            enableVideoControls={true}
            accentColor={accentColor}
            isDark={theme.isDark}
            title={project.title}
            subtitle={`${project.client} · ${project.year}`}
            className="w-full h-full"
          />
        </div>

        {/* Impact Metric Highlight */}
        <div
          className="p-4 md:p-5 rounded-xl border mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: theme.borderHairline,
          }}
        >
          <div>
            <div className="text-xs mb-1" style={{ color: theme.textMuted }}>
              Verified Impact & Recognition
            </div>
            <div className="text-base md:text-lg font-semibold tabular-nums" style={{ color: theme.textPrimary }}>
              {project.impactMetric}
            </div>
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: accentColor,
                color: getContrastingButtonTextColor(accentColor),
              }}
            >
              <span>Visit Live Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Case Study Breakdown: Summary, Challenge, Outcome */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div>
            <h3 className="text-xs font-semibold mb-2" style={{ color: theme.textMuted }}>
              01. Executive Summary
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
              {project.summary}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold mb-2" style={{ color: theme.textMuted }}>
              02. Architectural Challenge
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
              {project.challenge}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold mb-2" style={{ color: theme.textMuted }}>
              03. System Outcome
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
              {project.outcome}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
