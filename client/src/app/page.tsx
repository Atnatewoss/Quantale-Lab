'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BookOpen, BrainCircuit, Shield, Network, Zap,
  Terminal as TermIcon, Award, Compass, RefreshCw, Cpu
} from 'lucide-react';
import ChessIcon from '@/components/ChessIcon';

const FLOATING_CONCEPTS = [
  'joins', 'meets', 'residuals', 'distributivity',
  'adjunction', 'monoids', 'order structures'
];

const PROGRESSION_STEPS = [
  {
    step: '01',
    title: 'Posets',
    desc: 'Partially Ordered Sets. Establishes the strict hierarchical ranking of player skill levels.',
    symbol: 'a ≤ b',
    math: 'Reflexive, antisymmetric, and transitive relations.',
    color: 'from-slate-500/20 to-slate-800/10 border-slate-700/50',
    glow: 'rgba(148, 163, 184, 0.15)',
  },
  {
    step: '02',
    title: 'Lattices',
    desc: 'Structures guaranteeing that any two skill levels possess a unique upper boundary (Join) and lower boundary (Meet).',
    symbol: 'a ∨ b / a ∧ b',
    math: 'Unique supremum and infimum exist for every pair.',
    color: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  {
    step: '03',
    title: 'Complete Lattices',
    desc: 'Ensures supremum and infimum bounds exist for infinite/arbitrary subsets of player combinations.',
    symbol: '⋁ S / ⋀ S',
    math: 'Bound ceilings (Top ⊤) and floors (Bottom ⊥) are guaranteed.',
    color: 'from-blue-500/20 to-blue-900/10 border-blue-500/30',
    glow: 'rgba(59, 130, 246, 0.15)',
  },
  {
    step: '04',
    title: 'Monoids',
    desc: 'Adds an associative capability composition operator (⊗) along with an identity element (Grandmaster ⊤).',
    symbol: 'a ⊗ e = a',
    math: 'Enables algebraic pairing evaluation under monoidal identity.',
    color: 'from-purple-500/20 to-purple-900/10 border-purple-500/30',
    glow: 'rgba(139, 92, 246, 0.15)',
  },
  {
    step: '05',
    title: 'Quantales',
    desc: 'A complete lattice monoid where the tensor composition distributes perfectly over arbitrary joins.',
    symbol: 'a ⊗ (⋁ b_i) = ⋁ (a ⊗ b_i)',
    math: 'Unifies composition algebra with lattice bounds.',
    color: 'from-pink-500/20 to-pink-900/10 border-pink-500/30',
    glow: 'rgba(236, 72, 153, 0.15)',
  },
  {
    step: '06',
    title: 'Residuation',
    desc: 'Introduces residuals that solve Galois connection inequalities, establishing required skill bounds.',
    symbol: 'a ⊗ b ≤ c ⟺ b ≤ a → c',
    math: 'Right and left residuated implications coincide in commutative spaces.',
    color: 'from-amber-500/20 to-amber-900/10 border-amber-500/30',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
];

const ALGEBRAIC_SYMBOLS = ['≤', '∨', '∧', '⊗', '→', '⋁', '⊥', '⊤'];

export default function LandingPage() {
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  const [activeProgression, setActiveProgression] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Auto-running terminal log simulation
  useEffect(() => {
    setMounted(true);
    const logs = [
      'SYSTEM: Commutative residuated quantale lattice successfully compiled.',
      'AXIOM: Distributivity a ⊗ (b ∨ c) = (a ⊗ b) ∨ (a ⊗ c) validated.',
      'GALOIS: Adjunction verified for active chess coordinates.',
      'SOLVER: Advanced ⊗ Intermediate = Intermediate (Meet-based composition).',
      'BOUNDS: Grandmaster (⊤) established as the monoidal identity element.',
      'THEOREM: Completeness of the Chess Skill Lattice strictly holds.',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setTerminalLog(prev => {
        const next = [...prev, logs[idx % logs.length]];
        if (next.length > 5) next.shift();
        return next;
      });
      idx++;
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#030712] text-slate-200 font-sans selection:bg-blue-500/30 relative overflow-x-hidden">

      {/* Background chess board watermarks & ambient glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Cinematic ambient highlights */}
      <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-blue-900/25 blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-15%] w-[45%] h-[45%] rounded-full bg-purple-900/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[140px] pointer-events-none" />

      {/* Floating Algebraic Symbols */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ALGEBRAIC_SYMBOLS.map((sym, idx) => (
            <motion.div
              key={idx}
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
                opacity: 0.15
              }}
              animate={{
                y: [null, Math.random() * -100 - 50, null],
                rotate: [0, Math.random() * 360],
                opacity: [0.1, 0.25, 0.1]
              }}
              transition={{
                duration: 20 + Math.random() * 15,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{ color: 'var(--terminal-system)' }}
              className="absolute font-mono text-2xl font-bold select-none text-blue-500/20"
            >
              {sym}
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">

        {/* Navigation / Header */}
        <header className="w-full flex items-center justify-between border-b border-slate-900 pb-6 mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-extrabold font-mono text-lg">
              Q
            </div>
            <span className="font-extrabold text-white tracking-widest text-xs uppercase">Quantale Chess Lab</span>
          </div>
          <Link href="/docs/foundations/introduction" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Documentation</span>
          </Link>
        </header>

        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full mb-24">

          {/* HERO TEXT COLUMN */}
          <div className="lg:col-span-6 flex flex-col text-left items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Educational Theorem Platform</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight mb-6">
              Interactive Algebra Through Chess Skill Systems
            </h1>

            <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              Explore quantales, lattices, composition laws, and interaction constraints through a visual chess arena. Dive into a formal complete lattice to evaluate skill progression and Galois Connections.
            </p>

            {/* Floating animated concept badges */}
            <div className="flex flex-wrap gap-2 mb-8 max-w-md">
              {FLOATING_CONCEPTS.map((concept, idx) => (
                <motion.span
                  key={concept}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider cursor-default hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                >
                  {concept}
                </motion.span>
              ))}
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/demo" className="group flex items-center justify-center gap-2 bg-blue-600 border border-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>Enter Arena</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/docs/foundations/mathematics" className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800/80 text-slate-200 px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl shadow-black/40">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Explore the Mathematics</span>
              </Link>
            </div>
          </div>

          {/* HERO VISUALIZATION COLUMN */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Visual Arena Component */}
            <div className="bg-[#0b0f19]/70 border border-slate-900 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl shadow-2xl">

              <div className="absolute top-2 right-4 flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
                <Cpu className="w-3 h-3 text-blue-500 animate-pulse" />
                <span>ALGEBRA STREAM</span>
              </div>

              {/* Two Opposing Player Panels */}
              <div className="grid grid-cols-2 gap-4 mb-6 relative">

                {/* Left Opposing Card */}
                <div className="bg-[#030712]/80 border border-blue-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-extrabold mb-2">Alpha Node</span>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                    <ChessIcon tier="advanced" size={20} />
                  </div>
                  <span className="text-xs font-bold text-white uppercase font-mono">Advanced (♘)</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Stage 3 / Poset Level</span>
                </div>

                {/* Connecting Spark Line */}
                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-10 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-purple-400 shadow-xl">
                  ⊗
                </div>

                {/* Right Opposing Card */}
                <div className="bg-[#030712]/80 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold mb-2">Beta Node</span>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                    <ChessIcon tier="intermediate" size={20} />
                  </div>
                  <span className="text-xs font-bold text-white uppercase font-mono">Intermediate (♙)</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Stage 2 / Poset Level</span>
                </div>

              </div>

              {/* Order relationships and connection line */}
              <div className="bg-[#030712]/80 border border-slate-950 rounded-xl p-4 flex flex-col gap-2 relative">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-extrabold block">Quantale Proof Validation</span>

                {/* SVG Lattice path visualization */}
                <div className="flex items-center justify-between px-4 py-2 border border-slate-900 rounded-lg">
                  <span className="text-xs font-mono text-slate-400">Poset Relation:</span>
                  <span className="text-xs font-mono font-bold text-white">Intermediate ≤ Advanced (TRUE)</span>
                </div>

                <div className="flex items-center justify-between px-4 py-2 border border-slate-900 rounded-lg bg-purple-500/5">
                  <span className="text-xs font-mono text-slate-400">Tensor Composition Result:</span>
                  <span className="text-xs font-mono font-bold text-purple-400">Intermediate (♙)</span>
                </div>
              </div>

              {/* Subtle terminal activity inside card */}
              <div className="mt-4 bg-[#030712] rounded-xl p-3 border border-slate-950 text-[10px] font-mono flex flex-col gap-1 min-h-[90px]">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-1.5 mb-1.5 text-slate-500">
                  <TermIcon className="w-3 h-3 text-blue-500" />
                  <span className="font-extrabold tracking-wider">Lattice Solver Console</span>
                </div>
                <AnimatePresence>
                  {terminalLog.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -2 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={
                        line.startsWith('SOLVER:')
                          ? 'text-emerald-400 font-bold'
                          : line.startsWith('SYSTEM:')
                            ? 'text-slate-500'
                            : 'text-slate-400'
                      }
                    >
                      &gt; {line}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

        {/* PROGRESSION ROADMAP SECTION */}
        <div className="w-full flex flex-col text-left items-start mt-8">
          <div className="border-t border-slate-900 w-full pt-16 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 block mb-2">Architectural Foundation</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Visual Progression of Algebraic Structures
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Hover over each stage to witness how structural logic scales from simple ordered sets into fully residuated quantale systems.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {PROGRESSION_STEPS.map((step, idx) => {
              const isActive = activeProgression === idx;
              return (
                <div
                  key={step.step}
                  onMouseEnter={() => setActiveProgression(idx)}
                  className={`bg-gradient-to-b ${step.color} border rounded-2xl p-6 transition-all duration-300 cursor-default relative overflow-hidden`}
                  style={{
                    boxShadow: isActive ? `0 10px 30px -10px ${step.glow}` : 'none',
                  }}
                >
                  <div className="absolute top-4 right-4 text-3xl font-black text-slate-800/40 font-mono">
                    {step.step}
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#030712]/80 border border-slate-950 text-[10px] font-mono text-purple-400 mb-4">
                    {step.symbol}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{step.desc}</p>

                  <div className="border-t border-slate-900 pt-3 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>Formal Logic:</span>
                    <span className="text-slate-300 text-right">{step.math}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="w-full mt-16 bg-slate-950/60 border border-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-base font-bold text-white">Ready to interactively prove theorems?</h4>
                <p className="text-slate-400 text-xs mt-0.5">Explore residuated lattices directly inside our live sandbox page.</p>
              </div>
            </div>
            <Link
              href="/docs/foundations/mathematics"
              className="relative z-10 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 border border-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              <span>Explore sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
