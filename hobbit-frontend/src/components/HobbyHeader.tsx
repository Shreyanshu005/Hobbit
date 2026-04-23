

interface HobbyHeaderProps {
  name: string;
}

export function HobbyHeader({ name }: HobbyHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="relative inline-block">
        <h1
          className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 capitalize relative z-10"
          style={{ fontFamily: "'Caveat', cursive, ui-sans-serif, system-ui" }}
        >
          {name}
        </h1>
        <svg
          className="absolute -bottom-2 left-0 w-[110%] text-[#6d58e0]/40 pointer-events-none -translate-x-[5%]"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          style={{ height: '0.4em' }}
        >
          <path d="M 2 15 Q 50 25 98 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
