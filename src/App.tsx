/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ContentForgeLogo } from './components/ContentForgeLogo';
import { ChangelogModal } from './components/Overlays';
import {
  DRAFT_VARIATIONS,
  HOOK_ANGLES,
  HookAngleId,
  INITIAL_SCHEDULED_POSTS,
  NARRATIVE_BEATS,
  OPENING_FORMULAS,
  ScheduledPost,
} from './data/studioData';

type StudioTab = 'studio' | 'variations' | 'calendar' | 'analytics';
type NavSection = 'product' | 'features' | 'workflow' | 'about';

const TONE_PRESETS = [
  'Tone: Analytical yet approachable',
  'Tone: Bold & executive',
  'Tone: Conversational story',
];

const RAW_PROMPTS = [
  {
    prompt: '> "need to explain why newsletters beat social algorithms in 2025"',
    thesis: 'Key thesis identified',
    platforms: '3 target platforms',
  },
  {
    prompt: '> "breakdown the 5 AI tools saving our solo studio 14 hours a week"',
    thesis: 'ROI matrix extracted',
    platforms: 'LinkedIn & X Thread',
  },
  {
    prompt: '> "why unpolished walk-and-talk video beats $10k studio setups"',
    thesis: 'Contrarian hook ready',
    platforms: 'Shorts & Reels',
  },
];

export default function App() {
  // Navigation & Modal states
  const [activeNav, setActiveNav] = useState<NavSection>('product');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [changelogTab, setChangelogTab] = useState<'changelog' | 'architecture' | 'metrics'>('changelog');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Studio Workspace states (initialized to match Image 1.png pixel-for-pixel)
  const [studioTab, setStudioTab] = useState<StudioTab>('studio');
  const [selectedAngle, setSelectedAngle] = useState<HookAngleId>('curiosity');
  const [hookVariationIdx, setHookVariationIdx] = useState<number>(0);
  const [activeDraftIdx, setActiveDraftIdx] = useState<number>(0);
  const [tonePresetIdx, setTonePresetIdx] = useState<number>(0);
  const [savedMinutesText, setSavedMinutesText] = useState<string>('Saved 2m ago');
  const [activeBeatSection, setActiveBeatSection] = useState<'intro' | 'list' | 'cta' | null>(null);

  // Interactive Action states in Studio
  const [hookCopied, setHookCopied] = useState(false);
  const [draftCopied, setDraftCopied] = useState(false);
  const [savedToQueue, setSavedToQueue] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [customDraftText, setCustomDraftText] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);

  // Interactive states for How It Works & Capabilities micro-components
  const [rawPromptIdx, setRawPromptIdx] = useState(0);
  const [step2Tone, setStep2Tone] = useState<'Story Driven' | 'Provocative'>('Provocative');
  const [selectedFormula, setSelectedFormula] = useState<'Story' | 'Statistic' | 'Contrarian' | 'Step-by-Step'>('Contrarian');
  const [activeExportPreset, setActiveExportPreset] = useState<'LinkedIn Post' | 'X Thread (8x)' | 'Shorts Script'>('LinkedIn Post');
  const [activeLibraryFolder, setActiveLibraryFolder] = useState<'Inbox (12)' | 'In Drafting (5)' | 'Scheduled (8)' | 'Archive'>('Inbox (12)');
  const [libraryCount, setLibraryCount] = useState(48);

  // Derived active objects
  const currentHookData = HOOK_ANGLES[selectedAngle];
  const currentHookQuote = currentHookData.quotes[hookVariationIdx % currentHookData.quotes.length];
  const currentHookCharCount = currentHookQuote.replace(/[“”]/g, '').length;

  // Alternate hook shown below the primary hook card in Left Column
  const alternateAngleId: HookAngleId = selectedAngle === 'direct' ? 'contrarian' : 'direct';
  const alternateHookData = HOOK_ANGLES[alternateAngleId];

  const currentDraft = DRAFT_VARIATIONS[activeDraftIdx % DRAFT_VARIATIONS.length];

  // Calculate dynamic word count if edited in place, or default 248 matching mockup
  const defaultFullDraftString = `${currentDraft.leadHook}\n\n${currentDraft.introParagraph}\n\n${currentDraft.bridgeLine}\n\n${currentDraft.tools
    .map((t) => `${t.num} ${t.name} — ${t.detail}`)
    .join('\n')}\n\n${currentDraft.closingQuestion}\n\n${currentDraft.tags.join(' ')}`;

  const activeTextForCount = customDraftText ?? defaultFullDraftString;
  const wordCount = customDraftText
    ? activeTextForCount.trim().split(/\s+/).filter(Boolean).length
    : activeDraftIdx === 0
      ? 248
      : 236;
  const readTimeMin = Math.max(0.8, Number((wordCount / 205).toFixed(1)));

  // Handlers
  const handleNavClick = (section: NavSection, targetId: string) => {
    setActiveNav(section);
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyHook = () => {
    navigator.clipboard?.writeText(currentHookQuote.replace(/[“”]/g, ''));
    setHookCopied(true);
    triggerToast('Hook copied to clipboard');
    window.setTimeout(() => setHookCopied(false), 2000);
  };

  const handleRegenerateHook = () => {
    setHookVariationIdx((prev) => prev + 1);
    setSavedMinutesText('Saved just now');
    triggerToast(`Generated new ${currentHookData.label} hook angle`);
  };

  const handleRegenerateDraft = () => {
    setCustomDraftText(null);
    setIsEditingDraft(false);
    setActiveDraftIdx((prev) => (prev + 1) % DRAFT_VARIATIONS.length);
    setSavedMinutesText('Saved just now');
    triggerToast('Synthesized fresh publication draft');
  };

  const handleCopyAllDraft = () => {
    navigator.clipboard?.writeText(activeTextForCount);
    setDraftCopied(true);
    triggerToast('Full publication draft copied to clipboard');
    window.setTimeout(() => setDraftCopied(false), 2000);
  };

  const handleSaveToQueue = () => {
    if (!savedToQueue) {
      setSavedToQueue(true);
      setLibraryCount((prev) => prev + 1);
      setSavedMinutesText('Saved just now');
      triggerToast('Saved draft to Workspace Library Queue');
    } else {
      setSavedToQueue(false);
      setLibraryCount((prev) => Math.max(48, prev - 1));
      triggerToast('Removed from Queue');
    }
  };

  const handleSendToPlanner = () => {
    const exists = scheduledPosts.some((p) => p.title === currentDraft.title);
    if (!exists) {
      const newSlot: ScheduledPost = {
        id: `sched-${Date.now()}`,
        dateLabel: 'Tuesday, Oct 29',
        timeLabel: '10:00 AM',
        title: currentDraft.title,
        platforms: 'LinkedIn • Newsletter',
        status: 'Scheduled',
        angle: `${currentHookData.label} · ${currentHookData.score}/100`,
      };
      setScheduledPosts((prev) => [newSlot, ...prev]);
    }
    setSavedMinutesText('Saved just now');
    triggerToast('Scheduled draft to Planning Calendar');
  };

  const openModalWithTab = (tab: 'changelog' | 'architecture' | 'metrics') => {
    setChangelogTab(tab);
    setChangelogOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Subtle Floating Action Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-5 right-5 z-[65] px-4 py-2.5 rounded-lg bg-on-surface text-surface-container-lowest shadow-lg flex items-center gap-2 font-label-ui text-label-ui"
          >
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-space-md">
          {/* Left Brand Lockup */}
          <div className="flex items-center gap-space-sm">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveNav('product');
              }}
              className="flex items-center gap-space-sm focus-visible:outline-2 focus-visible:outline-primary rounded-lg"
            >
              <ContentForgeLogo className="h-8 w-auto" />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                ContentForge
              </span>
            </a>
            <button
              onClick={() => openModalWithTab('changelog')}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono uiverse-chip cursor-pointer"
              title="View v0.4 prototype release notes"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              v0.4 exp
            </button>
          </div>

          {/* Center Navigation */}
          <nav
            className="hidden md:flex items-center gap-space-md"
            aria-label="Main Navigation"
          >
            <a
              aria-current={activeNav === 'product' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('product', 'workspace');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNav === 'product'
                  ? 'bg-primary-container text-on-primary-container font-semibold text-label-ui shadow-[0_1px_2px_rgba(0,105,72,0.18)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-ui text-label-ui'
              }`}
              href="#workspace"
            >
              Product
            </a>
            <a
              aria-current={activeNav === 'features' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('features', 'capabilities');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNav === 'features'
                  ? 'bg-primary-container text-on-primary-container font-semibold text-label-ui shadow-[0_1px_2px_rgba(0,105,72,0.18)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-ui text-label-ui'
              }`}
              href="#capabilities"
            >
              Features
            </a>
            <a
              aria-current={activeNav === 'workflow' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('workflow', 'how-it-works');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNav === 'workflow'
                  ? 'bg-primary-container text-on-primary-container font-semibold text-label-ui shadow-[0_1px_2px_rgba(0,105,72,0.18)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-ui text-label-ui'
              }`}
              href="#how-it-works"
            >
              Workflow
            </a>
            <a
              aria-current={activeNav === 'about' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('about', 'atelier-log');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNav === 'about'
                  ? 'bg-primary-container text-on-primary-container font-semibold text-label-ui shadow-[0_1px_2px_rgba(0,105,72,0.18)]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high font-label-ui text-label-ui'
              }`}
              href="#atelier-log"
            >
              About
            </a>
          </nav>

          {/* Right Actions */}
          <div className="relative flex items-center gap-space-sm">
            <button
              onClick={() => openModalWithTab('changelog')}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg font-label-ui text-label-ui text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors whitespace-nowrap cursor-pointer"
            >
              Changelog
            </button>
            <a
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('product', 'workspace');
                setStudioTab('studio');
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui hover:bg-primary-container shadow-[0_1px_3px_rgba(0,0,0,0.08)] uiverse-btn-primary whitespace-nowrap"
              href="#workspace"
            >
              Try ContentForge
            </a>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="Creator Studio Profile"
              className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container flex items-center justify-center ml-1 transition-transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="md:hidden w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Creator Profile Popover */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-72 rounded-xl bg-surface-container-lowest shadow-xl border border-surface-container p-4 z-50 text-left"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-ui text-label-ui">
                        CF
                      </div>
                      <div>
                        <p className="font-label-ui text-label-ui text-on-surface">Atelier Studio</p>
                        <p className="font-label-mono text-label-mono text-on-surface-variant">
                          Voice Fingerprint v0.4
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                      Active
                    </span>
                  </div>
                  <div className="py-3 space-y-2 font-body-sm text-body-sm">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Default Engine</span>
                      <span className="font-mono text-on-surface font-medium">Claude 3.5 Sonnet</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Saved Library Items</span>
                      <span className="font-mono text-primary font-semibold tabular-nums">
                        {libraryCount} items
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      openModalWithTab('changelog');
                    }}
                    className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-ui text-label-ui transition-colors cursor-pointer"
                  >
                    View Release Log #084
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface-container-lowest border-t border-surface-container px-6 py-4 flex flex-col gap-2 shadow-lg"
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('product', 'workspace');
                }}
                href="#workspace"
                className="px-3 py-2 rounded-lg font-label-ui text-label-ui text-on-surface hover:bg-surface-container-low"
              >
                Product
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('features', 'capabilities');
                }}
                href="#capabilities"
                className="px-3 py-2 rounded-lg font-label-ui text-label-ui text-on-surface hover:bg-surface-container-low"
              >
                Features
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('workflow', 'how-it-works');
                }}
                href="#how-it-works"
                className="px-3 py-2 rounded-lg font-label-ui text-label-ui text-on-surface hover:bg-surface-container-low"
              >
                Workflow
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about', 'atelier-log');
                }}
                href="#atelier-log"
                className="px-3 py-2 rounded-lg font-label-ui text-label-ui text-on-surface hover:bg-surface-container-low"
              >
                About
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModalWithTab('changelog');
                }}
                className="text-left px-3 py-2 rounded-lg font-label-ui text-label-ui text-primary hover:bg-surface-container-low"
              >
                Changelog (v0.4 exp)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN CONTENT */}
      <main id="top" className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          {/* HERO SECTION */}
          <section className="relative w-full overflow-hidden bg-surface py-20 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center"
            >
              {/* Meta badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  AI CONTENT WORKSPACE
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono text-label-mono">
                  Active Prototype 0.4
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-headline-xl text-headline-xl text-on-surface max-w-4xl tracking-tight mb-6">
                Create better content. <br className="hidden sm:inline" />
                <span className="text-primary italic font-headline-xl">
                  Without the tool juggling.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10 text-balance">
                ContentForge helps you generate ideas, hooks, captions, and scripts — then organize and plan everything in one high-precision studio canvas.
              </p>

              {/* Action Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
                <a
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui hover:bg-primary-container shadow-sm uiverse-btn-primary whitespace-nowrap"
                  href="#workspace"
                >
                  <span>Explore ContentForge</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
                <a
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-ui text-label-ui hover:bg-surface-container-high shadow-sm uiverse-btn-secondary whitespace-nowrap"
                  href="#how-it-works"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary transition-transform duration-200 group-hover:scale-110">
                    play_circle
                  </span>
                  <span>See how it works</span>
                </a>
              </div>

              {/* Trust line */}
              <div className="inline-flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Built for solo creators, boutique agencies, and thoughtful editorial teams.</span>
              </div>
            </motion.div>
          </section>

          {/* PRODUCT WORKSPACE PREVIEW (Centerpiece UI) */}
          <section className="w-full pb-24 bg-surface px-4 sm:px-6 lg:px-12" id="workspace">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto"
            >
              {/* Studio Frame Wrapper */}
              <div className="w-full rounded-xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col border border-surface-container/60">
                {/* Top Workspace Control Header */}
                <div className="bg-surface-container-low px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-error/80"></div>
                      <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                      <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                    </div>
                    <span className="font-label-mono text-label-mono text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                      workspace/atelier-draft-04
                    </span>
                    <span className="inline-flex items-center gap-1 font-label-mono text-label-mono text-primary font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {savedMinutesText}
                    </span>
                  </div>

                  {/* Studio Mode Tabs */}
                  <div
                    className="flex items-center gap-1 bg-surface-container-high p-1 rounded-lg overflow-x-auto no-scrollbar"
                    role="tablist"
                    aria-label="Studio Workspace Modes"
                  >
                    <button
                      role="tab"
                      aria-selected={studioTab === 'studio'}
                      onClick={() => setStudioTab('studio')}
                      className={`px-3 py-1 rounded font-label-ui text-label-ui transition-all whitespace-nowrap cursor-pointer ${
                        studioTab === 'studio'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Studio
                    </button>
                    <button
                      role="tab"
                      aria-selected={studioTab === 'variations'}
                      onClick={() => setStudioTab('variations')}
                      className={`px-3 py-1 rounded font-label-ui text-label-ui transition-all whitespace-nowrap cursor-pointer ${
                        studioTab === 'variations'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Variations (4)
                    </button>
                    <button
                      role="tab"
                      aria-selected={studioTab === 'calendar'}
                      onClick={() => setStudioTab('calendar')}
                      className={`px-3 py-1 rounded font-label-ui text-label-ui transition-all whitespace-nowrap cursor-pointer ${
                        studioTab === 'calendar'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Planning Calendar
                    </button>
                    <button
                      role="tab"
                      aria-selected={studioTab === 'analytics'}
                      onClick={() => setStudioTab('analytics')}
                      className={`px-3 py-1 rounded font-label-ui text-label-ui transition-all whitespace-nowrap cursor-pointer ${
                        studioTab === 'analytics'
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Analytics Draft
                    </button>
                  </div>

                  {/* Quick Canvas Utility */}
                  <div className="flex items-center gap-2">
                    <span className="font-label-mono text-label-mono text-on-surface-variant hidden sm:inline">
                      Engine: Claude 3.5 Sonnet
                    </span>
                    <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                      Ready
                    </span>
                  </div>
                </div>

                {/* Topic Context Bar */}
                <div className="bg-surface-container-lowest px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container/70">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-eyebrow-caps text-eyebrow-caps text-on-surface-variant uppercase">
                        Active Focus Topic
                      </p>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                        {currentDraft.title}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-mono text-label-mono">
                      #CreatorEconomy
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-mono text-label-mono">
                      LinkedIn &amp; X Thread
                    </span>
                    <button
                      onClick={() => {
                        setTonePresetIdx((prev) => (prev + 1) % TONE_PRESETS.length);
                        triggerToast(`Switched to ${TONE_PRESETS[(tonePresetIdx + 1) % TONE_PRESETS.length]}`);
                      }}
                      className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-ui text-label-ui uiverse-chip cursor-pointer"
                      title="Click to cycle tone calibration"
                    >
                      {TONE_PRESETS[tonePresetIdx]}
                    </button>
                  </div>
                </div>

                {/* TAB 1: STUDIO CANVAS (Default Centerpiece from Mockup) */}
                {studioTab === 'studio' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 bg-surface">
                    {/* LEFT COLUMN: Workbench & Hook Engine (5 cols) */}
                    <div className="lg:col-span-5 bg-surface-container-lowest p-5 lg:p-6 flex flex-col gap-6 lg:border-r lg:border-surface-container/60">
                      {/* Hook Engine Block */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              psychology
                            </span>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">
                              Hook Engine
                            </h3>
                          </div>
                          <span className="font-label-mono text-label-mono text-primary font-medium">
                            3 Generated Angles
                          </span>
                        </div>

                        {/* Angle Selection Chips */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(['curiosity', 'direct', 'contrarian'] as HookAngleId[]).map((angleKey) => {
                            const angleObj = HOOK_ANGLES[angleKey];
                            const isSelected = selectedAngle === angleKey;
                            return (
                              <button
                                key={angleKey}
                                onClick={() => {
                                  setSelectedAngle(angleKey);
                                  setHookVariationIdx(0);
                                }}
                                className={`px-2.5 py-1 rounded font-label-ui text-label-ui uiverse-chip cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                                }`}
                              >
                                {angleObj.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Primary Active Hook Card */}
                        <div className="p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-3">
                          <div className="flex items-center justify-between text-on-surface-variant">
                            <span className="font-eyebrow-caps text-eyebrow-caps uppercase tracking-wider text-primary">
                              Selected Hook Angle
                            </span>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono font-semibold">
                              <span className="material-symbols-outlined text-[13px]">analytics</span>
                              Score: {currentHookData.score}/100
                            </div>
                          </div>
                          <p className="font-body-md text-body-md text-on-surface font-medium leading-snug">
                            {currentHookQuote}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleCopyHook}
                                className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-label-ui text-label-ui hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  {hookCopied ? 'check' : 'content_copy'}
                                </span>{' '}
                                {hookCopied ? 'Copied' : 'Copy'}
                              </button>
                              <button
                                onClick={handleRegenerateHook}
                                className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-label-ui text-label-ui hover:bg-surface-container-high transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">autorenew</span>{' '}
                                Regenerate
                              </button>
                            </div>
                            <span className="font-label-mono text-label-mono text-on-surface-variant">
                              {currentHookCharCount} characters
                            </span>
                          </div>
                        </div>

                        {/* Alternate Inactive Hooks */}
                        <div
                          onClick={() => {
                            setSelectedAngle(alternateAngleId);
                            setHookVariationIdx(0);
                          }}
                          className="p-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex flex-col gap-1 cursor-pointer border border-transparent hover:border-surface-container"
                        >
                          <div className="flex items-center justify-between text-on-surface-variant font-label-mono text-label-mono">
                            <span>
                              {alternateHookData.label} · {alternateHookData.angleIndex}
                            </span>
                            <span>Score: {alternateHookData.score}/100</span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                            {alternateHookData.quotes[0]}
                          </p>
                        </div>
                      </div>

                      {/* Script Outline Beats */}
                      <div className="flex flex-col gap-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              format_list_numbered
                            </span>
                            <h4 className="font-label-ui text-label-ui text-on-surface uppercase tracking-wide">
                              Structured Narrative Outline
                            </h4>
                          </div>
                          <span className="font-label-mono text-label-mono text-on-surface-variant">
                            3 Beats Configured
                          </span>
                        </div>
                        <div className="space-y-2">
                          {NARRATIVE_BEATS.map((beat) => {
                            const isBeatHighlighted = activeBeatSection === beat.targetSection;
                            return (
                              <div
                                key={beat.id}
                                onClick={() => {
                                  setActiveBeatSection((prev) =>
                                    prev === beat.targetSection ? null : beat.targetSection
                                  );
                                }}
                                className={`p-2.5 rounded flex items-start gap-3 transition-all cursor-pointer ${
                                  isBeatHighlighted
                                    ? 'bg-secondary-container/45 ring-1 ring-primary/30'
                                    : 'bg-surface-container-low hover:bg-surface-container'
                                }`}
                              >
                                <span className="font-label-mono text-label-mono text-primary font-bold mt-0.5">
                                  {beat.number}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-label-ui text-label-ui text-on-surface font-medium">
                                    {beat.title}
                                  </p>
                                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                                    {beat.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Output & Caption Canvas (7 cols) */}
                    <div className="lg:col-span-7 bg-surface-container-lowest p-5 lg:p-7 flex flex-col justify-between gap-6">
                      <div className="space-y-4">
                        {/* Canvas Meta Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              article
                            </span>
                            <span className="font-label-ui text-label-ui text-on-surface font-semibold">
                              Generated Publication Draft
                            </span>
                            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                              {currentDraft.platformBadge}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant font-label-mono text-label-mono">
                            <span>Words: {wordCount}</span>
                            <span>•</span>
                            <span>Est. read: {readTimeMin} min</span>
                          </div>
                        </div>

                        {/* Main Draft Canvas Content */}
                        {isEditingDraft ? (
                          <div className="p-4 rounded-lg bg-surface-container-low space-y-3 border border-primary/40">
                            <div className="flex items-center justify-between">
                              <span className="font-label-mono text-label-mono text-primary">
                                Live Inline Editor — Active
                              </span>
                              <button
                                onClick={() => {
                                  setIsEditingDraft(false);
                                  setSavedMinutesText('Saved just now');
                                  triggerToast('Draft changes saved to studio canvas');
                                }}
                                className="px-2.5 py-1 rounded bg-primary text-on-primary font-label-ui text-label-ui cursor-pointer"
                              >
                                Done Editing
                              </button>
                            </div>
                            <textarea
                              value={activeTextForCount}
                              onChange={(e) => setCustomDraftText(e.target.value)}
                              rows={12}
                              className="w-full p-3 rounded bg-surface-container-lowest text-on-surface font-body-md text-body-md leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                            />
                          </div>
                        ) : (
                          <div className="p-5 rounded-lg bg-surface-container-low space-y-4 font-body-md text-body-md text-on-surface leading-relaxed">
                            <div
                              className={`space-y-4 rounded transition-colors ${
                                activeBeatSection === 'intro' ? 'bg-secondary-container/30 p-2 -m-2' : ''
                              }`}
                            >
                              <p className="font-bold text-on-surface">{currentDraft.leadHook}</p>
                              <p>{currentDraft.introParagraph}</p>
                              <p>{currentDraft.bridgeLine}</p>
                            </div>

                            <ul
                              className={`space-y-2 font-body-sm text-body-sm text-on-surface-variant pl-1 rounded transition-colors ${
                                activeBeatSection === 'list' ? 'bg-secondary-container/30 p-2 -m-2' : ''
                              }`}
                            >
                              {currentDraft.tools.map((tool) => (
                                <li key={tool.num} className="flex items-start gap-2">
                                  <span className="font-label-mono text-label-mono text-primary font-bold">
                                    {tool.num}
                                  </span>
                                  <span>
                                    <strong className="text-on-surface">{tool.name}</strong> —{' '}
                                    {tool.detail}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            <p
                              className={`pt-2 text-on-surface font-medium rounded transition-colors ${
                                activeBeatSection === 'cta' ? 'bg-secondary-container/30 p-2 -m-2' : ''
                              }`}
                            >
                              {currentDraft.closingQuestion}
                            </p>

                            {/* Tag drawer */}
                            <div className="pt-2 flex flex-wrap gap-1.5 font-label-mono text-label-mono text-primary">
                              {currentDraft.tags.map((tag) => (
                                <span key={tag}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Floating Intelligence Insight Card */}
                        <div className="p-3.5 rounded-lg bg-surface-container flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                              <span className="material-symbols-outlined text-[18px]">trending_up</span>
                            </div>
                            <div>
                              <p className="font-label-ui text-label-ui text-on-surface font-semibold">
                                Hook Retention Prediction
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {currentHookData.predictionLift}
                              </p>
                            </div>
                          </div>
                          <span className="font-label-mono text-label-mono px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-semibold whitespace-nowrap">
                            {currentHookData.confidence}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Action Pill Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-surface-container-lowest">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={handleRegenerateDraft}
                            className="px-3.5 py-2 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui flex items-center gap-1.5 hover:bg-primary-container shadow-sm uiverse-btn-primary cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                            Regenerate
                          </button>
                          <button
                            onClick={handleSaveToQueue}
                            className={`px-3 py-2 rounded-lg font-label-ui text-label-ui flex items-center gap-1.5 transition-colors cursor-pointer ${
                              savedToQueue
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {savedToQueue ? 'bookmark_added' : 'bookmark'}
                            </span>
                            {savedToQueue ? 'Saved to Queue' : 'Save to Queue'}
                          </button>
                          <button
                            onClick={() => setIsEditingDraft((prev) => !prev)}
                            className={`px-3 py-2 rounded-lg font-label-ui text-label-ui flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isEditingDraft
                                ? 'bg-primary-container text-on-primary-container'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            {isEditingDraft ? 'Editing...' : 'Edit in Place'}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyAllDraft}
                            className="px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-ui text-label-ui flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {draftCopied ? 'check' : 'content_copy'}
                            </span>
                            {draftCopied ? 'Copied All' : 'Copy All'}
                          </button>
                          <button
                            onClick={handleSendToPlanner}
                            className="px-3 py-2 rounded-lg bg-secondary text-on-secondary font-label-ui text-label-ui flex items-center gap-1.5 hover:bg-primary transition-colors uiverse-btn-primary cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              calendar_month
                            </span>
                            Send to Planner
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: VARIATIONS (4) */}
                {studioTab === 'variations' && (
                  <div className="p-6 lg:p-8 bg-surface-container-lowest space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                          4 Parallel Draft Variations Ready
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Select any generated variation below to load it into the primary Studio editor.
                        </p>
                      </div>
                      <button
                        onClick={() => setStudioTab('studio')}
                        className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-ui text-label-ui text-on-surface cursor-pointer"
                      >
                        Return to Split Studio
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {DRAFT_VARIATIONS.map((variation, idx) => {
                        const isCurrent = activeDraftIdx % DRAFT_VARIATIONS.length === idx;
                        return (
                          <div
                            key={variation.id}
                            className={`p-5 rounded-xl flex flex-col justify-between gap-4 border transition-all ${
                              isCurrent
                                ? 'bg-surface-container-low border-primary'
                                : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                            }`}
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                                  {variation.angleLabel}
                                </span>
                                <span className="font-label-mono text-label-mono text-primary font-semibold">
                                  Score: {variation.score}/100
                                </span>
                              </div>
                              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                                {variation.title}
                              </h4>
                              <p className="font-body-sm text-body-sm text-on-surface font-medium">
                                “{variation.leadHook}”
                              </p>
                              <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {variation.introParagraph}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                              <span className="font-label-mono text-label-mono text-on-surface-variant">
                                {variation.platformBadge}
                              </span>
                              <button
                                onClick={() => {
                                  setActiveDraftIdx(idx);
                                  setCustomDraftText(null);
                                  setStudioTab('studio');
                                  triggerToast(`Loaded "${variation.angleLabel}" variation into Studio`);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui hover:bg-primary-container transition-colors cursor-pointer"
                              >
                                {isCurrent ? 'Active in Studio' : 'Load in Studio'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: PLANNING CALENDAR */}
                {studioTab === 'calendar' && (
                  <div className="p-6 lg:p-8 bg-surface-container-lowest space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                          Editorial Planning Calendar &amp; Dispatch Queue
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Drag-free slot scheduling synchronized across LinkedIn, X Threads, and Substack.
                        </p>
                      </div>
                      <button
                        onClick={() => setStudioTab('studio')}
                        className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui cursor-pointer"
                      >
                        + Draft New Slot
                      </button>
                    </div>
                    <div className="space-y-3">
                      {scheduledPosts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0">
                              <span className="material-symbols-outlined text-[18px]">send</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-label-ui text-label-ui text-on-surface font-semibold">
                                  {post.title}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                                  {post.status}
                                </span>
                              </div>
                              <p className="font-label-mono text-label-mono text-on-surface-variant mt-0.5">
                                {post.dateLabel} at {post.timeLabel} • Auto-dispatch: {post.platforms}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span className="font-label-mono text-label-mono text-primary">
                              {post.angle}
                            </span>
                            <button
                              onClick={() => {
                                setStudioTab('studio');
                                triggerToast(`Opened "${post.title}" in Studio`);
                              }}
                              className="px-3 py-1 rounded bg-surface-container-lowest hover:bg-surface-container-high font-label-ui text-label-ui text-on-surface cursor-pointer"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: ANALYTICS DRAFT */}
                {studioTab === 'analytics' && (
                  <div className="p-6 lg:p-8 bg-surface-container-lowest space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                          Pre-Publication Retention &amp; Cadence Telemetry
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Evaluated against 14,200 high-performing creator posts in #CreatorEconomy.
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                        Predicted Lift: +38%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-lg bg-surface-container-low space-y-1">
                        <span className="font-label-mono text-label-mono text-on-surface-variant">
                          OPENING HOOK VELOCITY
                        </span>
                        <p className="font-headline-lg text-headline-lg text-primary font-mono tabular-nums">
                          {currentHookData.score}/100
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          First 7 words trigger strong curiosity hold.
                        </p>
                      </div>
                      <div className="p-5 rounded-lg bg-surface-container-low space-y-1">
                        <span className="font-label-mono text-label-mono text-on-surface-variant">
                          SKIMMABILITY INDEX
                        </span>
                        <p className="font-headline-lg text-headline-lg text-on-surface font-mono tabular-nums">
                          96/100
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          5 numbered beats optimize mobile dwell time.
                        </p>
                      </div>
                      <div className="p-5 rounded-lg bg-surface-container-low space-y-1">
                        <span className="font-label-mono text-label-mono text-on-surface-variant">
                          ESTIMATED READ TIME
                        </span>
                        <p className="font-headline-lg text-headline-lg text-on-surface font-mono tabular-nums">
                          {readTimeMin} min
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {wordCount} words • Ideal LinkedIn &amp; X Thread length.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </section>

          {/* HOW IT WORKS (Three-step editorial flow) */}
          <section className="w-full py-24 bg-surface-container-low px-6 lg:px-12" id="how-it-works">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3 max-w-2xl"
              >
                <span className="font-eyebrow-caps text-eyebrow-caps text-primary uppercase tracking-widest font-semibold">
                  Workflow Orchestration
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  From scattered thoughts to scheduled assets.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  A coherent three-stage pipeline that respects your personal editorial taste without forcing manual grunt work.
                </p>
              </motion.div>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 01 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between gap-6 shadow-sm uiverse-card"
                >
                  <div className="space-y-3">
                    <span className="font-label-mono text-label-mono text-primary font-bold tracking-wider">
                      01 — INPUT
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Start with an idea
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Give ContentForge a topic, goal, or rough thought. Dump messy bullet points, notes, or paste a competitor URL.
                    </p>
                  </div>

                  {/* Micro Component 1: Raw thought parsing */}
                  <div
                    onClick={() => setRawPromptIdx((prev) => (prev + 1) % RAW_PROMPTS.length)}
                    className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-3 cursor-pointer hover:bg-surface-container transition-colors"
                    title="Click to test another raw thought input"
                  >
                    <div className="flex items-center justify-between text-on-surface-variant font-label-mono text-label-mono">
                      <span>raw_prompt.txt</span>
                      <span className="text-primary font-medium">Parsed</span>
                    </div>
                    <div className="p-3 bg-surface-container-lowest rounded text-body-sm font-body-sm text-on-surface font-mono">
                      {RAW_PROMPTS[rawPromptIdx].prompt}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                        {RAW_PROMPTS[rawPromptIdx].thesis}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-mono text-label-mono">
                        {RAW_PROMPTS[rawPromptIdx].platforms}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 02 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between gap-6 shadow-sm uiverse-card"
                >
                  <div className="space-y-3">
                    <span className="font-label-mono text-label-mono text-primary font-bold tracking-wider">
                      02 — SYNTHESIS
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Generate the content
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Create hooks, captions, ideas, and scripts with AI tailored to your unique voice and tone profile.
                    </p>
                  </div>

                  {/* Micro Component 2: Tone & Variations */}
                  <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono text-label-mono text-on-surface-variant">
                        Tone calibration
                      </span>
                      <span className="font-label-mono text-label-mono text-primary font-semibold">
                        {step2Tone === 'Provocative' ? 'Active: Bold' : 'Active: Narrative'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStep2Tone('Story Driven')}
                        className={`p-2 rounded text-center font-label-ui text-label-ui transition-all cursor-pointer ${
                          step2Tone === 'Story Driven'
                            ? 'bg-primary text-on-primary font-semibold shadow-sm'
                            : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        Story Driven
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep2Tone('Provocative')}
                        className={`p-2 rounded text-center font-label-ui text-label-ui transition-all cursor-pointer ${
                          step2Tone === 'Provocative'
                            ? 'bg-primary text-on-primary font-semibold shadow-sm'
                            : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        Provocative
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm pt-1">
                      <span className="text-on-surface-variant">Variations ready:</span>
                      <span className="font-bold text-on-surface">
                        {step2Tone === 'Provocative' ? '4 ready in 1.4s' : '4 ready in 1.2s'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Step 03 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between gap-6 shadow-sm uiverse-card"
                >
                  <div className="space-y-3">
                    <span className="font-label-mono text-label-mono text-primary font-bold tracking-wider">
                      03 — EXECUTION
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Organize &amp; plan
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Keep your content organized and turn ideas into planned posts without context switching across 5 different apps.
                    </p>
                  </div>

                  {/* Micro Component 3: Drag & drop planner slot */}
                  <div
                    onClick={() => {
                      setStudioTab('calendar');
                      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-2.5 cursor-pointer hover:bg-surface-container transition-colors"
                    title="Click to open in Planning Calendar"
                  >
                    <div className="flex items-center justify-between font-label-mono text-label-mono">
                      <span className="text-on-surface-variant">Thursday, Oct 24</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                        Scheduled
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-lowest rounded shadow-sm flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          send
                        </span>
                        <span className="font-label-ui text-label-ui text-on-surface truncate">
                          The Algorithm Shift Post
                        </span>
                      </div>
                      <span className="font-label-mono text-label-mono text-on-surface-variant shrink-0">
                        09:00 AM
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-label-mono text-label-mono text-on-surface-variant pt-1">
                      <span>Auto-dispatch</span>
                      <span className="text-primary font-medium">LinkedIn • Threads</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* PRODUCT CAPABILITIES & FEATURES (Showcase layout) */}
          <section className="w-full py-24 bg-surface px-6 lg:px-12" id="capabilities">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3 max-w-2xl"
              >
                <span className="font-eyebrow-caps text-eyebrow-caps text-primary uppercase tracking-widest font-semibold">
                  Capabilities
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Engineered for depth, not superficial copy-pasting.
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Tools that treat your creative process as an iterative craft rather than a slot machine of generic buzzwords.
                </p>
              </motion.div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Feature 1: Ideas Matrix */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between gap-6 shadow-sm uiverse-card"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Ideas when you’re stuck
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Generate useful content directions instead of staring at a blank page. The idea matrix pairs proven distribution angles with your personal domain topics.
                    </p>
                  </div>

                  {/* Mini idea-spark matrix UI */}
                  <div className="bg-surface-container-low p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between font-label-mono text-label-mono text-on-surface-variant pb-1">
                      <span>Prompt Matrix: Content Strategy</span>
                      <span>12 Generated</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDraftIdx(3);
                          setCustomDraftText(null);
                          setStudioTab('studio');
                          document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                          triggerToast('Loaded idea into Studio Canvas');
                        }}
                        className="text-left p-2.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-body-sm font-body-sm text-on-surface transition-colors cursor-pointer"
                      >
                        “Why unpolished video out-performs 4k studio setups in 2025”
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDraftIdx(1);
                          setCustomDraftText(null);
                          setStudioTab('studio');
                          document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                          triggerToast('Loaded agency metric audit idea into Studio Canvas');
                        }}
                        className="text-left p-2.5 bg-surface-container-lowest hover:bg-surface-container-high rounded text-body-sm font-body-sm text-on-surface transition-colors cursor-pointer"
                      >
                        “The 3 metric audit boutique agencies run before writing any copy”
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Feature 2: Hooks Angle Picker */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between gap-6 shadow-sm uiverse-card"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">hub</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Hooks that earn attention
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Explore different opening angles for your social posts. Test contrarian takes, data-first openings, and narrative bridges with instant readability scores.
                    </p>
                  </div>

                  {/* Angle picker UI */}
                  <div className="bg-surface-container-low p-4 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between font-label-mono text-label-mono text-on-surface-variant">
                      <span>Select Opening Formula</span>
                      <span className="text-primary">Tested On 14k Posts</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-label-ui text-label-ui">
                      {(['Story', 'Statistic', 'Contrarian', 'Step-by-Step'] as const).map(
                        (formula) => (
                          <button
                            key={formula}
                            type="button"
                            onClick={() => setSelectedFormula(formula)}
                            className={`p-2 rounded transition-all cursor-pointer whitespace-nowrap ${
                              selectedFormula === formula
                                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {formula}
                          </button>
                        )
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant p-2 rounded bg-surface-container-lowest italic">
                      {OPENING_FORMULAS[selectedFormula].quote}
                    </p>
                  </div>
                </motion.div>

                {/* Feature 3: Multi-format adapter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between gap-6 shadow-sm uiverse-card"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">devices</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Captions &amp; scripts
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Turn rough ideas into content you can actually work with across LinkedIn, Twitter/X, and YouTube without reformatting manually each time.
                    </p>
                  </div>

                  {/* Multi-platform conversion UI */}
                  <div className="bg-surface-container-low p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between font-label-mono text-label-mono">
                      <span className="text-on-surface-variant">Active Export Preset</span>
                      <span className="text-primary font-medium">Cross-post synchronized</span>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      {(
                        [
                          { label: 'LinkedIn Post', icon: 'feed' },
                          { label: 'X Thread (8x)', icon: 'forum' },
                          { label: 'Shorts Script', icon: 'smart_display' },
                        ] as const
                      ).map((preset) => {
                        const isPresetActive = activeExportPreset === preset.label;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setActiveExportPreset(preset.label);
                              triggerToast(`Export preset set to ${preset.label}`);
                            }}
                            className={`flex-1 p-2 rounded flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                              isPresetActive
                                ? 'bg-surface-container-lowest ring-1 ring-primary/40 shadow-xs'
                                : 'bg-surface-container-lowest hover:bg-surface-container-high'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              {preset.icon}
                            </span>
                            <span className="font-label-ui text-label-ui text-on-surface">
                              {preset.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Feature 4: Unified workspace */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between gap-6 shadow-sm uiverse-card"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">folder_managed</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      One place to organize everything
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Keep your ideas, drafts, and plans together instead of scattered across Notion, Google Docs, Apple Notes, and messaging drafts.
                    </p>
                  </div>

                  {/* Organization stack UI */}
                  <div className="bg-surface-container-low p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between font-label-mono text-label-mono text-on-surface-variant">
                      <span>Workspace Library</span>
                      <span className="text-on-surface">{libraryCount} items saved</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {(
                        ['Inbox (12)', 'In Drafting (5)', 'Scheduled (8)', 'Archive'] as const
                      ).map((folder) => {
                        const isFolderActive = activeLibraryFolder === folder;
                        return (
                          <button
                            key={folder}
                            type="button"
                            onClick={() => setActiveLibraryFolder(folder)}
                            className={`px-3 py-1 rounded font-label-ui text-label-ui transition-colors cursor-pointer whitespace-nowrap ${
                              isFolderActive
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {folder}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* EXPERIMENTAL / IN-PROGRESS PHILOSOPHY SECTION */}
          <section className="w-full py-20 bg-surface-container-low px-6 lg:px-12" id="atelier-log">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-md relative overflow-hidden flex flex-col gap-8">
                {/* Top Status Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Experimental · In Progress
                  </span>
                  <button
                    onClick={() => openModalWithTab('changelog')}
                    className="font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    Atelier Log Entry #084
                  </button>
                </div>

                {/* Main Copy Block */}
                <div className="space-y-4">
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    Still building. Still learning.
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    ContentForge is an experimental project I’m actively refining. I’m exploring the UX, workflows, and features as I build — and this project is intentionally included to show how I approach product and interface problems, not to pretend it’s a finished enterprise product.
                  </p>
                </div>

                {/* Live Product Notes / Roadmap */}
                <div className="bg-surface-container-low p-6 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-label-ui text-label-ui text-on-surface font-semibold uppercase tracking-wide">
                      Product Roadmap &amp; Feature State
                    </h4>
                    <span className="font-label-mono text-label-mono text-primary font-bold">
                      Q1 2025
                    </span>
                  </div>
                  <div className="space-y-3 font-body-md text-body-md text-on-surface">
                    <div
                      onClick={() => openModalWithTab('changelog')}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span className="w-5 h-5 rounded bg-primary flex items-center justify-center text-on-primary text-[14px] shrink-0">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                      <span className="line-through text-on-surface-variant group-hover:text-on-surface transition-colors">
                        Contextual voice fingerprinting
                      </span>
                      <span className="font-label-mono text-label-mono text-primary font-medium ml-auto whitespace-nowrap">
                        Shipped in v0.3
                      </span>
                    </div>
                    <div
                      onClick={() => openModalWithTab('changelog')}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <span className="w-5 h-5 rounded bg-primary flex items-center justify-center text-on-primary text-[14px] shrink-0">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                      <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                        Multi-format cross-posting adapter
                      </span>
                      <span className="font-label-mono text-label-mono text-primary font-medium ml-auto whitespace-nowrap">
                        Active in v0.4
                      </span>
                    </div>
                    <div
                      onClick={() => openModalWithTab('changelog')}
                      className="flex items-center gap-3 text-on-surface-variant cursor-pointer group"
                    >
                      <span className="w-5 h-5 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant text-[14px] shrink-0">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                      </span>
                      <span className="group-hover:text-on-surface transition-colors">
                        Real-time engagement feedback loop
                      </span>
                      <span className="font-label-mono text-label-mono text-on-surface-variant ml-auto whitespace-nowrap">
                        Designing for v0.5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Designer / Builder Signature Note */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-surface-container gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shrink-0">
                      CF
                    </div>
                    <div>
                      <p className="font-label-ui text-label-ui text-on-surface font-semibold">
                        ContentForge Atelier
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Solo design &amp; engineering lab
                      </p>
                    </div>
                  </div>
                  <span className="font-label-mono text-label-mono text-on-surface-variant italic">
                    “Crafted with care, iteration by iteration.”
                  </span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* FINAL CTA & CONVERGENCE */}
          <section className="w-full py-24 bg-surface px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8"
            >
              <span className="font-eyebrow-caps text-eyebrow-caps text-primary uppercase tracking-widest font-semibold">
                Start Drafting Now
              </span>
              <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight max-w-2xl">
                Ready to stop juggling tabs and start publishing?
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Test the prototype workspace directly in your browser. No credit card, no bloated onboarding flow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setStudioTab('studio');
                    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui hover:bg-primary-container shadow-md uiverse-btn-primary whitespace-nowrap"
                  href="#workspace"
                >
                  <span>Try ContentForge</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => openModalWithTab('changelog')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-surface-container text-on-surface font-label-ui text-label-ui hover:bg-surface-container-high uiverse-btn-secondary whitespace-nowrap cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>Read the Dev Log</span>
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-on-surface-variant font-label-mono text-label-mono">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check_circle
                  </span>{' '}
                  Instant access
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check_circle
                  </span>{' '}
                  Export anywhere
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check_circle
                  </span>{' '}
                  Free in prototype stage
                </span>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-space-lg mb-space-xl">
            <div className="md:col-span-2 flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <ContentForgeLogo className="h-7 w-auto" />
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  ContentForge
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                AI-powered content creation, currently in progress.
              </p>
              <div className="flex items-center gap-2 mt-space-xs">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>Systems Operational
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <span className="font-eyebrow-caps text-eyebrow-caps uppercase tracking-wider text-on-surface-variant mb-space-xs">
                Product
              </span>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  setStudioTab('studio');
                  handleNavClick('product', 'workspace');
                }}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="#workspace"
              >
                Studio Editor
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('features', 'capabilities');
                }}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="#capabilities"
              >
                Knowledge Base
              </a>
              <button
                onClick={() => openModalWithTab('changelog')}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Release Notes
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              <span className="font-eyebrow-caps text-eyebrow-caps uppercase tracking-wider text-on-surface-variant mb-space-xs">
                Project Status
              </span>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about', 'atelier-log');
                }}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="#atelier-log"
              >
                Public Roadmap
              </a>
              <button
                onClick={() => openModalWithTab('metrics')}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Model Metrics
              </button>
              <button
                onClick={() => openModalWithTab('architecture')}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Architecture
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              <span className="font-eyebrow-caps text-eyebrow-caps uppercase tracking-wider text-on-surface-variant mb-space-xs">
                Connect
              </span>
              <button
                onClick={() => openModalWithTab('architecture')}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Developer Docs
              </button>
              <button
                onClick={() => openModalWithTab('changelog')}
                className="text-left font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                GitHub Repository
              </button>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about', 'atelier-log');
                }}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                href="#atelier-log"
              >
                Research Notes
              </a>
            </div>
          </div>

          <div className="pt-space-md border-t border-surface-container/60 flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
            <p>© 2025 ContentForge Atelier. Instrumental precision digital publishing.</p>
            <p className="font-label-mono text-label-mono text-on-surface-variant">
              Crafted for modern computational publishing
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Dev Log / Metrics / Architecture Modal */}
      <ChangelogModal
        isOpen={changelogOpen}
        onClose={() => setChangelogOpen(false)}
        activeTab={changelogTab}
        setActiveTab={setChangelogTab}
      />
    </div>
  );
}
