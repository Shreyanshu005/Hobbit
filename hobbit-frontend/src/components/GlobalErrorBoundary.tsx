import { useRouteError } from 'react-router-dom';
import { HobbyButton } from './atoms/HobbyButton';
import logoPng from '../assets/logo.png';
import { RefreshCw } from 'lucide-react';

export function GlobalErrorBoundary() {
  const error = useRouteError();

  const isChunkLoadError = error instanceof Error && 
    (error.message.includes('Failed to fetch dynamically imported module') || 
     error.name === 'ChunkLoadError');

  if (isChunkLoadError) {
    window.location.reload();
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#fffbf4] px-4 text-center">
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
        <img src={logoPng} alt="Hobbit Logo" className="w-full h-full object-contain relative z-10 opacity-50 grayscale" />
      </div>
      
      <h1 
        className="text-5xl font-bold text-slate-900 mb-4"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        Oops! Something went wrong.
      </h1>
      
      <p className="text-sm text-slate-500 mb-8 max-w-md font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        We encountered an unexpected error. Please try again.
      </p>
      
      <HobbyButton 
        onClick={() => window.location.href = '/#/dashboard'}
        className="px-6 py-3 flex items-center gap-2 rounded-full shadow-sm text-sm font-bold"
      >
        <RefreshCw className="w-5 h-5" />
        Return to Dashboard
      </HobbyButton>
    </div>
  );
}
