'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCard from './PlayerCard';
import TerminalPanel, { TerminalLine } from './TerminalPanel';
import LatticeGraph from './LatticeGraph';
import ChessIcon from './ChessIcon';
import { Player, SkillTier, TIER_COLORS, TIER_ORDER, TIER_ELO, TIER_SYMBOLS, TIER_LABELS, LATTICE_SYMBOLS } from '@/types';

import { api, API_BASE } from '@/lib/api';

function getTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

let lineIdCounter = 0;
function makeLine(content: string, type: TerminalLine['type'], prompt?: string): TerminalLine {
  return {
    id: `line-${++lineIdCounter}`,
    content,
    type,
    timestamp: getTimestamp(),
    prompt,
  };
}

// ─── Main Component ───
export default function CombatArena() {
  const [selectedLeft, setSelectedLeft] = useState<Player | null>(null);
  const [selectedRight, setSelectedRight] = useState<Player | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [leftTeam, setLeftTeam] = useState<Player[]>([]);
  const [rightTeam, setRightTeam] = useState<Player[]>([]);
  const [backendConnected, setBackendConnected] = useState(false);

  // Fetch elements from backend on mount
  useEffect(() => {
    async function fetchElements() {
      try {
        const data = await api.getElements();
        const elements: string[] = data.elements;

        const left: Player[] = elements.map((el: string, idx: number) => ({
          id: `l${idx + 1}`,
          name: el.charAt(0).toUpperCase() + el.slice(1),
          tier: el as SkillTier,
          team: 'left' as const,
        })).reverse();

        const right: Player[] = elements.map((el: string, idx: number) => ({
          id: `r${idx + 1}`,
          name: el.charAt(0).toUpperCase() + el.slice(1),
          tier: el as SkillTier,
          team: 'right' as const,
        })).reverse();

        setLeftTeam(left);
        setRightTeam(right);
        setBackendConnected(true);
        setTerminalLines([
          makeLine(`connected to algebra backend at ${API_BASE}`, 'system', '✦'),
          makeLine(`loaded ${elements.length} elements: {${elements.join(', ')}}`, 'accent', '⟩'),
          makeLine(`top = ${data.top}, bottom = ${data.bottom}`, 'accent', '⟩'),
          makeLine('quantale engine initialized — awaiting combatants...', 'system', '⟩'),
        ]);
      } catch {
        setBackendConnected(false);
        setTerminalLines([
          makeLine('[error] failed to connect to algebra backend server.', 'error', '✗'),
          makeLine('[error] please start the FastAPI server: uv run python app/main.py', 'error', ' '),
          makeLine('[system] retrying in 5 seconds...', 'system', '⟳'),
        ]);
        // Retry after 5 seconds
        setTimeout(fetchElements, 5000);
      }
    }

    fetchElements();
  }, []);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SkillTier | null>(null);
  const [booleanResult, setBooleanResult] = useState<boolean | null>(null);
  const [activeOp, setActiveOp] = useState<'le' | 'join' | 'residual' | 'compose' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const processingRef = useRef(false);

  const addLine = useCallback((line: TerminalLine) => {
    setTerminalLines(prev => [...prev, line]);
  }, []);

  const runComputation = useCallback(async (left: Player, right: Player, op: 'le' | 'join' | 'residual' | 'compose') => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);
    setResult(null);
    setBooleanResult(null);
    setShowResult(false);
    setActiveOp(op);

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    setTerminalLines([
      makeLine(`[engine] communicating with algebra backend at ${API_BASE}...`, 'system', '│')
    ]);
    await delay(300);

    try {
      if (op === 'le') {
        setTerminalLines(prev => [...prev, makeLine('[engine] evaluating order relation query (≤)...', 'system', '⟳')]);
        const data = await api.queryLe(left.tier, right.tier);
        setBooleanResult(data.result);
      } else if (op === 'join') {
        setTerminalLines(prev => [...prev, makeLine('[engine] evaluating lattice supremum join query (∨)...', 'system', '⟳')]);
        const data = await api.queryJoin([left.tier, right.tier]);
        setResult(data.join as SkillTier);
      } else if (op === 'residual') {
        setTerminalLines(prev => [...prev, makeLine('[engine] evaluating right residual mapping query (→)...', 'system', '⟳')]);
        const data = await api.queryResidual(left.tier, right.tier);
        setResult(data.residual as SkillTier);
      } else if (op === 'compose') {
        setTerminalLines(prev => [...prev, makeLine('[engine] evaluating composition tensor query (⊗)...', 'system', '⟳')]);
        const data = await api.compose(left.tier, right.tier);
        setResult(data.result as SkillTier);
      }

      await delay(200);
      try {
        const logsData = await api.getLogsDemo();
        const newLines = logsData.logs.map((logStr: string) => {
          let lineType: TerminalLine['type'] = 'system';
          if (logStr.includes('result =') || logStr.includes('[result]')) lineType = 'result';
          else if (logStr.includes('warning') || logStr.includes('violated')) lineType = 'warn';
          else if (logStr.includes('error')) lineType = 'error';
          else if (logStr.includes('compose:') || logStr.includes('residual:') || logStr.includes('join:')) lineType = 'accent';
          
          return makeLine(logStr, lineType, '⟩');
        });
        setTerminalLines(newLines);
      } catch (logErr) {
        // ignore log fetch error to not fail main operation
      }
    } catch (err) {
      setTerminalLines(prev => [
        ...prev,
        makeLine('[error] failed to connect to algebra backend server.', 'error', '✗'),
        makeLine('[error] please ensure the FastAPI server is running on port 8000.', 'error', ' ')
      ]);
    }

    setShowResult(true);
    setIsProcessing(false);
    processingRef.current = false;
  }, [addLine]);

  const handleExecuteCommand = useCallback(async (command: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);
    setResult(null);
    setBooleanResult(null);
    setShowResult(false);
    setActiveOp(null);

    addLine(makeLine(command, 'normal', '>'));
    const trimmed = command.trim();

    const leMatch = trimmed.match(/^le\s*\(\s*([a-zA-Z]+)\s*,\s*([a-zA-Z]+)\s*\)$/i);
    const resMatch = trimmed.match(/^residual\s*\(\s*([a-zA-Z]+)\s*,\s*([a-zA-Z]+)\s*\)$/i);
    const composeMatch = trimmed.match(/^compose\s*\(\s*([a-zA-Z]+)\s*,\s*([a-zA-Z]+)\s*\)$/i);
    const joinMatch = trimmed.match(/^(?:big_)?join\s*\(([^)]+)\)$/i);
    const verifyMatch = trimmed.match(/^verify\s*\(\s*\)$/i);

    const elementsMatch = trimmed.match(/^elements\s*\(\s*\)$/i);
    const helpMatch = trimmed.match(/^help\s*$/i);

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    try {
      if (helpMatch) {
        addLine(makeLine('Available Commands:', 'system', '✦'));
        addLine(makeLine('  le(a, b)              - Check if element a <= b', 'system', ' '));
        addLine(makeLine('  join(a, b, ...)       - Compute join of subset', 'system', ' '));
        addLine(makeLine('  compose(a, b)         - Compute tensor composition a ⊗ b', 'system', ' '));
        addLine(makeLine('  residual(a, c)        - Compute right residual of a and c', 'system', ' '));
        addLine(makeLine('  elements()            - List all elements in the quantale', 'system', ' '));
        addLine(makeLine('  verify()              - Run algebraic verification report', 'system', ' '));

        addLine(makeLine('  help                  - Show this message', 'system', ' '));
      } else if (elementsMatch) {
        addLine(makeLine('[engine] fetching elements from backend...', 'system', '⟳'));
        await delay(300);

        const data = await api.getElements();

        addLine(makeLine(`[engine] Q = {${data.elements.join(', ')}}`, 'accent', '⟩'));
        addLine(makeLine(`[engine] top (⊤) = ${data.top}`, 'accent', '⟩'));
        addLine(makeLine(`[engine] bottom (⊥) = ${data.bottom}`, 'accent', '⟩'));
        addLine(makeLine(`[result] ${data.elements.length} elements loaded.`, 'result', '★'));
      } else if (leMatch) {
        const a = leMatch[1].toLowerCase();
        const b = leMatch[2].toLowerCase();
        
        addLine(makeLine(`[engine] evaluating: ${a} ≤ ${b}...`, 'system', '⟳'));
        await delay(300);

        const data = await api.queryLe(a, b);
        
        addLine(makeLine(`[engine] result meaning: ${data.meaning}`, 'accent', '⟩'));
        addLine(makeLine(`[result] ${data.result ? 'TRUE' : 'FALSE'}`, 'result', '★'));
      } else if (composeMatch) {
        const left = composeMatch[1].toLowerCase();
        const right = composeMatch[2].toLowerCase();
        
        addLine(makeLine(`[engine] composing: ${left} ⊗ ${right}...`, 'system', '⟳'));
        await delay(300);

        const data = await api.compose(left, right);
        
        addLine(makeLine(`[engine] ${data.left} ${data.symbol} ${data.right} = ${data.result}`, 'accent', '⟩'));
        addLine(makeLine(`[engine] explanation: ${data.explanation}`, 'accent', '⟩'));
        addLine(makeLine(`[result] ${data.result.toUpperCase()}`, 'result', '★'));
      } else if (resMatch) {
        const a = resMatch[1].toLowerCase();
        const c = resMatch[2].toLowerCase();
        
        addLine(makeLine(`[engine] solving residual: ${a} → ${c}...`, 'system', '⟳'));
        await delay(300);

        const data = await api.queryResidual(a, c);
        
        addLine(makeLine(`[engine] result meaning: ${data.meaning}`, 'accent', '⟩'));
        addLine(makeLine(`[result] ${data.residual.toUpperCase()}`, 'result', '★'));
      } else if (joinMatch) {
        const elems = joinMatch[1].split(',').map(s => s.trim().toLowerCase());
        
        addLine(makeLine(`[engine] computing join of: ${elems.join(', ')}...`, 'system', '⟳'));
        await delay(300);

        const data = await api.queryJoin(elems);
        
        addLine(makeLine(`[engine] result meaning: ${data.meaning}`, 'accent', '⟩'));
        addLine(makeLine(`[result] ${data.join.toUpperCase()}`, 'result', '★'));
      } else if (verifyMatch) {
        addLine(makeLine('[engine] running algebraic verification suite...', 'system', '⟳'));
        await delay(400);

        const data = await api.verify();

        addLine(makeLine(`[engine] monoid closure: ${data.monoid.closure ? 'OK' : 'FAIL'}`, 'accent', '│'));
        addLine(makeLine(`[engine] monoid associativity: ${data.monoid.associativity ? 'OK' : 'FAIL'}`, 'accent', '│'));
        addLine(makeLine(`[engine] monoid identity: ${data.monoid.identity ? 'OK' : 'FAIL'}`, 'accent', '│'));
        addLine(makeLine(`[engine] quantale distributivity: ${data.distributivity ? 'OK' : 'FAIL'}`, 'accent', '│'));
        addLine(makeLine(`[engine] residuated adjunction: ${data.adjunction ? 'OK' : 'FAIL'}`, 'accent', '│'));
        
        const ok = data.monoid_valid && data.distributive && data.adjunction_holds;
        addLine(makeLine(`[result] VERIFICATION ${ok ? 'PASSED (Algebra structure holds)' : 'FAILED'}`, 'result', '★'));

      } else {
        addLine(makeLine(`[error] Unknown command: "${trimmed}". Type "help" for syntax list.`, 'error', '✗'));
      }
    } catch (err) {
      addLine(makeLine('[error] Request failed. Ensure backend server is running on port 8000.', 'error', '✗'));
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [addLine]);

  const handleSelectLeft = useCallback((player: Player) => {
    if (isProcessing) return;
    setSelectedLeft(player);
    setResult(null);
    setBooleanResult(null);
    setShowResult(false);
    setActiveOp(null);
    addLine(makeLine(`[sys] left parameter selected: ${player.name}`, 'accent', '←'));
  }, [addLine, isProcessing]);

  const handleSelectRight = useCallback((player: Player) => {
    if (isProcessing) return;
    setSelectedRight(player);
    setResult(null);
    setBooleanResult(null);
    setShowResult(false);
    setActiveOp(null);
    addLine(makeLine(`[sys] right parameter selected: ${player.name}`, 'accent', '→'));
  }, [addLine, isProcessing]);

  const handleReset = useCallback(() => {
    if (isProcessing) return;
    setSelectedLeft(null);
    setSelectedRight(null);
    setResult(null);
    setBooleanResult(null);
    setShowResult(false);
    setActiveOp(null);
    setTerminalLines([
      makeLine('arena memory cleared', 'system', '✦'),
      makeLine('awaiting input parameters...', 'system', '⟩'),
    ]);
  }, [isProcessing]);

  const resultColor = activeOp === 'le' ? (booleanResult ? '#10b981' : '#ef4444') : result ? TIER_COLORS[result] : '#fff';
  const resultSymbol = result ? TIER_SYMBOLS[result] : '';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div className="grid-bg" />
      <div className="ambient-orb left" />
      <div className="ambient-orb right" />
      <div className="ambient-orb center" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="app-header"
      >
        <div className="header-title-group">
          <div className={`header-dot ${backendConnected ? '' : 'disconnected'}`} />
          <span className="header-title">Quantale Chess Arena</span>
        </div>

        {/* LATTICE HORIZONTAL IN HEADER */}
        <LatticeGraph 
          activeLeft={selectedLeft?.tier} 
          activeRight={selectedRight?.tier} 
          result={result} 
        />
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="reset-button"
        >
          Reset Engine
        </motion.button>
      </motion.header>

      {/* Main Grid Layout */}
      <div className="main-layout">
        
        {/* LEFT ROSTER PANEL */}
        <motion.div
          className="roster-panel left-roster"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="panel-header">Left Parameter</div>
          <div className="roster-list">
            {leftTeam.map((player, i) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelected={selectedLeft?.id === player.id}
                onClick={() => handleSelectLeft(player)}
                index={i}
                side="left"
              />
            ))}
          </div>
        </motion.div>

        {/* CENTRAL ARENA + BOTTOM TERMINAL */}
        <div className="center-column">
          
          <motion.div
            className={`arena-stage ${showResult ? 'has-result' : ''}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {/* Chessboard Grid background for central stage */}
            <div className="arena-chessboard">
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isDark = (row + col) % 2 === 1;
                return (
                  <div 
                    key={i} 
                    className={`chessboard-square ${isDark ? 'dark' : 'light'}`} 
                  />
                );
              })}
            </div>

            {/* The Live Composition Area */}
            <div className="combat-chamber">
              
              <div className="combat-participant left">
                <AnimatePresence mode="wait">
                  {selectedLeft ? (
                    <motion.div 
                      key={selectedLeft.id}
                      initial={{ scale: 0, x: -100, opacity: 0 }}
                      animate={{ scale: 1, x: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="arena-hologram"
                    >
                      <div className="hologram-symbol" style={{ color: TIER_COLORS[selectedLeft.tier] }}>
                        <ChessIcon tier={selectedLeft.tier} size={64} style={{ filter: `drop-shadow(0 0 10px ${TIER_COLORS[selectedLeft.tier]}a0)` }} />
                      </div>
                      <div className="hologram-name" style={{ color: TIER_COLORS[selectedLeft.tier] }}>{selectedLeft.name}</div>
                    </motion.div>
                  ) : (
                    <div className="placeholder-hologram">AWAITING L</div>
                  )}
                </AnimatePresence>
              </div>

              <div className="combat-operator">
                <motion.div 
                  className={`operator-symbol ${selectedLeft && selectedRight ? 'active' : ''}`}
                  animate={selectedLeft && selectedRight ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 2, ease: "linear", repeat: isProcessing ? Infinity : 0 }}
                >
                  {activeOp === 'le' ? '≤' : activeOp === 'join' ? '∨' : activeOp === 'residual' ? '→' : '⊗'}
                </motion.div>
              </div>

              <div className="combat-participant right">
                <AnimatePresence mode="wait">
                  {selectedRight ? (
                    <motion.div 
                      key={selectedRight.id}
                      initial={{ scale: 0, x: 100, opacity: 0 }}
                      animate={{ scale: 1, x: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="arena-hologram"
                    >
                      <div className="hologram-symbol" style={{ color: TIER_COLORS[selectedRight.tier] }}>
                        <ChessIcon tier={selectedRight.tier} size={64} style={{ filter: `drop-shadow(0 0 10px ${TIER_COLORS[selectedRight.tier]}a0)` }} />
                      </div>
                      <div className="hologram-name" style={{ color: TIER_COLORS[selectedRight.tier] }}>{selectedRight.name}</div>
                    </motion.div>
                  ) : (
                    <div className="placeholder-hologram">AWAITING R</div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RULE APPLIED PANEL & RESULT */}
            <AnimatePresence>
              {showResult && selectedLeft && selectedRight && (
                <motion.div
                  className="rule-applied-panel"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 20 }}
                  style={{ borderColor: resultColor, boxShadow: `0 0 30px ${resultColor}20` }}
                >
                  {activeOp === 'compose' && result && (
                    <>
                       <div className="rule-header">TENSOR COMPOSITION OPERATION (⊗)</div>
                       <div className="rule-equation">
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedLeft.tier] }}>
                           <ChessIcon tier={selectedLeft.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedLeft.tier]})</span>
                         </span>
                         <span className="rule-op"> ⊗ </span>
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedRight.tier] }}>
                           <ChessIcon tier={selectedRight.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedRight.tier]})</span>
                         </span>
                         <span className="rule-eq"> = </span>
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[result], fontWeight: 'bold' }}>
                           <ChessIcon tier={result} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[result]})</span>
                         </span>
                       </div>
                       <div className="rule-explanation">
                         Tensor Composition (⊗) is implemented as the Lattice Infimum (Meet). The weaker participant constrains the interaction.
                       </div>
                       <div className="rule-result">
                         <span className="result-symbol" style={{ color: TIER_COLORS[result] }}>
                           <ChessIcon tier={result} size={40} style={{ filter: `drop-shadow(0 0 10px ${TIER_COLORS[result]}a0)` }} />
                         </span>
                         <span className="result-tier" style={{ color: TIER_COLORS[result] }}>{TIER_LABELS[result].toUpperCase()}</span>
                       </div>
                    </>
                  )}

                  {activeOp === 'le' && (
                    <>
                       <div className="rule-header">ORDER RELATION VERIFICATION (≤)</div>
                       <div className="rule-equation">
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedLeft.tier] }}>
                           <ChessIcon tier={selectedLeft.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedLeft.tier]})</span>
                         </span>
                         <span className="rule-op"> ≤ </span>
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedRight.tier] }}>
                           <ChessIcon tier={selectedRight.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedRight.tier]})</span>
                         </span>
                         <span className="rule-eq"> = </span>
                         <span style={{ color: booleanResult ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                           {booleanResult ? 'TRUE' : 'FALSE'}
                         </span>
                       </div>
                       <div className="rule-explanation">
                         Checks if {selectedLeft.name} (Stage {TIER_ORDER[selectedLeft.tier]}) is weaker or equal to {selectedRight.name} (Stage {TIER_ORDER[selectedRight.tier]}) in the lattice order.
                       </div>
                       <div className="rule-result">
                         <span className="result-symbol" style={{ 
                           color: booleanResult ? '#10b981' : '#ef4444', 
                           textShadow: `0 0 10px ${booleanResult ? '#10b981' : '#ef4444'}80` 
                         }}>
                           {booleanResult ? '✓' : '✗'}
                         </span>
                         <span className="result-tier" style={{ color: booleanResult ? '#10b981' : '#ef4444' }}>
                           {booleanResult ? 'ORDER HELD' : 'ORDER VIOLATED'}
                         </span>
                       </div>
                    </>
                  )}

                  {activeOp === 'join' && result && (
                    <>
                       <div className="rule-header">SUPREMUM JOIN OPERATION (∨)</div>
                       <div className="rule-equation">
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedLeft.tier] }}>
                           <ChessIcon tier={selectedLeft.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedLeft.tier]})</span>
                         </span>
                         <span className="rule-op"> ∨ </span>
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedRight.tier] }}>
                           <ChessIcon tier={selectedRight.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedRight.tier]})</span>
                         </span>
                         <span className="rule-eq"> = </span>
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[result], fontWeight: 'bold' }}>
                           <ChessIcon tier={result} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[result]})</span>
                         </span>
                       </div>
                       <div className="rule-explanation">
                         Lattice Supremum yields the upper bound (stronger element): {TIER_LABELS[result]} ({TIER_ELO[result]} ELO).
                       </div>
                       <div className="rule-result">
                         <span className="result-symbol" style={{ color: TIER_COLORS[result] }}>
                           <ChessIcon tier={result} size={40} style={{ filter: `drop-shadow(0 0 10px ${TIER_COLORS[result]}a0)` }} />
                         </span>
                         <span className="result-tier" style={{ color: TIER_COLORS[result] }}>{TIER_LABELS[result].toUpperCase()}</span>
                       </div>
                    </>
                  )}

                  {activeOp === 'residual' && result && (
                    <>
                       <div className="rule-header">RIGHT RESIDUAL OPERATION (→)</div>
                       <div className="rule-equation">
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedLeft.tier] }}>
                           <ChessIcon tier={selectedLeft.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedLeft.tier]})</span>
                         </span>
                         <span className="rule-op"> → </span>
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[selectedRight.tier] }}>
                           <ChessIcon tier={selectedRight.tier} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[selectedRight.tier]})</span>
                         </span>
                         <span className="rule-eq"> = </span>
                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: TIER_COLORS[result], fontWeight: 'bold' }}>
                           <ChessIcon tier={result} size={20} />
                           <span style={{ fontSize: '12px', opacity: 0.4 }}>({LATTICE_SYMBOLS[result]})</span>
                         </span>
                       </div>
                       <div className="rule-explanation">
                         Right residual of meet (Gödel Implication): yields Top (⊤) if Left ≤ Right, otherwise Right.
                       </div>
                       <div className="rule-result">
                         <span className="result-symbol" style={{ color: TIER_COLORS[result] }}>
                           <ChessIcon tier={result} size={40} style={{ filter: `drop-shadow(0 0 10px ${TIER_COLORS[result]}a0)` }} />
                         </span>
                         <span className="result-tier" style={{ color: TIER_COLORS[result] }}>{TIER_LABELS[result].toUpperCase()}</span>
                       </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Query Runner Strip */}
            <div className="query-runner-strip">
              <button 
                onClick={() => selectedLeft && selectedRight && runComputation(selectedLeft, selectedRight, 'compose')}
                disabled={!selectedLeft || !selectedRight || isProcessing}
                className={`query-btn ${activeOp === 'compose' ? 'active' : ''}`}
              >
                [ COMPOSE ]
              </button>
              <button 
                onClick={() => selectedLeft && selectedRight && runComputation(selectedLeft, selectedRight, 'le')}
                disabled={!selectedLeft || !selectedRight || isProcessing}
                className={`query-btn ${activeOp === 'le' ? 'active' : ''}`}
              >
                [ LE ]
              </button>
              <button 
                onClick={() => selectedLeft && selectedRight && runComputation(selectedLeft, selectedRight, 'join')}
                disabled={!selectedLeft || !selectedRight || isProcessing}
                className={`query-btn ${activeOp === 'join' ? 'active' : ''}`}
              >
                [ BIG JOIN ]
              </button>
              <button 
                onClick={() => selectedLeft && selectedRight && runComputation(selectedLeft, selectedRight, 'residual')}
                disabled={!selectedLeft || !selectedRight || isProcessing}
                className={`query-btn ${activeOp === 'residual' ? 'active' : ''}`}
              >
                [ RIGHT RESIDUAL ]
              </button>
            </div>
          </motion.div>

          <div className="bottom-terminal">
            <TerminalPanel 
              lines={terminalLines} 
              isProcessing={isProcessing} 
              onExecuteCommand={handleExecuteCommand}
            />
          </div>

        </div>

        {/* RIGHT ROSTER PANEL (includes lattice visualizer) */}
        <motion.div
          className="roster-panel right-roster"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="panel-header">Right Parameter</div>
          <div className="roster-list">
            {rightTeam.map((player, i) => (
              <PlayerCard
                key={player.id}
                player={player}
                isSelected={selectedRight?.id === player.id}
                onClick={() => handleSelectRight(player)}
                index={i}
                side="right"
              />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
