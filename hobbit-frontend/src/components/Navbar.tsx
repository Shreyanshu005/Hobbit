import { Link, useLocation } from 'react-router-dom';
import { Compass, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '../utils/cn';
import { useHobbyStore } from '../stores/useHobbyStore';

export function Navbar() {
  const location = useLocation();
  const hobbies = useHobbyStore((state) => state.hobbies);

  const navItems = [
    { name: 'Explore', href: '/onboarding', icon: Compass },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, disabled: hobbies.length === 0 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        const isDisabled = item.disabled;

        return (
          <Link
            key={item.href}
            to={isDisabled ? '#' : item.href}
            onClick={(e) => isDisabled && e.preventDefault()}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300',
              isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
              isDisabled && 'opacity-30 cursor-not-allowed grayscale'
            )}
          >
            <Icon size={18} className={cn(isActive && 'animate-pulse')} />
            <span className="text-sm font-medium hidden md:block">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
