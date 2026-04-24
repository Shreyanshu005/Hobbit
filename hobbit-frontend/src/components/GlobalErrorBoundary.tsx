import { useRouteError } from 'react-router-dom';

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        An unexpected error occurred. Please try refreshing the page.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  );
}
