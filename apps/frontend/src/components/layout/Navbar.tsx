import Link from 'next/link';
import { Layers } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-neutral-900 dark:text-neutral-50" />
          <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">TenderIQ</span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-neutral-900 dark:text-neutral-50 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300">
            Dashboard
          </Link>
          <Link href="/tenders" className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
            Tenders
          </Link>
          <Link href="/company" className="text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-50">
            Company Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
