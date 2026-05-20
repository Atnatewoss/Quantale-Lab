export type SkillTier = 'beginner' | 'intermediate' | 'advanced' | 'master' | 'grandmaster';

export interface Player {
  id: string;
  name: string;
  tier: SkillTier;
  team: 'left' | 'right';
}

export const TIER_ORDER: Record<SkillTier, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  master: 4,
  grandmaster: 5,
};

export const TIER_COLORS: Record<SkillTier, string> = {
  beginner: '#64748b',      /* Cool slate */
  intermediate: '#94a3b8',  /* Muted steel */
  advanced: '#cbd5e1',      /* Silver */
  master: '#f1f5f9',        /* Platinum */
  grandmaster: '#fbbf24',   /* Soft gold highlight */
};

export const TIER_LABELS: Record<SkillTier, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  master: 'Master',
  grandmaster: 'Grandmaster',
};

export const TIER_SYMBOLS: Record<SkillTier, string> = {
  beginner: '♙',
  intermediate: '♘',
  advanced: '♖',
  master: '♕',
  grandmaster: '♔',
};

export const LATTICE_SYMBOLS: Record<SkillTier, string> = {
  beginner: '⊥',
  intermediate: '⊏',
  advanced: '⊑',
  master: '⊏⊤',
  grandmaster: '⊤',
};

export const TIER_ELO: Record<SkillTier, number> = {
  beginner: 1000,
  intermediate: 1400,
  advanced: 1800,
  master: 2200,
  grandmaster: 2600,
};
