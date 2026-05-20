'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BookOpen, BrainCircuit, Zap,
  Terminal as TermIcon, Award, Compass, Cpu
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
  },
  {
    step: '02',
    title: 'Lattices',
    desc: 'Structures guaranteeing that any two skill levels possess a unique upper boundary (Join) and lower boundary (Meet).',
    symbol: 'a ∨ b / a ∧ b',
    math: 'Unique supremum and infimum exist for every pair.',
  },
  {
    step: '03',
    title: 'Complete Lattices',
    desc: 'Ensures supremum and infimum bounds exist for infinite/arbitrary subsets of player combinations.',
    symbol: '⋁ S / ⋀ S',
    math: 'Bound ceilings (Top ⊤) and floors (Bottom ⊥) are guaranteed.',
  },
  {
    step: '04',
    title: 'Monoids',
    desc: 'Adds an associative capability composition operator (⊗) along with an identity element (Grandmaster ⊤).',
    symbol: 'a ⊗ e = a',
    math: 'Enables algebraic pairing evaluation under monoidal identity.',
  },
  {
    step: '05',
    title: 'Quantales',
    desc: 'A complete lattice monoid where the tensor composition distributes perfectly over arbitrary joins.',
    symbol: 'a ⊗ (⋁ b_i) = ⋁ (a ⊗ b_i)',
    math: 'Unifies composition algebra with lattice bounds.',
  },
  {
    step: '06',
    title: 'Residuation',
    desc: 'Introduces residuals that solve Galois connection inequalities, establishing required skill bounds.',
    symbol: 'a ⊗ b ≤ c ⟺ b ≤ a → c',
    math: 'Right and left residuated implications coincide in commutative spaces.',
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
    <div className="min-h-screen w-screen bg-black text-white font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">

      {/* Modern Minimal Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Floating Algebraic Symbols (Monochrome) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ALGEBRAIC_SYMBOLS.map((sym, idx) => (
            <motion.div
              key={idx}
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
                opacity: 0.05
              }}
              animate={{
                y: [null, Math.random() * -100 - 50, null],
                rotate: [0, Math.random() * 360],
                opacity: [0.02, 0.08, 0.02]
              }}
              transition={{
                duration: 20 + Math.random() * 15,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute font-mono text-3xl font-bold select-none text-white/20"
            >
              {sym}
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col items-center">

        {/* Navigation / Header */}
        <header className="w-full flex items-center justify-between border-b border-white/10 pb-6 mb-24">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-white font-black font-mono text-xl border-2 border-white">
              Q
            </div>
            <span className="font-bold text-white tracking-widest text-xs uppercase">Quantale</span>
          </div>
          <Link href="/docs/foundations/introduction" className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-emerald-400 transition-colors bg-white/5 px-4 py-2 border border-white/10">
            <Compass className="w-3.5 h-3.5" />
            <span>Documentation</span>
          </Link>
        </header>

        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-12 gap-16 items-center w-full mb-32">

          {/* HERO TEXT COLUMN */}
          <div className="lg:col-span-6 flex flex-col text-left items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Computational Model</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight text-white tracking-tighter mb-6">
              Interactive Algebra. <br />
              <span className="text-neutral-500">Concrete Systems.</span>
            </h1>

            <p className="text-neutral-400 text-lg mb-10 leading-relaxed max-w-xl font-medium">
              Explore quantales, lattices, and composition laws through a strictly ordered visual arena. A modern framework for evaluating logic and Galois Connections.
            </p>

            {/* Floating animated concept badges */}
            <div className="flex flex-wrap gap-2 mb-10 max-w-md">
              {FLOATING_CONCEPTS.map((concept, idx) => (
                <motion.span
                  key={concept}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400 uppercase tracking-widest cursor-default hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                >
                  {concept}
                </motion.span>
              ))}
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/demo" className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 font-black tracking-wide uppercase text-sm hover:bg-emerald-400 transition-all duration-300">
                <Zap className="w-4 h-4" />
                <span>Enter Arena</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/docs/foundations/mathematics" className="flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white px-8 py-4 font-bold tracking-wide uppercase text-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300">
                <BookOpen className="w-4 h-4" />
                <span>Mathematics</span>
              </Link>
            </div>
          </div>

          {/* HERO VISUALIZATION COLUMN */}
          <div className="lg:col-span-6 flex flex-col gap-6 w-full">

            {/* Visual Arena Component */}
            <div className="bg-[#050505] border border-white/10 p-8 relative overflow-hidden">

              <div className="absolute top-4 right-6 flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-widest">
                <Cpu className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Stream</span>
              </div>

              {/* Two Opposing Player Panels */}
              <div className="grid grid-cols-2 gap-6 mb-8 relative mt-6">

                {/* Left Opposing Card */}
                <div className="bg-black border border-white/20 p-6 flex flex-col items-center justify-center text-center group hover:border-white/50 transition-colors">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black mb-4">Alpha Node</span>
                  <div className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    <ChessIcon tier="advanced" size={24} />
                  </div>
                  <span className="text-sm font-black text-white uppercase font-mono tracking-wide">Advanced</span>
                  <span className="text-[9px] font-mono text-neutral-500 mt-2 uppercase tracking-widest">Poset Level</span>
                </div>

                {/* Connecting Spark Line */}
                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-10 w-10 h-10 bg-white border-4 border-[#050505] flex items-center justify-center text-lg font-black text-black">
                  ⊗
                </div>

                {/* Right Opposing Card */}
                <div className="bg-black border border-emerald-500/30 p-6 flex flex-col items-center justify-center text-center group hover:border-emerald-500 transition-colors">
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-black mb-4">Beta Node</span>
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                    <ChessIcon tier="intermediate" size={24} />
                  </div>
                  <span className="text-sm font-black text-emerald-400 uppercase font-mono tracking-wide">Intermediate</span>
                  <span className="text-[9px] font-mono text-emerald-500/50 mt-2 uppercase tracking-widest">Poset Level</span>
                </div>

              </div>

              {/* Order relationships */}
              <div className="bg-black border border-white/10 p-5 flex flex-col gap-3 relative">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black block mb-1">Validation Layer</span>

                <div className="flex items-center justify-between px-4 py-3 border border-white/10 bg-white/5">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Relation</span>
                  <span className="text-xs font-mono font-bold text-white">Intermediate ≤ Advanced</span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-xs font-mono text-emerald-500/70 uppercase tracking-wider">Result</span>
                  <span className="text-xs font-mono font-black text-emerald-400">Intermediate</span>
                </div>
              </div>

              {/* Terminal */}
              <div className="mt-6 bg-black p-4 border border-white/10 text-[10px] font-mono flex flex-col gap-1 min-h-[100px]">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2 text-neutral-500">
                  <TermIcon className="w-3 h-3 text-emerald-500" />
                  <span className="font-bold tracking-widest uppercase">System Logs</span>
                </div>
                <AnimatePresence>
                  {terminalLog.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={
                        line.startsWith('SOLVER:')
                          ? 'text-emerald-400 font-bold'
                          : line.startsWith('SYSTEM:')
                            ? 'text-neutral-500'
                            : 'text-neutral-400'
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
        <div className="w-full flex flex-col text-left items-start mt-16">
          <div className="border-t-2 border-white/10 w-full pt-16 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block mb-3">Architecture</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                Algebraic Structures.
              </h2>
            </div>
            <p className="text-neutral-400 text-sm max-w-md font-medium leading-relaxed">
              Witness how structural logic scales from simple ordered sets into fully residuated quantale systems through interactive evaluation.
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
                  className={`bg-black border ${isActive ? 'border-emerald-500' : 'border-white/10'} p-8 transition-colors duration-300 relative`}
                >
                  <div className={`absolute top-6 right-6 text-4xl font-black font-mono ${isActive ? 'text-emerald-500/20' : 'text-white/5'}`}>
                    {step.step}
                  </div>

                  <div className={`inline-flex items-center gap-1 px-3 py-1 border text-[10px] font-mono font-bold tracking-widest mb-6 ${isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-neutral-400'}`}>
                    {step.symbol}
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-medium">{step.desc}</p>

                  <div className="border-t border-white/10 pt-4 text-[10px] font-mono flex flex-col gap-2">
                    <span className="text-neutral-500 uppercase tracking-widest font-bold">Logic</span>
                    <span className="text-white">{step.math}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Banner */}
          <div className="w-full mt-24 bg-black border border-white/20 p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:250px_250px] animate-[slide_20s_linear_infinite]" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/5 border border-white/20 flex items-center justify-center text-white group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-left">
                <h4 className="text-2xl font-black text-white tracking-tight">Interactive sandbox</h4>
                <p className="text-neutral-400 text-sm mt-1 font-medium">Explore residuated lattices inside the engine.</p>
              </div>
            </div>
            <Link
              href="/docs/foundations/mathematics"
              className="relative z-10 flex items-center gap-3 bg-white text-black font-black uppercase tracking-widest text-xs px-8 py-4 hover:bg-emerald-400 transition-colors duration-300"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
