'use client';

import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RunAIButton({ tenderId, companyId }: { tenderId: string, companyId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();

  const handleRun = async () => {
    setIsRunning(true);
    try {
      // 1. Run Matching Engine
      await fetch(`http://localhost:3001/tenders/${tenderId}/evaluate/${companyId}`, {
        method: 'POST'
      });
      // 2. Run Impact Analyzer
      await fetch(`http://localhost:3001/impact/tenders/${tenderId}/recommend/${companyId}`, {
        method: 'POST'
      });
      
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <button
      onClick={handleRun}
      disabled={isRunning}
      className="bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
      Run Agentic Evaluation
    </button>
  );
}
