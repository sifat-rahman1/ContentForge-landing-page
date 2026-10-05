import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CHANGELOG_ENTRIES } from '../data/studioData';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'changelog' | 'architecture' | 'metrics';
  setActiveTab: (tab: 'changelog' | 'architecture' | 'metrics') => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({
  isOpen,
  onClose,
  activeTab = 'changelog',
  setActiveTab,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-on-surface/35 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl rounded-xl bg-surface-container-lowest shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="atelier-modal-title"
          >
            {/* Modal Top Header */}
            <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between gap-4 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Atelier Dev Log
                </span>
                <h3 id="atelier-modal-title" className="font-headline-sm text-headline-sm text-on-surface">
                  ContentForge Engineering Notes
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Sub-navigation tabs */}
            <div className="px-6 pt-3 bg-surface-container-lowest border-b border-surface-container flex items-center gap-2">
              <button
                onClick={() => setActiveTab('changelog')}
                className={`px-3 py-2 text-label-ui font-label-ui border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'changelog'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Release Notes &amp; Roadmap
              </button>
              <button
                onClick={() => setActiveTab('metrics')}
                className={`px-3 py-2 text-label-ui font-label-ui border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'metrics'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Model Metrics
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-2 text-label-ui font-label-ui border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Studio Architecture
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {activeTab === 'changelog' && (
                <div className="space-y-5">
                  {CHANGELOG_ENTRIES.map((entry) => (
                    <div
                      key={entry.version}
                      className="p-5 rounded-lg bg-surface-container-low space-y-3 border border-surface-container"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-mono text-label-mono">
                            {entry.version}
                          </span>
                          <span className="font-label-mono text-label-mono text-on-surface-variant">
                            {entry.logNumber}
                          </span>
                        </div>
                        <span className="font-label-mono text-label-mono text-primary">
                          {entry.date} · {entry.badge}
                        </span>
                      </div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">
                        {entry.title}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {entry.summary}
                      </p>
                      <ul className="space-y-1.5 pt-1">
                        {entry.highlights.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface"
                          >
                            <span className="material-symbols-outlined text-primary text-[15px] mt-0.5">
                              check_circle
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="space-y-4">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Benchmark performance of the v0.4 Hook Engine and Cross-Posting Adapter across 14,000 analyzed creator posts.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-lg bg-surface-container-low">
                      <span className="font-label-mono text-label-mono text-on-surface-variant">
                        Hook Evaluation Latency
                      </span>
                      <p className="font-headline-md text-headline-md text-primary mt-1 font-mono tabular-nums">
                        1.4s avg
                      </p>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        4 parallel variations
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-container-low">
                      <span className="font-label-mono text-label-mono text-on-surface-variant">
                        30-Day Retention Lift
                      </span>
                      <p className="font-headline-md text-headline-md text-primary mt-1 font-mono tabular-nums">
                        +38.4%
                      </p>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Curiosity &amp; Contrarian
                      </span>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-container-low">
                      <span className="font-label-mono text-label-mono text-on-surface-variant">
                        Corpus Calibration
                      </span>
                      <p className="font-headline-md text-headline-md text-primary mt-1 font-mono tabular-nums">
                        14,200
                      </p>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        High-retention posts
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="space-y-4">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    ContentForge separates ideation, structural narrative beats, and channel formatting into three deterministic stages rather than a single opaque chat prompt.
                  </p>
                  <div className="p-4 rounded-lg bg-surface-container-low space-y-3 font-mono text-label-mono">
                    <div className="flex items-center justify-between text-primary">
                      <span>STAGE 01 · THESIS PARSER</span>
                      <span>raw_prompt.txt → structured_intent</span>
                    </div>
                    <div className="p-3 rounded bg-surface-container-lowest text-on-surface">
                      Extracts core thesis, target audience friction, and primary proof points before generating any prose.
                    </div>
                    <div className="flex items-center justify-between text-primary pt-2">
                      <span>STAGE 02 · HOOK &amp; BEAT SYNTHESIS</span>
                      <span>Claude 3.5 Sonnet · Voice Profile v0.4</span>
                    </div>
                    <div className="p-3 rounded bg-surface-container-lowest text-on-surface">
                      Evaluates 3 opening angles (Curiosity Gap, Direct Value, Contrarian) and maps a 3-beat narrative outline.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container-low px-6 py-3.5 flex items-center justify-between border-t border-surface-container">
              <span className="font-label-mono text-label-mono text-on-surface-variant">
                ContentForge Atelier · Prototype 0.4
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui hover:bg-primary-container transition-colors cursor-pointer"
              >
                Back to Workspace
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
