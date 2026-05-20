'use client';

import React from 'react';
import {
  ChessPawn,
  ChessKnight,
  ChessRook,
  ChessQueen,
  ChessKing
} from 'lucide-react';
import { SkillTier } from '@/types';

interface ChessIconProps {
  tier: SkillTier;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export default function ChessIcon({ tier, className, size = 20, style }: ChessIconProps) {
  switch (tier) {
    case 'beginner':
      return <ChessPawn className={className} size={size} style={style} />;
    case 'intermediate':
      return <ChessKnight className={className} size={size} style={style} />;
    case 'advanced':
      return <ChessRook className={className} size={size} style={style} />;
    case 'master':
      return <ChessQueen className={className} size={size} style={style} />;
    case 'grandmaster':
      return <ChessKing className={className} size={size} style={style} />;
    default:
      return null;
  }
}
