export interface GameItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
  status?: string; // For Stalker theme
}

export const adventurerGames: GameItem[] = [
  {
    id: 'gravity-drift',
    title: 'Gravity Drift',
    description: 'A physics-based relaxation game. Control particles with your cursor or touch.',
    link: 'https://gravity-drift.vercel.app/',
    image: '/images/games/gravity.png'
  },
  {
    id: 'memory-matrix',
    title: 'Memory Matrix',
    description: 'Test your cognitive recall. Match the patterns before they vanish.',
    link: 'https://memory-matrix-gilt.vercel.app/',
    image: '/images/games/memory.png'
  },
  {
    id: 'neon-runner',
    title: 'Neon Runner',
    description: 'An endless runner set in a synthwave universe. Tap to jump, hold to glide.',
    link: 'https://neon-runner-five.vercel.app/',
    image: '/images/games/neon.png'
  },
  {
    id: 'color-cascade',
    title: 'Color Cascade',
    description: 'Match falling colors to the beat. A rhythm game for your eyes.',
    link: 'https://color-cascade-mu.vercel.app/',
    image: '/images/games/color.png'
  }
];

export const stalkerGames: GameItem[] = [
  {
    id: 'brute-force',
    title: 'Brute Force',
    description: 'Crack the 4-digit vault code using logic and deduction before time runs out.',
    link: 'https://brute-force-peach.vercel.app/',
    status: 'LOCKED',
    image: '/images/games/brute-force.png'
  },
  {
    id: 'pattern-lock',
    title: 'Pattern Lock',
    description: 'Trace the complex security patterns. One wrong move triggers the alarm.',
    link: 'https://pattern-lock-amber.vercel.app/',
    status: 'ACTIVE',
    image: '/images/games/pattern-lock.png'
  },
  {
    id: 'terminal-velocity',
    title: 'Terminal Velocity',
    description: 'How fast can you inject code? A typing speed test for elite hackers.',
    link: 'https://terminal-velocity-six.vercel.app/',
    status: 'READY',
    image: '/images/games/terminal-velocity.png'
  },
  {
    id: 'signal-intercept',
    title: 'Signal Intercept',
    description: 'Align the frequencies to intercept the secret message.',
    link: 'https://signal-intercept.vercel.app/',
    status: 'WAITING',
    image: '/images/games/signal-intercept.png'
  }
];