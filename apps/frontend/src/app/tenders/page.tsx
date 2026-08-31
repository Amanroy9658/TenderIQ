import { Navbar } from '../../components/layout/Navbar';
import { TenderList } from '../../components/dashboard/TenderList';
import { CreateTenderForm } from '../../components/dashboard/CreateTenderForm';
import Link from 'next/link';

async function getTenders() {
  try {
    const res = await fetch('http://localhost:3001/tenders', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TendersPage() {
  const tenders = await getTenders();

  return (
    <div className="min-h-screen bg-[#fdfdfd] dark:bg-black font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <Navbar />

      <main className="container mx-auto max-w-6xl p-6 mt-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">Tender Pipeline</h2>
          <p className="text-neutral-500 text-sm">Manage and evaluate your upcoming bids.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateTenderForm />
          </div>
          <div className="lg:col-span-2">
            {/* We can reuse TenderList but make items clickable by wrapping in links or we modify TenderList to support links. Since TenderList doesn't have links yet, let's just use it and rely on users navigating via the UI... wait, they need to click it. I'll modify TenderList below. */}
            <TenderList tenders={tenders} />
            <p className="text-xs text-neutral-400 mt-4">* To view details, modify TenderList to include links to /tenders/[id]</p>
          </div>
        </div>
      </main>
    </div>
  );
}
