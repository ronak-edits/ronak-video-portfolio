export const SERVICES_DATA = [
  {
    id: 'long-form',
    iconName: 'Clapperboard',
    title: 'Long-Form Video Editing',
    description:
      'Structured narrative edits for YouTube videos, documentaries, and interviews designed to sustain viewer retention.',
    deliverables: [
      'Full assembly & narrative pacing',
      'B-roll sourcing & audio sweetening',
      'Thumbnail frame & chapter timestamps',
    ],
    pricingLabel: null, // Optional pricing slot — populated only when real rates are supplied
  },
  {
    id: 'reels-shorts',
    iconName: 'Zap',
    title: 'Social Media Reels & Shorts',
    description:
      'High-retention vertical edits built for Instagram Reels, YouTube Shorts, and TikTok with crisp hooks and kinetic pacing.',
    deliverables: [
      '9:16 vertical formatting & framing',
      'Styled dynamic captions & SFX',
      'First-3-second hook optimization',
    ],
    pricingLabel: null,
  },
  {
    id: 'color-grading',
    iconName: 'Palette',
    title: 'Color Grading',
    description:
      'Primary correction and cinematic look development to give raw footage tonal consistency and visual depth.',
    deliverables: [
      'Shot matching & exposure balancing',
      'Custom look development / LUT workflow',
      'Skin-tone preservation & export profiles',
    ],
    pricingLabel: null,
  },
  {
    id: 'motion-graphics',
    iconName: 'Sparkles',
    title: 'Motion Graphics',
    description:
      'Clean animated titles, lower thirds, callouts, and visual explainers that elevate story clarity without clutter.',
    deliverables: [
      'Custom title cards & lower thirds',
      'UI / screen-recording callouts',
      'Smooth bespoke transitions',
    ],
    pricingLabel: null,
  },
  {
    id: 'brand-commercial',
    iconName: 'Flame',
    title: 'Brand & Commercial Videos',
    description:
      'High-impact product launches, brand films, and campaign edits built to communicate value and convert attention.',
    deliverables: [
      'Campaign cutdowns (16:9, 1:1, 9:16)',
      'Sound design & licensed track mixing',
      'Brand-consistent typography & color',
    ],
    pricingLabel: null,
  },
  {
    id: 'course-education',
    iconName: 'GraduationCap',
    title: 'Course & Educational Videos',
    description:
      'Clear, distraction-free module edits for educators and cohort creators with structured pacing and visual cues.',
    deliverables: [
      'Multi-cam or talking-head polish',
      'Slide, diagram & screen-share integration',
      'Consistent module-to-module packaging',
    ],
    pricingLabel: null,
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discovery',
    description:
      'Align on your vision, audience, goals, timeline, and reference style before cutting begins.',
  },
  {
    step: '02',
    title: 'Footage Review',
    description:
      'Share raw footage and assets; footage is reviewed, logged, and mapped into an edit plan.',
  },
  {
    step: '03',
    title: 'First Cut',
    description:
      'An initial cut focusing on pacing, story arc, and structure is shared for early review.',
  },
  {
    step: '04',
    title: 'Revisions',
    description:
      'Collaborative feedback rounds refine timing, graphics, color, and sound until every frame lands.',
  },
  {
    step: '05',
    title: 'Final Delivery',
    description:
      'Master exports delivered in all required aspect ratios and specs via secure cloud transfer.',
  },
];
