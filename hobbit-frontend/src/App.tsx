import { useState, useEffect } from 'react';

const App = () => {
  const [serverStatus, setServerStatus] = useState<string>('Checking...');

  useEffect(() => {
    fetch('http://localhost:5000/health')
      .then(res => res.json())
      .then(data => setServerStatus(data.status))
      .catch(() => setServerStatus('Offline'));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <nav className="fixed top-0 w-full border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="font-bold text-white tracking-tighter">H</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Hobbit</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${serverStatus === 'OK' ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
              <span className="text-zinc-300">Server: {serverStatus}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[96px] pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-[1.1]">
                Full-Stack Development, Redefined.
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl">
                Hobbit is a high-performance boilerplate for modern web applications. 
                Built with React, TypeScript, and Tailwind CSS on the frontend, powered 
                by a robust Node.js server.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="h-12 px-8 rounded-full bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-colors cursor-pointer">
                  Get Started
                </button>
                <button className="h-12 px-8 rounded-full border border-white/10 bg-white/5 font-semibold hover:bg-white/10 transition-colors cursor-pointer">
                  View Stack
                </button>
              </div>
            </div>
          </div>

          <div className="mt-40 grid md:grid-cols-3 gap-6">
            {[
              { title: 'Frontend', desc: 'React 19 + TypeScript + Vite + Tailwind CSS v4', icon: '⚡' },
              { title: 'Backend', desc: 'Node.js + Express + TypeScript + CORS', icon: '🛠️' },
              { title: 'Performance', desc: 'Optimized build pipeline and type safety', icon: '🎯' }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <div className="text-3xl mb-4 opacity-80 group-hover:scale-110 transition-transform origin-left">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
