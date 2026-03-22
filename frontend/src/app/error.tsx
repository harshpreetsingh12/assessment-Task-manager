'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong!</h2>
        <p className="text-zinc-400 mb-6">
          The application encountered an unexpected error. Don't worry, your data is safe.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl font-bold transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-xl font-bold transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}