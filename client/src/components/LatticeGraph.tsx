'use client';

import { motion } from 'framer-motion';
import { SkillTier, TIER_COLORS, TIER_ORDER } from '@/types';
import ChessIcon from './ChessIcon';

interface LatticeGraphProps {
  activeLeft?: SkillTier;
  activeRight?: SkillTier;
  result?: SkillTier | null;
}

const CHAIN: SkillTier[] = ['beginner', 'intermediate', 'advanced', 'master', 'grandmaster'];

export default function LatticeGraph({ activeLeft, activeRight, result }: LatticeGraphProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
      {CHAIN.map((tier, idx) => {
        const isLeft = activeLeft === tier;
        const isRight = activeRight === tier;
        const isResult = result === tier;
        const color = TIER_COLORS[tier];
        
        const isActive = isLeft || isRight || isResult;
        const opacity = isActive || (!activeLeft && !activeRight) ? 1 : 0.4;
        
        let border = '1px solid transparent';
        if (isResult) border = `1px solid ${color}`;
        else if (isLeft && isRight) border = `1px dashed ${color}`;
        else if (isLeft) border = `1px solid var(--terminal-accent)`;
        else if (isRight) border = `1px solid var(--tier-grandmaster)`;

        return (
          <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: '6px',
                border,
                background: isActive ? `${color}20` : 'transparent',
                opacity,
              }}
              animate={isResult ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 1, repeat: isResult ? Infinity : 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '14px', width: '14px' }}>
                <ChessIcon tier={tier} size={14} style={{ color }} />
              </div>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono), monospace', color: '#ccc', textTransform: 'uppercase', marginTop: '2px' }}>
                {tier}
              </span>
            </motion.div>
            
            {idx < CHAIN.length - 1 && (
              <div style={{ color: 'var(--terminal-system)', fontSize: '12px', opacity: 0.5 }}>
                →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
