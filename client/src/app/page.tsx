'use client';

import Link from 'next/link';
import { ArrowRight, Copy, Terminal } from 'lucide-react';

const FEATURES = [
  {
    num: '01',
    title: 'Posets.',
    desc: 'Strictly ordered hierarchical skill sets. Models clear capability levels from Beginner to Grandmaster.',
  },
  {
    num: '02',
    title: 'Lattices.',
    desc: 'Unique upper bounds (Join) and lower bounds (Meet). Resolves capability ceilings and floors.',
  },
  {
    num: '03',
    title: 'Complete Lattices.',
    desc: 'Arbitrary subsets possess definitive minimums (⊥) and maximums (⊤).',
  },
  {
    num: '04',
    title: 'Monoids.',
    desc: 'Associative tensor composition (⊗) handling interaction rules, with Grandmaster as the identity.',
  },
  {
    num: '05',
    title: 'Quantales.',
    desc: 'Tensor composition perfectly distributes over arbitrary joins. Unifying interaction with hierarchy.',
  },
  {
    num: '06',
    title: 'Residuation.',
    desc: 'Galois connection solvers (→). Computes exact backward boundaries for team matchups.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/30 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-[#222222] flex items-center justify-between px-6 h-16 shrink-0 sticky top-0 bg-black z-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white text-black flex items-center justify-center font-bold text-xs">
            Q
          </div>
          <span className="font-bold tracking-widest text-xs">QUANTALE.</span>
        </div>
        
        <div className="hidden md:flex items-center text-[11px] font-medium tracking-widest text-[#888888]">
          <Link href="/docs/foundations/introduction" className="hover:text-white px-6 h-16 flex items-center border-b-2 border-white text-white">
            README
          </Link>
          <Link href="/docs/foundations/mathematics" className="hover:text-white px-6 h-16 flex items-center border-b-2 border-transparent hover:border-[#444444] transition-colors">
            DOCS
          </Link>
          <Link href="/demo" className="hover:text-white px-6 h-16 flex items-center border-b-2 border-transparent hover:border-[#444444] transition-colors">
            ARENA
          </Link>
          <Link href="/docs/tools/api-docs" className="hover:text-white px-6 h-16 flex items-center border-b-2 border-transparent hover:border-[#444444] transition-colors">
            API
          </Link>
        </div>

        <Link href="/demo" className="bg-white text-black text-[11px] font-bold tracking-widest px-4 py-2 hover:bg-[#dddddd] transition-colors flex items-center gap-2">
          ENTER ARENA <ArrowRight className="w-3 h-3" />
        </Link>
      </nav>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Column - Hero */}
        <div className="flex flex-col justify-between p-8 md:p-16 lg:p-20 border-b lg:border-b-0 lg:border-r border-[#222222] relative">
          
          {/* Subtle background texture for left side */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10 mt-12 lg:mt-24">
            <div className="inline-flex items-center gap-2 text-[11px] text-[#888888] mb-8 border border-[#333333] rounded-full px-3 py-1 hover:text-white hover:border-[#555555] transition-all cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Introducing | The Algebraic Skill Protocol <ArrowRight className="w-3 h-3" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] mb-12">
              The most comprehensive <br className="hidden md:block" /> interaction theorem <br className="hidden md:block" /> framework
            </h1>

            <div className="flex items-center gap-4">
              <Link href="/docs/foundations/introduction" className="bg-white text-black px-6 py-3 text-sm font-medium hover:bg-[#dddddd] transition-colors">
                Get Started
              </Link>
              <Link href="/docs/foundations/mathematics" className="border border-[#333333] text-white px-6 py-3 text-sm font-medium hover:bg-[#111111] transition-colors">
                Read the Math
              </Link>
            </div>
          </div>

          {/* Left Footer Links */}
          <div className="relative z-10 flex items-center gap-6 text-[11px] font-mono text-[#666666] uppercase mt-32 lg:mt-0">
            <Link href="/docs/foundations/introduction" className="hover:text-white transition-colors">Mathematics</Link>
            <span className="text-[#333333]">/</span>
            <Link href="/docs/engine/query-engine" className="hover:text-white transition-colors">Engine</Link>
            <span className="text-[#333333]">/</span>
            <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
            <div className="ml-auto flex items-center gap-4">
              <Link href="https://github.com" target="_blank" className="hover:text-white cursor-pointer transition-colors">GITHUB</Link>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex flex-col">
          
          {/* README Section */}
          <div className="p-8 md:p-12 border-b border-[#222222]">
            <h2 className="text-[11px] tracking-widest text-white mb-6 uppercase">Readme</h2>
            <p className="text-[#999999] text-base leading-relaxed max-w-xl">
              Algebra that lives inside your system. Composable, order-based, and built to prove — powering resource-constrained interaction networks and theorem verification systems.
            </p>

            {/* Code Block Tab */}
            <div className="mt-10 border border-[#222222] bg-[#050505]">
              <div className="flex items-center border-b border-[#222222] text-[11px] text-[#666666]">
                <div className="px-4 py-3 border-r border-[#222222] text-white bg-[#111111]">API Request</div>
                <div className="px-4 py-3 border-r border-[#222222] hover:text-white cursor-pointer">Python</div>
                <div className="px-4 py-3 hover:text-white cursor-pointer">React</div>
              </div>
              <div className="p-4 flex items-center justify-between font-mono text-[13px] text-[#cccccc]">
                <span>GET /query/residual?a=advanced&c=intermediate</span>
                <Copy className="w-4 h-4 text-[#666666] hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Trusted By (Placeholder style) */}
          <div className="py-6 px-12 border-b border-[#222222] flex items-center justify-between text-[#444444] text-xs font-bold tracking-widest uppercase">
            <span>Core Mathematical Structures</span>
          </div>

          {/* Features Section */}
          <div className="p-8 md:p-12">
            <h3 className="text-xl font-medium text-white mb-8">Features</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {FEATURES.map((feat) => (
                <div key={feat.num} className="flex flex-col group">
                  <span className="text-[#555555] text-[11px] font-mono mb-3 group-hover:text-white transition-colors">{feat.num}</span>
                  <h4 className="text-white text-sm font-bold mb-2">{feat.title}</h4>
                  <p className="text-[#888888] text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
            
          </div>

        </div>

      </main>
    </div>
  );
}
