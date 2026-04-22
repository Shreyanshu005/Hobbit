import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <main className="relative z-10 pb-32">
        <Outlet />
      </main>

      <Navbar />
    </div>
  );
}
