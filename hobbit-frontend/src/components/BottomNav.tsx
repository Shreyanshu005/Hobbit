import { NavLink } from 'react-router-dom';
import { Home, List, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </NavLink>

        <NavLink 
          to="/onboarding"
          className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-all -translate-y-6 border-4 border-white"
        >
          <Plus size={28} strokeWidth={3} />
        </NavLink>

        <NavLink 
          to="/dashboard"
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
          )}
        >
          <List size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">My Skills</span>
        </NavLink>
      </div>
    </nav>
  );
}
