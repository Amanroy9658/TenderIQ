import { Navbar } from '../components/layout/Navbar';
import { TenderList } from '../components/dashboard/TenderList';
import { ActionItems } from '../components/dashboard/ActionItems';
import { StatCards } from '../components/dashboard/StatCards';

// Fetch real data from NestJS backend
async function getTenders() {
  try {
    // We add cache: 'no-store' to ensure we always see fresh data during dev
    const res = await fetch('http://localhost:3001/tenders', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Dashboard() {
  const tenders = await getTenders();

  return (
    <div className="min-h-screen bg-[#fdfdfd] dark:bg-black font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <Navbar />

      <main className="container mx-auto max-w-6xl p-6 mt-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">Qualification Overview</h2>
          <p className="text-neutral-500 text-sm">Monitor your tender pipeline and required actions.</p>
        </div>

        <StatCards tenders={tenders} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TenderList tenders={tenders} />
          </div>
          <div className="lg:col-span-1">
            <ActionItems tenders={tenders} />
          </div>
        </div>
      </main>
    </div>
  );
}
