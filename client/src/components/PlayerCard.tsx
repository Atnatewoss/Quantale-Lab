'use client';

import { motion } from 'framer-motion';
import { Player, TIER_COLORS, TIER_LABELS, TIER_ELO, TIER_ORDER, LATTICE_SYMBOLS } from '@/types';
import ChessIcon from './ChessIcon';

interface PlayerCardProps {
  player: Player;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  side: 'left' | 'right';
}

export default function PlayerCard({ player, isSelected, onClick, index, side }: PlayerCardProps) {
  const color = TIER_COLORS[player.tier];
  const label = TIER_LABELS[player.tier];
  const elo = TIER_ELO[player.tier];
  const lattice = LATTICE_SYMBOLS[player.tier];

  return (
    <motion.div
      className={`player-card minimalist-card tier-${player.tier} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      layout
      style={{
        '--card-color': color,
        border: isSelected ? `2px solid ${color}` : `1px solid rgba(255, 255, 255, 0.08)`,
        boxShadow: isSelected ? `0 0 12px ${color}20, inset 0 0 10px ${color}04` : 'none',
      } as React.CSSProperties}
    >
      {/* Top Header Row (Lattice Representation & Stage) */}
      <div className="card-header-minimal">
        <span style={{ fontSize: '10px', opacity: 0.5, fontFamily: 'var(--font-mono), monospace', color }}>
          LATTICE: {lattice}
        </span>
        <span className="card-sub-minimal">STAGE {TIER_ORDER[player.tier]}</span>
      </div>

      {/* Bottom Footer (Chess Icon + Level & ELO) */}
      <div className="card-footer-minimal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChessIcon tier={player.tier} size={15} style={{ color }} />
          <span className="card-name-minimal">{label}</span>
        </div>
        <span className="card-elo-val" style={{ color }}>{elo} ELO</span>
      </div>
    </motion.div>
  );
}
