'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { PlusCircle, Loader2 } from 'lucide-react';

export function CreateTenderForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Tender
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Tender Title</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-2 text-sm text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="e.g. Metro Expansion Phase 2"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded p-2 text-sm text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="Brief overview..."
              rows={3}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting || !title}
            className="w-full bg-black dark:bg-white text-white dark:text-black rounded p-2 text-sm font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Tender Workspace'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
