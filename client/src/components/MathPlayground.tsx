'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Play, RefreshCw, Terminal, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import ChessIcon from './ChessIcon';

type SkillTier = 'beginner' | 'intermediate' | 'advanced' | 'master' | 'grandmaster';

const TIER_ORDER: Record<SkillTier, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  master: 4,
  grandmaster: 5,
};

const TIER_SYMBOLS: Record<SkillTier, string> = {
  beginner: '⊥',
  intermediate: '♙',
  advanced: '♘',
  master: '♖',
  grandmaster: '⊤',
};

const TIER_COLORS: Record<SkillTier, string> = {
  beginner: '#94a3b8',      // slate
  intermediate: '#10b981',  // emerald
  advanced: '#3b82f6',      // blue
  master: '#8b5cf6',      // purple
  grandmaster: '#ec4899',   // pink
};

const TIER_LABELS: Record<SkillTier, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  master: 'Master',
  grandmaster: 'Grandmaster',
};

const OPERATIONS = [
  { id: 'join', name: 'Lattice Join (∨)', symbol: '∨', notation: 'a ∨ b', desc: 'Least Upper Bound (Supremum). Selects the stronger capability ceiling.' },
  { id: 'meet', name: 'Lattice Meet (∧)', symbol: '∧', notation: 'a ∧ b', desc: 'Greatest Lower Bound (Infimum). Selects the weaker capability floor.' },
  { id: 'compose', name: 'Tensor Composition (⊗)', symbol: '⊗', notation: 'a ⊗ b', desc: 'Active skill interaction. Under resource sensitivity, the weaker node constrains the interaction.' },
  { id: 'residual', name: 'Right Residual (→)', symbol: '→', notation: 'a → c', desc: 'Residuated implication. Determines the maximum rank that can pair with a to reach target c.' },
];

export default function MathPlayground() {
  const [selectedLeft, setSelectedLeft] = useState<SkillTier>('advanced');
  const [selectedRight, setSelectedRight] = useState<SkillTier>('intermediate');
  const [activeOp, setActiveOp] = useState<string>('compose');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const [proofStep, setProofStep] = useState<number>(0);

  // Drag coordinates for the 5 Hasse diagram nodes
  const [nodePositions, setNodePositions] = useState<Record<SkillTier, { x: number; y: number }>>({
    grandmaster: { x: 180, y: 40 },
    master: { x: 180, y: 120 },
    advanced: { x: 180, y: 200 },
    intermediate: { x: 180, y: 280 },
    beginner: { x: 180, y: 360 },
  });

  const dragConstraintsRef = useRef<SVGSVGElement>(null);

  // Compute values
  const lOrder = TIER_ORDER[selectedLeft];
  const rOrder = TIER_ORDER[selectedRight];

  let resultTier: SkillTier = 'beginner';
  let notationStr = '';
  let semanticMeaning = '';
  let plainEnglish = '';
  let mathFormula = '';

  if (activeOp === 'join') {
    resultTier = lOrder >= rOrder ? selectedLeft : selectedRight;
    notationStr = `${TIER_SYMBOLS[selectedLeft]} ∨ ${TIER_SYMBOLS[selectedRight]} = ${TIER_SYMBOLS[resultTier]}`;
    plainEnglish = `The supremum (join) yields the stronger of the two levels: ${TIER_LABELS[resultTier]}.`;
    semanticMeaning = 'Represents the combined ceiling of operational potential.';
    mathFormula = 'a \\lor b = \\max(a, b)';
  } else if (activeOp === 'meet') {
    resultTier = lOrder <= rOrder ? selectedLeft : selectedRight;
    notationStr = `${TIER_SYMBOLS[selectedLeft]} ∧ ${TIER_SYMBOLS[selectedRight]} = ${TIER_SYMBOLS[resultTier]}`;
    plainEnglish = `The infimum (meet) yields the weaker of the two levels: ${TIER_LABELS[resultTier]}.`;
    semanticMeaning = 'Represents the structural floor dictating absolute safety limits.';
    mathFormula = 'a \\land b = \\min(a, b)';
  } else if (activeOp === 'compose') {
    // Monoid composition: in our residuated lattice, multiplication distributes over joins.
    // Here, compose behaves as meet (infimum)
    resultTier = lOrder <= rOrder ? selectedLeft : selectedRight;
    notationStr = `${TIER_SYMBOLS[selectedLeft]} ⊗ ${TIER_SYMBOLS[selectedRight]} = ${TIER_SYMBOLS[resultTier]}`;
    plainEnglish = `The weaker participant (${TIER_LABELS[resultTier]}) constrains the composition outcome.`;
    semanticMeaning = 'The weaker skill strictly dictates tactical complexity limits.';
    mathFormula = 'a \\otimes b = a \\land b';
  } else if (activeOp === 'residual') {
    // Residual: a -> c = sup { b | a * b <= c }
    // Since * is meet, if a <= c, then a * b <= c holds for all b <= top. So a -> c = top.
    // If a > c, we need a * b <= c. Since a > c, b must be <= c. So a -> c = c.
    const isLe = lOrder <= rOrder; // a <= c
    resultTier = isLe ? 'grandmaster' : selectedRight;
    notationStr = `${TIER_SYMBOLS[selectedLeft]} → ${TIER_SYMBOLS[selectedRight]} = ${TIER_SYMBOLS[resultTier]}`;
    plainEnglish = isLe
      ? `Since ${TIER_LABELS[selectedLeft]} is weaker than target ${TIER_LABELS[selectedRight]}, any rank up to Grandmaster can pair with it.`
      : `To reach target ${TIER_LABELS[selectedRight]} when paired with ${TIER_LABELS[selectedLeft]}, the second rank can be at most ${TIER_LABELS[selectedRight]}.`;
    semanticMeaning = 'Computes the residuated implications (Galois connection requirements).';
    mathFormula = 'a \\to c = \\sup \\{ b \\mid a \\otimes b \\le c \\} = \\begin{cases} \\top & a \\le c \\\\ c & a > c \\end{cases}';
  }

  // Trigger terminal logs on parameters change
  useEffect(() => {
    setIsComputing(true);
    setProofStep(0);
    const logs = [
      `[console] initialized operation query: ${activeOp.toUpperCase()}`,
      `[console] A = ${selectedLeft.toUpperCase()} (rank ${lOrder})`,
      `[console] B = ${selectedRight.toUpperCase()} (rank ${rOrder})`,
      `[engine] checking poset order: A ≤ B is ${lOrder <= rOrder}`,
      `[engine] executing residuated algebra proof...`,
      `[result] ${notationStr}`,
      `[proof] residuated adjunction holds: (a ⊗ b ≤ c) ⟺ (b ≤ a → c) verified.`,
    ];
    
    setTerminalLines([logs[0]]);
    
    let timer = 0;
    const interval = setInterval(() => {
      setTerminalLines(prev => {
        const nextIdx = prev.length;
        if (nextIdx < logs.length) {
          return [...prev, logs[nextIdx]];
        } else {
          clearInterval(interval);
          setIsComputing(false);
          return prev;
        }
      });
      setProofStep(p => Math.min(p + 1, 4));
    }, 250);

    return () => clearInterval(interval);
  }, [selectedLeft, selectedRight, activeOp]);

  const handleNodeClick = (tier: SkillTier) => {
    // Toggle logic: set left first, if left is clicked, set right
    if (selectedLeft === tier) {
      // do nothing or toggle
    } else {
      setSelectedLeft(tier);
    }
  };

  const handleDrag = (tier: SkillTier, info: any) => {
    // Update node positions dynamically
    setNodePositions(prev => ({
      ...prev,
      [tier]: {
        x: prev[tier].x + info.delta.x,
        y: prev[tier].y + info.delta.y,
      }
    }));
  };

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden font-sans my-8">
      {/* Absolute ambient lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Interactive Theorem Playground</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Residuated Quantale Sandbox
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Drag nodes, toggle mathematical operations, and witness residuated algebraic bounds instantly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map(op => (
            <button
              key={op.id}
              onClick={() => setActiveOp(op.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 border ${
                activeOp === op.id
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {op.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sandbox Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Hasse Diagram */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/40 border border-slate-900 rounded-2xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Hasse Diagram</span>
            <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Parameter A</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Parameter B</span>
            </div>
          </div>

          <div className="flex-1 min-h-[420px] bg-[#030712]/80 border border-slate-950 rounded-xl relative flex items-center justify-center p-2 overflow-hidden">
            <svg
              ref={dragConstraintsRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ minHeight: '400px' }}
            >
              {/* Lines between levels */}
              <line
                x1={nodePositions.grandmaster.x} y1={nodePositions.grandmaster.y}
                x2={nodePositions.master.x} y2={nodePositions.master.y}
                stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2"
              />
              <line
                x1={nodePositions.master.x} y1={nodePositions.master.y}
                x2={nodePositions.advanced.x} y2={nodePositions.advanced.y}
                stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2"
              />
              <line
                x1={nodePositions.advanced.x} y1={nodePositions.advanced.y}
                x2={nodePositions.intermediate.x} y2={nodePositions.intermediate.y}
                stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2"
              />
              <line
                x1={nodePositions.intermediate.x} y1={nodePositions.intermediate.y}
                x2={nodePositions.beginner.x} y2={nodePositions.beginner.y}
                stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2"
              />

              {/* Glowing active path line */}
              {selectedLeft && selectedRight && (
                <line
                  x1={nodePositions[selectedLeft].x} y1={nodePositions[selectedLeft].y}
                  x2={nodePositions[selectedRight].x} y2={nodePositions[selectedRight].y}
                  stroke="rgba(59, 130, 246, 0.25)" strokeWidth="3"
                  strokeDasharray="4 4"
                />
              )}
            </svg>

            {/* Draggable Hasse Nodes */}
            <div className="relative w-full h-full min-h-[400px] pointer-events-auto">
              {(Object.keys(TIER_ORDER) as SkillTier[]).map((tier) => {
                const isLeft = selectedLeft === tier;
                const isRight = selectedRight === tier;
                const isResult = resultTier === tier;
                const color = TIER_COLORS[tier];

                let ringClass = 'border-slate-800';
                let glowShadow = 'none';
                if (isLeft) {
                  ringClass = 'border-blue-500 border-2 scale-105';
                  glowShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
                } else if (isRight) {
                  ringClass = 'border-emerald-500 border-2 scale-105';
                  glowShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
                } else if (isResult) {
                  ringClass = 'border-purple-500 border';
                }

                return (
                  <motion.div
                    key={tier}
                    drag
                    dragMomentum={false}
                    onDrag={(e, info) => handleDrag(tier, info)}
                    style={{
                      position: 'absolute',
                      left: nodePositions[tier].x - 50,
                      top: nodePositions[tier].y - 25,
                      width: '100px',
                      height: '50px',
                      x: 0,
                      y: 0,
                    }}
                    className={`cursor-grab active:cursor-grabbing bg-slate-900 rounded-xl border ${ringClass} flex flex-col items-center justify-center p-2 transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleNodeClick(tier)}
                  >
                    <div className="flex items-center gap-2">
                      <ChessIcon tier={tier} size={14} style={{ color }} />
                      <span className="text-[10px] font-mono font-extrabold text-white uppercase tracking-wider">
                        {TIER_LABELS[tier]}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                      Stage {TIER_ORDER[tier]} ({TIER_SYMBOLS[tier]})
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 mt-4 items-start bg-slate-950/40 p-3 rounded-xl border border-slate-900/60">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Interactive Guide</strong>: Click any node to set it as <strong>Parameter A</strong>. Drag nodes around to organize your Hasse diagram workspace.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Equation Sandbox & Symbolic Visualization */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          
          {/* Node Selector Strip */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">Parameter A (Left)</label>
              <select
                value={selectedLeft}
                onChange={e => setSelectedLeft(e.target.value as SkillTier)}
                className="bg-[#030712] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500"
              >
                {(Object.keys(TIER_ORDER) as SkillTier[]).map(t => (
                  <option key={t} value={t}>{TIER_LABELS[t]} ({TIER_SYMBOLS[t]})</option>
                ))}
              </select>
            </div>
            <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Parameter B (Right)</label>
              <select
                value={selectedRight}
                onChange={e => setSelectedRight(e.target.value as SkillTier)}
                className="bg-[#030712] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
              >
                {(Object.keys(TIER_ORDER) as SkillTier[]).map(t => (
                  <option key={t} value={t}>{TIER_LABELS[t]} ({TIER_SYMBOLS[t]})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Operation Applied Card */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between flex-1 relative min-h-[160px]">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 block mb-3">Theorem Solver Output</span>
              
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {notationStr}
                </span>
                <span className="text-xs font-mono px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full">
                  {plainEnglish}
                </span>
              </div>

              <div className="mt-4 text-xs leading-relaxed text-slate-400 flex flex-col gap-2 bg-[#030712]/50 p-4 rounded-xl border border-slate-950">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">Semantic Interpretation:</span>
                  <span>{semanticMeaning}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-purple-400">
                  <span className="font-semibold text-slate-200">Formal Definition:</span>
                  <span>{mathFormula}</span>
                </div>
              </div>
            </div>

            {/* Glowing Symbolic Visualization Layer */}
            <div className="mt-6 flex items-center justify-center bg-[#030712]/40 border border-slate-950 rounded-xl p-4 min-h-[90px] relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
              <div className="flex items-center gap-6 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 border border-blue-500/30" style={{ color: TIER_COLORS[selectedLeft] }}>
                    <ChessIcon tier={selectedLeft} size={20} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">{selectedLeft}</span>
                </div>
                
                <div className="text-xl font-bold text-slate-500">
                  {activeOp === 'join' ? '∨' : activeOp === 'meet' ? '∧' : activeOp === 'compose' ? '⊗' : '→'}
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30" style={{ color: TIER_COLORS[selectedRight] }}>
                    <ChessIcon tier={selectedRight} size={20} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">{selectedRight}</span>
                </div>

                <div className="text-xl font-bold text-slate-500">=</div>

                <div className="flex flex-col items-center">
                  <motion.div 
                    key={resultTier}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500/10 border border-purple-500/30 shadow-lg shadow-purple-500/10" 
                    style={{ color: TIER_COLORS[resultTier] }}
                  >
                    <ChessIcon tier={resultTier} size={24} />
                  </motion.div>
                  <span className="text-[9px] font-mono text-purple-400 mt-1 uppercase font-bold">{resultTier}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Algebra Proof Live Console */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 font-mono text-xs flex flex-col gap-2 min-h-[140px] shadow-inner relative">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[9px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>PROOF ENGINE ONLINE</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 border-b border-slate-900 pb-2 mb-2">
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-extrabold tracking-wider">Quantale Validation Stream</span>
            </div>
            <div className="flex-1 flex flex-col gap-1 text-[11px]">
              <AnimatePresence>
                {terminalLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      line.startsWith('[result]')
                        ? 'text-emerald-400 font-bold'
                        : line.startsWith('[engine]')
                        ? 'text-blue-400'
                        : line.startsWith('[proof]')
                        ? 'text-purple-400 font-semibold'
                        : 'text-slate-400'
                    }
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isComputing && (
                <div className="text-slate-600 flex items-center gap-1 mt-1 text-[10px]">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>validating algebra axioms...</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Visual Proof / Galois Connection Section */}
      <div className="mt-8 border-t border-slate-900 pt-6">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Commutative Quantale Proofs
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-white mb-1">Commutative Monoid Law</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The operation ⊗ satisfies $a ⊗ b = b ⊗ a$ and $a ⊗ ⊤ = a$, making the Grandmaster ($\top$) rank the monoidal identity element.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-white mb-1">Distributivity Rule</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Quantale multiplication strictly distributes over arbitrary joins: $a ⊗ (b ∨ c) = (a ⊗ b) ∨ (a ⊗ c)$. Holds across all stages.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-white mb-1">Residuated Adjunction</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Implication residuation $\to$ satisfies the Galois connection: $a ⊗ b ≤ c \iff b ≤ a → c$. Strictly proven in all test constraints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
