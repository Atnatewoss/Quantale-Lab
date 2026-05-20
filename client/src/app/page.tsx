'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Copy } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'api' | 'python' | 'react'>('api');

  const CODE_SNIPPETS = {
    api: `POST /verify\n{\n  "axiom": "adjunction",\n  "params": {\n    "a": "advanced",\n    "b": "intermediate"\n  }\n}`,
    python: `from quantale import Engine\n\nengine = Engine()\nresult = engine.verify_adjunction(\n    a="advanced",\n    b="intermediate"\n)\nprint(result.is_valid)`,
    react: `import { verifyAxiom } from '@/lib/api';\n\nconst { isValid } = await verifyAxiom({\n  axiom: 'adjunction',\n  a: 'advanced',\n  b: 'intermediate'\n});`
  };

  return (
    <div className="h-screen bg-[#000000] text-white font-sans selection:bg-white/30 flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Column - Top Logo + Hero with Grainy Gradient */}
      <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-[#222222] h-full bg-black relative z-20">
        
        {/* Smooth Spotlight Gradient Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1a1a1a] blur-[150px] rounded-full pointer-events-none" />

        
        {/* Top Left Logo Area */}
        <div className="absolute top-8 left-8 flex items-center gap-2 z-50">
          <div className="w-5 h-5 bg-white text-black flex items-center justify-center font-bold text-xs">
            Q
          </div>
          <span className="font-bold tracking-widest text-xs">QUANTALE-LAB.</span>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 flex-1 flex flex-col justify-between overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-[#050505] hover:[&::-webkit-scrollbar-thumb]:bg-[#111]">
          
          <div className="p-8 md:p-16 lg:p-20 mt-auto mb-auto">
            <div className="inline-flex items-center gap-2 text-[11px] text-[#888888] mb-8 border border-[#333333] rounded-full px-3 py-1 hover:text-white hover:border-[#555555] transition-all cursor-default bg-black/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Introducing | The Algebraic Skill Protocol <ArrowRight className="w-3 h-3" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] mb-10 text-[#f5f5f5]">
              Interactive algebra <br className="hidden lg:block" /> systems for concrete <br className="hidden lg:block" /> execution.
            </h1>

            <div className="flex items-center gap-4">
              <Link href="/demo" className="bg-white text-black px-6 py-3 text-sm font-medium hover:bg-[#dddddd] transition-colors flex items-center gap-2">
                Enter Arena <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/docs/foundations/introduction" className="border border-[#333333] text-white px-6 py-3 text-sm font-medium hover:bg-[#111111] transition-colors bg-black/40 backdrop-blur-sm">
                Read the Math
              </Link>
            </div>
          </div>

          {/* Left Footer Links */}
          <div className="p-8 md:px-16 lg:px-20 pb-12 flex items-center gap-6 text-[11px] font-mono text-[#666666] uppercase">
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
      </div>

      {/* Right Column - Navigation + Full Content */}
      <div className="w-full lg:w-1/2 relative h-full flex flex-col bg-black">
        
        {/* Navigation - Constrained to Right Column */}
        <nav className="border-b border-[#222222] flex items-center justify-end px-6 h-16 shrink-0 bg-transparent z-50 relative">
          <div className="hidden md:flex items-center text-[11px] font-medium tracking-widest text-[#888888]">
            <Link href="/docs/foundations/introduction" className="hover:text-white px-5 h-16 flex items-center border-b-2 border-white text-white">
              README
            </Link>
            <Link href="/docs/foundations/mathematics" className="hover:text-white px-5 h-16 flex items-center border-b-2 border-transparent hover:border-[#444444] transition-colors">
              DOCS
            </Link>
            <Link href="/demo" className="hover:text-white px-5 h-16 flex items-center border-b-2 border-transparent hover:border-[#444444] transition-colors">
              ARENA
            </Link>
          </div>
        </nav>

        {/* Scrollable Right Content */}
        <div className="relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[#000000] [&::-webkit-scrollbar-thumb]:bg-[#080808] hover:[&::-webkit-scrollbar-thumb]:bg-[#111111]">
          
          {/* README Section */}
          <div className="p-8 md:p-12 border-b border-[#222222]">
            <h2 className="text-[11px] tracking-widest text-white mb-5 uppercase">Readme</h2>
            <p className="text-[#999999] text-[13px] leading-relaxed max-w-xl font-medium">
              Quantale-Lab is an interactive mathematical engine. It maps advanced algebraic structures—Posets, Lattices, and Quantales—onto chess skill hierarchies, powered by a formal FastAPI backend evaluating tensor operations and Galois connections in real-time.
            </p>

            {/* Code Block Tab */}
            <div className="mt-8 border border-[#222222] bg-[#050505]/80 backdrop-blur-sm rounded-sm overflow-hidden">
              <div className="flex items-center border-b border-[#222222] text-[11px] text-[#666666] select-none">
                <div 
                  onClick={() => setActiveTab('api')}
                  className={`px-4 py-3 border-r border-[#222222] cursor-pointer transition-colors ${activeTab === 'api' ? 'text-white bg-[#111111]/80' : 'hover:text-white'}`}
                >API Request</div>
                <div 
                  onClick={() => setActiveTab('python')}
                  className={`px-4 py-3 border-r border-[#222222] cursor-pointer transition-colors ${activeTab === 'python' ? 'text-white bg-[#111111]/80' : 'hover:text-white'}`}
                >Python</div>
                <div 
                  onClick={() => setActiveTab('react')}
                  className={`px-4 py-3 cursor-pointer transition-colors ${activeTab === 'react' ? 'text-white bg-[#111111]/80' : 'hover:text-white'}`}
                >React</div>
              </div>
              <div className="p-4 flex items-start justify-between font-mono text-[12px] text-[#cccccc] min-h-[140px]">
                <pre className="whitespace-pre-wrap leading-relaxed">{CODE_SNIPPETS[activeTab]}</pre>
                <Copy className="w-4 h-4 text-[#444444] hover:text-white cursor-pointer mt-1 shrink-0" />
              </div>
            </div>
          </div>

          {/* Trusted By (Placeholder style) */}
          <div className="py-6 px-12 border-b border-[#222222] flex items-center justify-between text-[#444444] text-xs font-bold tracking-widest uppercase bg-black/10 backdrop-blur-sm">
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

      </div>

    </div>
  );
}
