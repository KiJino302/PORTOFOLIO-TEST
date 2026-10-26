import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  Check,
  PanelLeftClose,
  Upload,
  Link2,
  X,
} from 'lucide-react';
import {
  FontPairingId,
  PortfolioConfig,
  ProjectDraftInput,
  SectionId,
  ThemeId,
  VisualMotifId,
  WorksLayoutId,
} from '../types/portfolio';
import {
  ARCHETYPE_TEMPLATES,
  STYLE_PRESET_LIBRARY,
  THEME_PRESETS,
  addProjectToConfig,
  applyStylePreset,
  detectMediaUrlKind,
  moveSectionOrder,
  toggleSectionVisibility,
  updateProjectMedia,
} from '../utils/portfolioLogic';

interface StudioConfiguratorProps {
  config: PortfolioConfig;
  onChange: (nextConfig: PortfolioConfig) => void;
  onOpenExport: () => void;
  onCollapse: () => void;
}

type StudioTab = 'styles' | 'profile' | 'projects' | 'sections';

const MOTIF_OPTIONS: { id: VisualMotifId; label: string }[] = [
  { id: 'modular-synth', label: 'Waveform & Audio Timeline' },
  { id: 'kinetic-grid', label: '3D Motion & Node Grid' },
  { id: 'chrono-optics', label: 'Cinema Lens & Color Wheel' },
  { id: 'swiss-editorial', label: 'Editorial Title Frame' },
  { id: 'nordic-pavilion', label: 'Architectural Wide Frame' },
  { id: 'spatial-controller', label: 'Tactile Grading Console' },
];

export const StudioConfigurator: React.FC<StudioConfiguratorProps> = ({
  config,
  onChange,
  onOpenExport,
  onCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('styles');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('video-designer');
  const [editingMediaProjectId, setEditingMediaProjectId] = useState<string | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState<string>('');
  const [heroMediaUrlInput, setHeroMediaUrlInput] = useState<string>('');

  // New Project Draft State
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectDraft, setProjectDraft] = useState<ProjectDraftInput>({
    title: '',
    subtitleLabel: '',
    client: '',
    year: '2026',
    category: 'Video Editing',
    role: 'Lead Editor & Designer',
    duration: '01:45',
    featured: false,
    summary: '',
    challenge: '',
    outcome: '',
    impactMetric: '',
    liveUrl: '',
    motif: 'modular-synth',
    customImageUrl: '',
    customVideoUrl: '',
  });
  const [projectErrors, setProjectErrors] = useState<Record<string, string>>({});

  const updateIdentity = (field: keyof PortfolioConfig['identity'], value: string) => {
    onChange({
      ...config,
      identity: {
        ...config.identity,
        [field]: value,
      },
    });
  };

  const updateDesign = <K extends keyof PortfolioConfig['design']>(
    field: K,
    value: PortfolioConfig['design'][K]
  ) => {
    onChange({
      ...config,
      design: {
        ...config.design,
        [field]: value,
      },
    });
  };

  const handleOneClickStylePreset = (presetId: string) => {
    onChange(applyStylePreset(config, presetId));
  };

  const handleLoadArchetype = (archetypeKey: string) => {
    const template = ARCHETYPE_TEMPLATES[archetypeKey];
    if (!template) return;
    setSelectedArchetype(archetypeKey);
    onChange(structuredClone(template.config));
  };

  const readFileAsMediaUrl = (
    file: File,
    onResult: (kind: 'image' | 'video', url: string) => void
  ) => {
    const isVideo = file.type.startsWith('video/');
    if (isVideo || file.size > 2 * 1024 * 1024) {
      // Use fast Object URL for video files or large images so it plays immediately without localStorage bloat
      const objUrl = URL.createObjectURL(file);
      onResult(isVideo ? 'video' : 'image', objUrl);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onResult(isVideo ? 'video' : 'image', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsMediaUrl(file, (kind, url) => {
      onChange({
        ...config,
        identity: {
          ...config.identity,
          customPortraitUrl: kind === 'image' ? url : undefined,
          customShowreelVideoUrl: kind === 'video' ? url : undefined,
        },
      });
    });
    e.target.value = '';
  };

  const handleApplyHeroMediaUrl = () => {
    const trimmed = heroMediaUrlInput.trim();
    if (!trimmed) return;
    const kind = detectMediaUrlKind(trimmed);
    onChange({
      ...config,
      identity: {
        ...config.identity,
        customPortraitUrl: kind === 'image' ? trimmed : undefined,
        customShowreelVideoUrl: kind === 'video' ? trimmed : undefined,
      },
    });
    setHeroMediaUrlInput('');
  };

  const handleClearHeroMedia = () => {
    onChange({
      ...config,
      identity: {
        ...config.identity,
        customPortraitUrl: undefined,
        customShowreelVideoUrl: undefined,
      },
    });
  };

  const handleProjectFileUpload = (
    projectId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsMediaUrl(file, (kind, url) => {
      onChange(
        updateProjectMedia(config, projectId, {
          customImageUrl: kind === 'image' ? url : undefined,
          customVideoUrl: kind === 'video' ? url : undefined,
        })
      );
    });
    e.target.value = '';
  };

  const handleApplyProjectMediaUrl = (projectId: string) => {
    const trimmed = mediaUrlInput.trim();
    if (!trimmed) return;
    const kind = detectMediaUrlKind(trimmed);
    onChange(
      updateProjectMedia(config, projectId, {
        customImageUrl: kind === 'image' ? trimmed : undefined,
        customVideoUrl: kind === 'video' ? trimmed : undefined,
      })
    );
    setMediaUrlInput('');
    setEditingMediaProjectId(null);
  };

  const handleClearProjectMedia = (projectId: string) => {
    onChange(
      updateProjectMedia(config, projectId, {
        customImageUrl: undefined,
        customVideoUrl: undefined,
      })
    );
  };

  const handleDraftFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileAsMediaUrl(file, (kind, url) => {
      setProjectDraft((prev) => ({
        ...prev,
        customImageUrl: kind === 'image' ? url : '',
        customVideoUrl: kind === 'video' ? url : '',
      }));
    });
    e.target.value = '';
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const { config: updatedConfig, validation } = addProjectToConfig(config, projectDraft);
    if (!validation.valid) {
      setProjectErrors(validation.errors);
      return;
    }
    setProjectErrors({});
    onChange(updatedConfig);
    setProjectDraft({
      title: '',
      subtitleLabel: '',
      client: '',
      year: '2026',
      category: 'Video Editing',
      role: 'Lead Editor & Designer',
      duration: '01:45',
      featured: false,
      summary: '',
      challenge: '',
      outcome: '',
      impactMetric: '',
      liveUrl: '',
      motif: 'modular-synth',
      customImageUrl: '',
      customVideoUrl: '',
    });
    setShowAddProject(false);
  };

  const handleDeleteProject = (id: string) => {
    onChange({
      ...config,
      projects: config.projects.filter((p) => p.id !== id),
    });
  };

  const handleMoveSection = (id: SectionId, direction: 'up' | 'down') => {
    onChange({
      ...config,
      sections: moveSectionOrder(config.sections, id, direction),
    });
  };

  const handleToggleSection = (id: SectionId) => {
    onChange({
      ...config,
      sections: toggleSectionVisibility(config.sections, id),
    });
  };

  return (
    <aside
      aria-label="Portfolio Studio Configurator"
      className="w-full lg:w-[390px] xl:w-[410px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col lg:h-screen lg:sticky lg:top-0 z-30 select-none"
    >
      {/* Studio Header */}
      <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between gap-3 bg-zinc-50">
        <div className="flex items-center gap-2.5 min-w-0">
          <Sliders className="w-4 h-4 text-zinc-900 shrink-0" />
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 truncate">
            Studio Configurator
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export HTML</span>
          </button>
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Hide configurator panel"
            title="Preview Fullscreen"
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Template Switcher */}
      <div className="px-5 py-3 bg-zinc-100/70 border-b border-zinc-200 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <label htmlFor="archetype-select" className="sr-only">
            Portfolio Template
          </label>
          <select
            id="archetype-select"
            value={selectedArchetype}
            onChange={(e) => handleLoadArchetype(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            {Object.entries(ARCHETYPE_TEMPLATES).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => handleLoadArchetype(selectedArchetype)}
          aria-label="Reset current template"
          title="Reset Template"
          className="p-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Simple 4-Tab Bar */}
      <div
        role="tablist"
        aria-label="Configuration categories"
        className="grid grid-cols-4 gap-1 p-1.5 bg-zinc-100 border-b border-zinc-200"
      >
        {(
          [
            { id: 'styles', label: 'Styles' },
            { id: 'profile', label: 'Profile' },
            { id: 'projects', label: 'Projects' },
            { id: 'sections', label: 'Layout' },
          ] as { id: StudioTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-zinc-900">
        {activeTab === 'styles' && (
          <div className="space-y-6">
            {/* One-Click Combined Style Presets Library (5 Presets) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-zinc-900">
                  1-Click Style Presets (Palette + Typography)
                </h3>
                <span className="text-[11px] text-zinc-500">5 Curated Combos</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-3">
                Click any card to switch both color palette and font pairing simultaneously.
              </p>

              <div className="space-y-2.5">
                {STYLE_PRESET_LIBRARY.map((preset) => {
                  const isActive = config.design.stylePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleOneClickStylePreset(preset.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                          : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-900'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">{preset.name}</span>
                          {isActive && <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />}
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 truncate ${
                            isActive ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {preset.tagline}
                        </div>
                        <div
                          className={`text-[10px] font-mono-jetbrains mt-1.5 ${
                            isActive ? 'text-zinc-400' : 'text-zinc-500'
                          }`}
                        >
                          Font: {preset.fontBadgeLabel}
                        </div>
                      </div>

                      {/* 3-Color Swatch Preview */}
                      <div className="flex items-center -space-x-1.5 shrink-0">
                        {preset.palettePreview.map((hex, idx) => (
                          <span
                            key={`${preset.id}-${idx}`}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual Fine-Tuning Controls */}
            <div className="pt-4 border-t border-zinc-200 space-y-4">
              <h3 className="text-xs font-bold text-zinc-900">
                Fine-Tune Palette & Font Separately
              </h3>

              <div>
                <label
                  htmlFor="fine-tune-theme"
                  className="block text-[11px] font-semibold text-zinc-600 mb-1"
                >
                  Color Palette
                </label>
                <select
                  id="fine-tune-theme"
                  value={config.design.theme}
                  onChange={(e) => {
                    const nextTheme = e.target.value as ThemeId;
                    onChange({
                      ...config,
                      design: {
                        ...config.design,
                        theme: nextTheme,
                        accentColor: THEME_PRESETS[nextTheme].accentDefault,
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900"
                >
                  {Object.values(THEME_PRESETS).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="fine-tune-font"
                  className="block text-[11px] font-semibold text-zinc-600 mb-1"
                >
                  Typography Combination
                </label>
                <select
                  id="fine-tune-font"
                  value={config.design.fontPairing}
                  onChange={(e) =>
                    updateDesign('fontPairing', e.target.value as FontPairingId)
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900"
                >
                  <option value="outfit-jakarta">Outfit + Plus Jakarta Sans (Modern Studio)</option>
                  <option value="fraunces-jakarta">Fraunces Serif + Plus Jakarta Sans (Cinema Editorial)</option>
                  <option value="bricolage-jakarta">Bricolage Grotesque + Plus Jakarta Sans (Bold Neo-Grotesque)</option>
                  <option value="mono-bricolage">JetBrains Mono + Plus Jakarta Sans (Technical Director)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1.5">
                  Portfolio Grid Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'showcase-4col', label: '4-Col Cards' },
                      { id: 'bento', label: 'Bento Grid' },
                      { id: 'editorial-index', label: 'Index List' },
                    ] as { id: WorksLayoutId; label: string }[]
                  ).map((layout) => (
                    <button
                      key={layout.id}
                      type="button"
                      onClick={() => updateDesign('worksLayout', layout.id)}
                      className={`py-2 px-2 rounded-lg border text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                        config.design.worksLayout === layout.id
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Hero Showreel Image / Video Upload Box */}
            <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900">
                    Hero Showreel Image / Video
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Upload a local `.mp4`, `.webm`, `.jpg`, or `.png` file or paste a URL.
                  </p>
                </div>
                {(config.identity.customPortraitUrl ||
                  config.identity.customShowreelVideoUrl) && (
                  <button
                    type="button"
                    onClick={handleClearHeroMedia}
                    className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:underline cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset Media</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image / Video File</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleHeroFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="url"
                  value={heroMediaUrlInput}
                  onChange={(e) => setHeroMediaUrlInput(e.target.value)}
                  placeholder="Or paste .mp4 / .jpg URL..."
                  aria-label="Hero media URL"
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={handleApplyHeroMediaUrl}
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold hover:bg-zinc-100 cursor-pointer shrink-0"
                >
                  Apply URL
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="input-fullname" className="block text-xs font-semibold text-zinc-700 mb-1">
                Creator / Studio Name
              </label>
              <input
                id="input-fullname"
                type="text"
                value={config.identity.fullName}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({
                    ...config,
                    identity: {
                      ...config.identity,
                      fullName: val,
                      brandMark: val || config.identity.brandMark,
                    },
                  });
                }}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="input-rolekicker" className="block text-xs font-semibold text-zinc-700 mb-1">
                Role & Location Subtitle
              </label>
              <input
                id="input-rolekicker"
                type="text"
                value={config.identity.roleKicker}
                onChange={(e) => updateIdentity('roleKicker', e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="input-headline" className="block text-xs font-semibold text-zinc-700 mb-1">
                Hero Headline
              </label>
              <textarea
                id="input-headline"
                rows={3}
                value={config.identity.headline}
                onChange={(e) => updateIdentity('headline', e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="input-subheadline" className="block text-xs font-semibold text-zinc-700 mb-1">
                Short Bio / Introduction
              </label>
              <textarea
                id="input-subheadline"
                rows={3}
                value={config.identity.subheadline}
                onChange={(e) => updateIdentity('subheadline', e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-ctalabel" className="block text-xs font-semibold text-zinc-700 mb-1">
                  Primary Button Text
                </label>
                <input
                  id="input-ctalabel"
                  type="text"
                  value={config.identity.ctaLabel}
                  onChange={(e) => updateIdentity('ctaLabel', e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                />
              </div>
              <div>
                <label htmlFor="input-email" className="block text-xs font-semibold text-zinc-700 mb-1">
                  Contact Email
                </label>
                <input
                  id="input-email"
                  type="email"
                  value={config.identity.email}
                  onChange={(e) => updateIdentity('email', e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-zinc-900">
                  Portfolio Showreels & Cards ({config.projects.length})
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Upload custom images or videos on any card below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProject(!showAddProject)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddProject ? 'Close Form' : 'Add Card'}</span>
              </button>
            </div>

            {showAddProject && (
              <form
                onSubmit={handleCreateProject}
                className="p-4 rounded-xl border border-zinc-300 bg-zinc-50 space-y-3"
                noValidate
              >
                <div className="text-xs font-bold text-zinc-900">Add Portfolio Card</div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="proj-title" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Card Title *
                    </label>
                    <input
                      id="proj-title"
                      type="text"
                      placeholder="e.g., Documentary Cut"
                      value={projectDraft.title}
                      onChange={(e) =>
                        setProjectDraft({ ...projectDraft, title: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                    />
                    {projectErrors.title && (
                      <p className="text-[11px] text-red-600 mt-1" role="alert">
                        {projectErrors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="proj-subtitle" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Accent Subtitle
                    </label>
                    <input
                      id="proj-subtitle"
                      type="text"
                      placeholder="e.g., Film Portfolios"
                      value={projectDraft.subtitleLabel || ''}
                      onChange={(e) =>
                        setProjectDraft({ ...projectDraft, subtitleLabel: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>

                {/* Upload Image or Video for New Card */}
                <div className="p-3 rounded-lg border border-zinc-200 bg-white space-y-2">
                  <div className="text-[11px] font-semibold text-zinc-700">
                    Card Media (Upload Image / Video or Paste URL)
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Image or Video</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleDraftFileUpload}
                        className="sr-only"
                      />
                    </label>
                    {(projectDraft.customImageUrl || projectDraft.customVideoUrl) && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        {projectDraft.customVideoUrl ? 'Video attached' : 'Image attached'}
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste direct .mp4, .webm, .jpg, or .png URL..."
                    value={projectDraft.customVideoUrl || projectDraft.customImageUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const kind = detectMediaUrlKind(val);
                      setProjectDraft({
                        ...projectDraft,
                        customVideoUrl: kind === 'video' ? val : '',
                        customImageUrl: kind === 'image' ? val : '',
                      });
                    }}
                    className="w-full rounded border border-zinc-300 px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="proj-client" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Client / Brand *
                    </label>
                    <input
                      id="proj-client"
                      type="text"
                      placeholder="e.g., A24 Studios"
                      value={projectDraft.client}
                      onChange={(e) =>
                        setProjectDraft({ ...projectDraft, client: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                    />
                    {projectErrors.client && (
                      <p className="text-[11px] text-red-600 mt-1" role="alert">
                        {projectErrors.client}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="proj-year" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Year *
                    </label>
                    <input
                      id="proj-year"
                      type="text"
                      placeholder="2026"
                      value={projectDraft.year}
                      onChange={(e) =>
                        setProjectDraft({ ...projectDraft, year: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                    />
                    {projectErrors.year && (
                      <p className="text-[11px] text-red-600 mt-1" role="alert">
                        {projectErrors.year}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="proj-category" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Discipline *
                    </label>
                    <input
                      id="proj-category"
                      type="text"
                      placeholder="Video Editing"
                      value={projectDraft.category}
                      onChange={(e) =>
                        setProjectDraft({ ...projectDraft, category: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor="proj-motif" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Fallback Vector Style
                    </label>
                    <select
                      id="proj-motif"
                      value={projectDraft.motif}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          motif: e.target.value as VisualMotifId,
                        })
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs"
                    >
                      {MOTIF_OPTIONS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="proj-summary" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Project Description *
                  </label>
                  <textarea
                    id="proj-summary"
                    rows={2}
                    placeholder="Describe the edit, motion graphics, or design deliverables..."
                    value={projectDraft.summary}
                    onChange={(e) =>
                      setProjectDraft({ ...projectDraft, summary: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                  />
                  {projectErrors.summary && (
                    <p className="text-[11px] text-red-600 mt-1" role="alert">
                      {projectErrors.summary}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="proj-metric" className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Result / Views Metric *
                  </label>
                  <input
                    id="proj-metric"
                    type="text"
                    placeholder="e.g., 4.2M Views · Vimeo Staff Pick"
                    value={projectDraft.impactMetric}
                    onChange={(e) =>
                      setProjectDraft({ ...projectDraft, impactMetric: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                  />
                  {projectErrors.impactMetric && (
                    <p className="text-[11px] text-red-600 mt-1" role="alert">
                      {projectErrors.impactMetric}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Publish Card
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {config.projects.map((proj) => {
                const hasCustomMedia = Boolean(proj.customImageUrl || proj.customVideoUrl);
                const isEditingUrl = editingMediaProjectId === proj.id;

                return (
                  <div
                    key={proj.id}
                    className="p-3 rounded-xl border border-zinc-200 bg-white space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-900 truncate">
                          {proj.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate">
                          {proj.subtitleLabel} · {proj.client}
                        </div>
                        {hasCustomMedia && (
                          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                            {proj.customVideoUrl ? 'Custom Video Active' : 'Custom Image Active'}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        aria-label={`Delete ${proj.title}`}
                        className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Direct Upload Image/Video & Paste URL Toolbar on Every Card */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-100">
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 text-white text-[11px] font-semibold hover:bg-zinc-800 transition-colors cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload Image / Video</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          aria-label={`Upload image or video for ${proj.title}`}
                          onChange={(e) => handleProjectFileUpload(proj.id, e)}
                          className="sr-only"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingMediaProjectId(isEditingUrl ? null : proj.id);
                          setMediaUrlInput(
                            proj.customVideoUrl || proj.customImageUrl || ''
                          );
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Paste URL</span>
                      </button>

                      {hasCustomMedia && (
                        <button
                          type="button"
                          onClick={() => handleClearProjectMedia(proj.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    {isEditingUrl && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="url"
                          value={mediaUrlInput}
                          onChange={(e) => setMediaUrlInput(e.target.value)}
                          placeholder="https://... (.mp4, .webm, .jpg, .png)"
                          aria-label={`Media URL for ${proj.title}`}
                          className="flex-1 rounded border border-zinc-300 px-2 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyProjectMediaUrl(proj.id)}
                          className="px-2.5 py-1 rounded bg-zinc-900 text-white text-xs font-semibold cursor-pointer shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-zinc-900">
                Section Order & Visibility
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Show, hide, or reorder sections on your portfolio page.
              </p>
            </div>

            <div className="space-y-2">
              {config.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-3 rounded-xl border border-zinc-200 bg-white flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono-jetbrains text-zinc-400">
                      0{idx + 1}.
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        sec.visible ? 'text-zinc-900' : 'text-zinc-400 line-through'
                      }`}
                    >
                      {sec.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(sec.id, 'up')}
                      aria-label={`Move ${sec.label} section up`}
                      className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === config.sections.length - 1}
                      onClick={() => handleMoveSection(sec.id, 'down')}
                      aria-label={`Move ${sec.label} section down`}
                      className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSection(sec.id)}
                      aria-label={
                        sec.visible
                          ? `Hide ${sec.label} section`
                          : `Show ${sec.label} section`
                      }
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        sec.visible
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {sec.visible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
