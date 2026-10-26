import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STYLE_PRESET_LIBRARY,
  applyStylePreset,
  getDefaultPortfolioConfig,
  extractProjectCategories,
  filterProjectsByCategory,
  validateProjectDraft,
  addProjectToConfig,
  moveSectionOrder,
  toggleSectionVisibility,
  parseImportedPortfolioJson,
  generateStandalonePortfolioHtml,
  getContrastingButtonTextColor,
} from './portfolioLogic';

test('getDefaultPortfolioConfig returns Video Editor & Visual Designer default config', () => {
  const cfg1 = getDefaultPortfolioConfig();
  const cfg2 = getDefaultPortfolioConfig();
  assert.equal(cfg1.identity.fullName, 'Alex Rivera');
  assert.equal(cfg1.projects.length, 8);
  assert.equal(cfg1.capabilities.length, 8);
  cfg1.identity.fullName = 'Modified Name';
  assert.equal(cfg2.identity.fullName, 'Alex Rivera');
});

test('STYLE_PRESET_LIBRARY has 5 predefined color palette and typography combinations and applyStylePreset switches them in one click', () => {
  assert.equal(STYLE_PRESET_LIBRARY.length, 5);
  const cfg = getDefaultPortfolioConfig();

  const updated = applyStylePreset(cfg, 'preset-cinema-noir');
  assert.equal(updated.design.stylePresetId, 'preset-cinema-noir');
  assert.equal(updated.design.theme, 'cinema-noir');
  assert.equal(updated.design.fontPairing, 'fraunces-jakarta');
  assert.equal(updated.design.accentColor, '#F2B705');

  const swiss = applyStylePreset(updated, 'preset-swiss-editorial');
  assert.equal(swiss.design.stylePresetId, 'preset-swiss-editorial');
  assert.equal(swiss.design.theme, 'swiss-monograph');
  assert.equal(swiss.design.fontPairing, 'bricolage-jakarta');
  assert.equal(swiss.design.accentColor, '#D92B2B');
});

test('extractProjectCategories returns All Works plus unique categories', () => {
  const cfg = getDefaultPortfolioConfig();
  const categories = extractProjectCategories(cfg.projects);
  assert.deepEqual(categories, [
    'All Works',
    'Video Editing',
    'Motion Design',
    'Visual Design',
    'Color & Finishing',
  ]);
});

test('filterProjectsByCategory filters by category and search query', () => {
  const cfg = getDefaultPortfolioConfig();
  const motionOnly = filterProjectsByCategory(cfg.projects, 'Motion Design');
  assert.equal(motionOnly.length, 2);

  const searchNike = filterProjectsByCategory(cfg.projects, 'All Works', 'Nike');
  assert.equal(searchNike.length, 1);
  assert.equal(searchNike[0].title, 'Commercial Editing');
});

test('validateProjectDraft rejects invalid inputs and accepts valid project drafts', () => {
  const invalid = validateProjectDraft({
    title: 'ab',
    client: '',
    year: '26',
    category: '',
    role: 'Lead',
    featured: false,
    summary: 'short',
    challenge: '',
    outcome: '',
    impactMetric: '',
    liveUrl: '',
    motif: 'spatial-controller',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.client);
  assert.ok(invalid.errors.year);
  assert.ok(invalid.errors.summary);
  assert.ok(invalid.errors.impactMetric);

  const valid = validateProjectDraft({
    title: 'Documentary Feature Cut',
    client: 'A24 Docs',
    year: '2026',
    category: 'Video Editing',
    role: 'Lead Editor',
    featured: true,
    summary: 'Feature-length theatrical documentary cut with archival 16mm transfers.',
    challenge: '300 hours of raw footage.',
    outcome: 'Premiered at Sundance.',
    impactMetric: '+180% streaming completion rate',
    liveUrl: 'https://example.com',
    motif: 'modular-synth',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('addProjectToConfig prepends validated project to config', () => {
  const cfg = getDefaultPortfolioConfig();
  const result = addProjectToConfig(
    cfg,
    {
      title: 'Documentary Feature Cut',
      subtitleLabel: 'Documentary Reels',
      client: 'A24 Docs',
      year: '2026',
      category: 'Video Editing',
      role: 'Lead Editor',
      featured: true,
      summary: 'Feature-length theatrical documentary cut with archival 16mm transfers.',
      challenge: '',
      outcome: '',
      impactMetric: '+180% streaming completion rate',
      liveUrl: '',
      motif: 'modular-synth',
    },
    'proj-custom-99'
  );
  assert.equal(result.validation.valid, true);
  assert.equal(result.config.projects.length, 9);
  assert.equal(result.config.projects[0].id, 'proj-custom-99');
  assert.equal(result.config.projects[0].title, 'Documentary Feature Cut');
  assert.equal(result.config.projects[0].subtitleLabel, 'Documentary Reels');
});

test('moveSectionOrder and toggleSectionVisibility update section list predictably', () => {
  const cfg = getDefaultPortfolioConfig();
  const moved = moveSectionOrder(cfg.sections, 'capabilities', 'up');
  assert.equal(moved[0].id, 'capabilities');
  assert.equal(moved[1].id, 'works');

  const toggled = toggleSectionVisibility(moved, 'capabilities');
  assert.equal(toggled[0].visible, false);
});

test('parseImportedPortfolioJson validates schema and handles malformed JSON', () => {
  const badSyntax = parseImportedPortfolioJson('{bad json');
  assert.ok(badSyntax.error);

  const missingFields = parseImportedPortfolioJson('{"identity": {}}');
  assert.ok(missingFields.error);

  const cfg = getDefaultPortfolioConfig();
  const good = parseImportedPortfolioJson(JSON.stringify(cfg));
  assert.equal(good.error, undefined);
  assert.equal(good.config?.identity.fullName, 'Alex Rivera');
});

test('generateStandalonePortfolioHtml outputs self-contained HTML with user identity and projects', () => {
  const cfg = getDefaultPortfolioConfig();
  const html = generateStandalonePortfolioHtml(cfg);
  assert.ok(html.includes('<!doctype html>'));
  assert.ok(html.includes('Alex Rivera'));
  assert.ok(html.includes('Commercial Editing'));
});

test('getContrastingButtonTextColor returns dark ink for saffron yellow and white for dark accents', () => {
  assert.equal(getContrastingButtonTextColor('#F2B705'), '#09090B');
  assert.equal(getContrastingButtonTextColor('#9B6BFF'), '#FFFFFF');
  assert.equal(getContrastingButtonTextColor('#D92B2B'), '#FFFFFF');
});

test('detectMediaUrlKind and updateProjectMedia handle custom image and video uploads', async () => {
  const { detectMediaUrlKind, updateProjectMedia } = await import('./portfolioLogic');
  assert.equal(detectMediaUrlKind('https://example.com/reel.mp4'), 'video');
  assert.equal(detectMediaUrlKind('data:video/mp4;base64,AAAA'), 'video');
  assert.equal(detectMediaUrlKind('video/webm'), 'video');
  assert.equal(detectMediaUrlKind('https://example.com/cover.jpg'), 'image');

  const cfg = getDefaultPortfolioConfig();
  const targetId = cfg.projects[0].id;
  const withVideo = updateProjectMedia(cfg, targetId, {
    customVideoUrl: 'https://example.com/showreel.mp4',
    customImageUrl: undefined,
  });
  assert.equal(withVideo.projects[0].customVideoUrl, 'https://example.com/showreel.mp4');
  assert.equal(withVideo.projects[0].customImageUrl, undefined);
});
