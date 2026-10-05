export type HookAngleId = 'curiosity' | 'direct' | 'contrarian';

export interface HookAngleData {
  id: HookAngleId;
  label: string;
  angleIndex: string;
  score: number;
  quotes: string[];
  predictionLift: string;
  confidence: string;
}

export interface NarrativeBeat {
  id: string;
  number: string;
  title: string;
  description: string;
  targetSection: 'intro' | 'list' | 'cta';
}

export interface ToolItem {
  num: string;
  name: string;
  detail: string;
}

export interface DraftVariation {
  id: string;
  title: string;
  angleLabel: string;
  score: number;
  leadHook: string;
  introParagraph: string;
  bridgeLine: string;
  tools: ToolItem[];
  closingQuestion: string;
  tags: string[];
  platformBadge: string;
}

export interface ScheduledPost {
  id: string;
  dateLabel: string;
  timeLabel: string;
  title: string;
  platforms: string;
  status: 'Scheduled' | 'Drafting' | 'Queued';
  angle: string;
}

export interface ChangelogEntry {
  version: string;
  logNumber: string;
  date: string;
  badge: string;
  title: string;
  summary: string;
  highlights: string[];
}

export const HOOK_ANGLES: Record<HookAngleId, HookAngleData> = {
  curiosity: {
    id: 'curiosity',
    label: 'Curiosity Gap',
    angleIndex: 'Angle 01',
    score: 94,
    quotes: [
      '“Most creators use AI for writing. The top 1% use it to buy back 14 hours a week. Here are the 5 tools actually moving the needle:”',
      '“Everyone talks about AI prompts. Almost nobody talks about the 5 workflow systems quietly saving solo studios 14 hours every week:”',
      '“I audited 40 high-output creator studios this quarter. They all dropped generic chatbots for these 5 specialized AI tools:”',
    ],
    predictionLift: 'Predicted +38% engagement lift above your 30-day baseline.',
    confidence: 'High Confidence',
  },
  direct: {
    id: 'direct',
    label: 'Direct Value',
    angleIndex: 'Angle 02',
    score: 88,
    quotes: [
      '“Stop spending 20+ hours creating content every week. Integrate these 5 AI automations into your stack:”',
      '“5 high-leverage AI tools that cut weekly editorial production from 18 hours down to 4 hours without sacrificing voice:”',
      '“The exact 5-tool AI production stack for solo creators who want to publish daily without burning out:”',
    ],
    predictionLift: 'Predicted +29% saves & bookmark rate on LinkedIn & X.',
    confidence: 'Verified Pattern',
  },
  contrarian: {
    id: 'contrarian',
    label: 'Contrarian View',
    angleIndex: 'Angle 03',
    score: 91,
    quotes: [
      '“Using AI to write your posts from scratch is why your engagement is flatlining. Use these 5 orchestration tools instead:”',
      '“Copy-pasting from a chat window isn’t a content workflow. Here is how top editorial teams actually deploy AI in 2025:”',
      '“90% of AI writing tools make you sound like a press release. These 5 studio tools do the opposite:”',
    ],
    predictionLift: 'Predicted +42% reply velocity in the first 90 minutes.',
    confidence: 'High Confidence',
  },
};

export const NARRATIVE_BEATS: NarrativeBeat[] = [
  {
    id: 'beat-01',
    number: '01',
    title: 'Intro Hook & Problem Statement',
    description: 'Contrast manual prompt typing vs deliberate autonomous systems.',
    targetSection: 'intro',
  },
  {
    id: 'beat-02',
    number: '02',
    title: '5-Tool Deep Dive (Time ROI matrix)',
    description: 'Claude for synthesis, Whisper for audio, ContentForge for structuring.',
    targetSection: 'list',
  },
  {
    id: 'beat-03',
    number: '03',
    title: 'Retention Call-to-Action',
    description: 'Prompt readers to comment for the automated workflow playbook checklist.',
    targetSection: 'cta',
  },
];

export const DRAFT_VARIATIONS: DraftVariation[] = [
  {
    id: 'var-01',
    title: '5 AI tools that can save creators hours every week',
    angleLabel: 'Curiosity Gap',
    score: 94,
    leadHook: 'Most creators use AI for writing. The top 1% use it to buy back 14 hours a week.',
    introParagraph:
      'The mistake isn’t using AI. The mistake is treating it like an endless intern you have to micromanage with 40-word prompts every 10 minutes.',
    bridgeLine: 'Here are the 5 tools actually changing the math for boutique creator studios right now:',
    tools: [
      {
        num: '1.',
        name: 'ContentForge',
        detail: 'For orchestrating hooks, captions, and narrative cadence without switching tabs.',
      },
      {
        num: '2.',
        name: 'Descript',
        detail: 'Text-based video editing that removes filler words faster than an audio engineer.',
      },
      {
        num: '3.',
        name: 'Whisper Flow',
        detail: 'Instant high-fidelity voice-to-structured outline for walk-and-talk recording.',
      },
      {
        num: '4.',
        name: 'Midjourney v6',
        detail: 'Editorial, grain-textured cover concepts without stock photo clichés.',
      },
      {
        num: '5.',
        name: 'Claude 3.5 Sonnet',
        detail: 'Synthesizing 20-page industry whitepapers into punchy 7-point breakdowns.',
      },
    ],
    closingQuestion:
      'Which one of these does your current stack actually rely on? Let me know in the replies.',
    tags: ['#Productivity', '#CreatorEconomy', '#AIWriting', '#ContentStrategy'],
    platformBadge: 'Formatted for LinkedIn & Newsletter',
  },
  {
    id: 'var-02',
    title: 'The 14-Hour Editorial Stack Audit',
    angleLabel: 'Direct Value',
    score: 88,
    leadHook: 'Stop spending 20+ hours creating content every week. Integrate these 5 AI automations into your stack:',
    introParagraph:
      'High-output solo creators aren’t typing faster—they’ve eliminated the friction between raw voice notes, hook testing, and multi-platform formatting.',
    bridgeLine: 'Here is the exact 5-part stack saving 14+ hours every single week:',
    tools: [
      {
        num: '1.',
        name: 'ContentForge',
        detail: 'Unified hook scoring, beat outlining, and cross-platform draft adaptation.',
      },
      {
        num: '2.',
        name: 'Descript',
        detail: 'Timeline-free studio audio cleanup and instant rough-cut assembly.',
      },
      {
        num: '3.',
        name: 'Whisper Flow',
        detail: 'Zero-latency voice capture that structures rambling thoughts into clean bullets.',
      },
      {
        num: '4.',
        name: 'Midjourney v6',
        detail: 'Bespoke editorial visual direction tuned to your brand color palette.',
      },
      {
        num: '5.',
        name: 'Claude 3.5 Sonnet',
        detail: 'Deep research synthesis across long-form transcripts and PDF reports.',
      },
    ],
    closingQuestion:
      'Want my full Notion + ContentForge automation checklist? Drop “STACK” below and I’ll send it over.',
    tags: ['#CreatorStack', '#WorkflowAutomation', '#SoloCreator', '#EditorialSystems'],
    platformBadge: 'Formatted for X Thread & LinkedIn',
  },
  {
    id: 'var-03',
    title: 'Why Prompting From Scratch Fails',
    angleLabel: 'Contrarian View',
    score: 91,
    leadHook: 'Using AI to write your posts from scratch is why your engagement is flatlining. Use these 5 orchestration tools instead:',
    introParagraph:
      'Readers can spot raw zero-shot AI copy in 3 seconds. The secret isn’t outsourcing your voice—it’s using specialized tools to structure your own original insights.',
    bridgeLine: 'These 5 studio tools preserve your voice while cutting grunt work by 70%:',
    tools: [
      {
        num: '1.',
        name: 'ContentForge',
        detail: 'Pairs your personal voice fingerprint with proven opening hook architectures.',
      },
      {
        num: '2.',
        name: 'Descript',
        detail: 'Cuts 90 minutes of manual waveform editing down to a 4-minute transcript pass.',
      },
      {
        num: '3.',
        name: 'Whisper Flow',
        detail: 'Captures your natural spoken cadence before an algorithm can flatten it.',
      },
      {
        num: '4.',
        name: 'Midjourney v6',
        detail: 'Generates custom publication imagery that looks shot on 35mm film.',
      },
      {
        num: '5.',
        name: 'Claude 3.5 Sonnet',
        detail: 'Stress-tests your counter-arguments and surfaces blind spots in your draft.',
      },
    ],
    closingQuestion:
      'Where do you draw the line between AI assistance and human taste? Curious to hear your take.',
    tags: ['#ContentCraft', '#EditorialTaste', '#AIWorkflows', '#CreatorEconomy'],
    platformBadge: 'Formatted for LinkedIn & Substack Notes',
  },
  {
    id: 'var-04',
    title: 'Why Unpolished Video Out-Performs 4K Setups',
    angleLabel: 'Story Driven',
    score: 92,
    leadHook: 'Why unpolished video out-performs $12,000 4K studio setups in 2025 (and the 5 tools powering the shift):',
    introParagraph:
      'Over-produced studio lighting now triggers "ad blindness" in under 1.4 seconds. Audiences reward immediacy, sharp opening hooks, and tight narrative pacing.',
    bridgeLine: 'Here is the lightweight 5-tool kit replacing bloated production pipelines:',
    tools: [
      {
        num: '1.',
        name: 'ContentForge',
        detail: 'Tests 4 distinct opening hook angles before you ever hit record.',
      },
      {
        num: '2.',
        name: 'Descript',
        detail: 'Removes dead air and tightens pacing while keeping natural room tone intact.',
      },
      {
        num: '3.',
        name: 'Whisper Flow',
        detail: 'Turns a 3-minute walk-and-talk memo into a 3-beat video script.',
      },
      {
        num: '4.',
        name: 'Midjourney v6',
        detail: 'Creates high-contrast storyboards and B-roll visual anchors in seconds.',
      },
      {
        num: '5.',
        name: 'Claude 3.5 Sonnet',
        detail: 'Extracts 5 standalone social clips and newsletter takeaways from one script.',
      },
    ],
    closingQuestion:
      'Are you leaning more toward raw high-insight posts or polished studio production this quarter?',
    tags: ['#VideoStrategy', '#CreatorEconomy', '#ShortFormScript', '#ContentForge'],
    platformBadge: 'Formatted for Shorts Script & LinkedIn',
  },
];

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'sched-1',
    dateLabel: 'Thursday, Oct 24',
    timeLabel: '09:00 AM',
    title: 'The Algorithm Shift Post',
    platforms: 'LinkedIn • Threads',
    status: 'Scheduled',
    angle: 'Contrarian · 94/100',
  },
  {
    id: 'sched-2',
    dateLabel: 'Friday, Oct 25',
    timeLabel: '11:30 AM',
    title: 'Why Newsletters Beat Social Algorithms in 2025',
    platforms: 'LinkedIn • Substack',
    status: 'Scheduled',
    angle: 'Curiosity Gap · 92/100',
  },
  {
    id: 'sched-3',
    dateLabel: 'Monday, Oct 28',
    timeLabel: '08:45 AM',
    title: 'The 3 Metric Audit Boutique Agencies Run',
    platforms: 'X Thread (8x) • LinkedIn',
    status: 'Queued',
    angle: 'Direct Value · 89/100',
  },
];

export const OPENING_FORMULAS: Record<
  'Story' | 'Statistic' | 'Contrarian' | 'Step-by-Step',
  { quote: string; readability: string }
> = {
  Story: {
    quote:
      '“Last Tuesday I deleted 4separate productivity apps and rebuilt our entire editorial calendar on a single canvas.”',
    readability: 'Grade 6 · 96% Hook Hold',
  },
  Statistic: {
    quote:
      '“73% of solo creators lose 6.5 hours a week just reformatting the same core idea across LinkedIn, X, and YouTube.”',
    readability: 'Grade 7 · 92% Hook Hold',
  },
  Contrarian: {
    quote:
      '“Most creators obsess over cadence. Quality retention is actually driven by the first 7 words.”',
    readability: 'Grade 5 · 94% Hook Hold',
  },
  'Step-by-Step': {
    quote:
      '“How to turn one 4-minute voice note into a LinkedIn essay, an 8-post X thread, and a Shorts script in 10 minutes:”',
    readability: 'Grade 6 · 91% Hook Hold',
  },
};

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: 'v0.4 exp',
    logNumber: 'Atelier Log Entry #084',
    date: 'October 2025',
    badge: 'Active Prototype',
    title: 'Multi-Format Cross-Posting Adapter & Hook Engine v2',
    summary:
      'Introduced real-time hook scoring across Curiosity Gap, Direct Value, and Contrarian angles alongside synchronized export presets for LinkedIn, X Threads, and Shorts Scripts.',
    highlights: [
      'Hook Engine now scores opening cadence against 14k benchmarked creator posts.',
      'Structured 3-beat narrative outline links directly to live draft blocks.',
      'One-click Send to Planner dispatches drafts directly to the weekly slot queue.',
    ],
  },
  {
    version: 'v0.3',
    logNumber: 'Atelier Log Entry #079',
    date: 'September 2025',
    badge: 'Shipped',
    title: 'Contextual Voice Fingerprinting & Tone Calibration',
    summary:
      'Added custom tone calibration profiles (Analytical, Story Driven, Provocative) that preserve personal vocabulary and sentence rhythm.',
    highlights: [
      'Eliminated generic AI transition phrases through negative-constraint voice profiles.',
      'Added raw_prompt.txt parser for messy voice notes and URL thesis extraction.',
    ],
  },
  {
    version: 'v0.5 (Next)',
    logNumber: 'Atelier Roadmap Preview',
    date: 'Q1 2025 Target',
    badge: 'Designing',
    title: 'Real-Time Engagement Feedback Loop',
    summary:
      'Closing the loop between published post analytics and pre-publication hook retention predictions.',
    highlights: [
      'Automated 30-day baseline calibration per connected social channel.',
      'Side-by-side A/B hook retention retrospectives inside the Studio canvas.',
    ],
  },
];
