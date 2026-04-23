import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, Home, LayoutGrid, LogOut, Search, TrendingUp, List, Plus, ChevronLeft } from 'lucide-react';
import { cn } from '../utils/cn';

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const isChatPage = location.pathname === '/onboarding';

  const leftNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'My Skills', href: '/dashboard', icon: List },
    { name: 'New Hobby', href: '/onboarding', icon: Plus },
  ];

  const rightNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { name: 'Progress', href: '/dashboard', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#fffbf4] text-slate-900 selection:bg-indigo-500/30">
      <div className={cn(
        "min-h-screen flex lg:grid",
        isChatPage ? "lg:grid-cols-[80px_280px_1fr_80px]" : "lg:grid-cols-[80px_1fr_80px]"
      )}>
        <aside className="hidden lg:block border-r border-black/5 bg-[#fff9ef] backdrop-blur-xl sticky top-0 h-screen w-[80px]">
          <div className="h-full flex flex-col items-center py-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center mb-6">
              <LayoutGrid className="w-5 h-5 text-indigo-600" />
            </div>
            <nav className="flex flex-col gap-2 mt-1">
              {leftNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex flex-col items-center gap-1.5 group transition-colors',
                      isActive ? 'text-indigo-700' : 'text-slate-500'
                    )}
                    aria-label={item.name}
                    title={item.name}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      isActive ? "bg-indigo-600/10" : "group-hover:bg-black/5"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[14px] font-bold leading-none">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-6">
              <Link
                to="/onboarding"
                className="flex flex-col items-center gap-1.5 group text-slate-500 transition-colors"
                aria-label="Sign out"
                title="Sign out"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-black/5 transition-all">
                  <LogOut className="w-6 h-6" />
                </div>
                <span className="text-[14px] font-bold leading-none">Sign out</span>
              </Link>
            </div>
          </div>
        </aside>

        {isChatPage && (
          <aside className="hidden lg:block border-r border-black/5 bg-[#fff9ef] backdrop-blur-xl sticky top-0 h-screen w-[280px] animate-in slide-in-from-left duration-300">
            <div className="h-full flex flex-col p-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-900 font-bold mb-8 hover:opacity-70 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                <span className="text-[17px] font-bold tracking-tight">General Collection</span>
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-[#110d19] text-white rounded-full py-3 flex items-center justify-center gap-2 hover:bg-[#110d19]/90 transition-colors shadow-lg shadow-black/10"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-bold">New Conversation</span>
              </button>
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1 flex flex-col">
          {!isChatPage && (
            <header className="pt-6 sticky top-0 z-10 bg-[#fffbf4]/70 backdrop-blur">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-black/5 text-sm font-semibold text-slate-700">
                      <CalendarDays className="w-4 h-4 text-[#00bdff]" />
                      <span className="text-slate-700">{today}</span>
                    </div>
                    <button
                      type="button"
                      className="w-10 h-10 rounded-md bg-white border border-black/5 hover:bg-white/80 transition-colors"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4 mx-auto text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>
            </header>
          )}
          <main className={cn(
            "flex-1 overflow-y-auto",
            isChatPage ? "" : "px-4 pb-28 lg:px-8 lg:pb-12"
          )}>
            <Outlet />
          </main>
        </div>

        <aside className="hidden lg:block border-l border-black/5 bg-[#fff9ef] backdrop-blur-xl sticky top-0 h-screen w-[80px]">
          <div className="h-full flex flex-col items-center py-5">
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-black/5 shadow-sm mb-3" />
            <div className="text-xs font-semibold text-slate-700 mb-6">Shreyanshu</div>
            <nav className="flex flex-col gap-3">
              {rightNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex flex-col items-center gap-2 group transition-colors',
                      isActive ? 'text-indigo-700' : 'text-slate-600'
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                      isActive ? "bg-indigo-600/10" : "group-hover:bg-black/5"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[14px] font-bold leading-none">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 py-3 border-t border-black/10 bg-[#fff9ef]">
          <div className="flex items-center justify-evenly">
            {leftNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-colors',
                    isActive ? 'text-indigo-700 bg-indigo-600/10' : 'text-slate-600 hover:bg-black/5'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium leading-none">{item.name}</span>
                </Link>
              );
            })}
            <Link
              to="/dashboard"
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-colors',
                location.pathname === '/settings' ? 'text-indigo-700 bg-indigo-600/10' : 'text-slate-600 hover:bg-black/5'
              )}
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 border border-black/5" />
              <span className="text-[10px] font-medium leading-none">You</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
