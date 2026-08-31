import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <header className="border-b bg-white dark:bg-slate-950 p-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">TenderIQ</h1>
          <nav className="flex space-x-6 text-sm font-medium">
            <Link href="/" className="hover:text-blue-600">Dashboard</Link>
            <Link href="/tenders" className="hover:text-blue-600">Tenders</Link>
            <Link href="/company" className="hover:text-blue-600">Company Profile</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white dark:bg-slate-950 rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Active Tenders</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <h3 className="font-bold">Metro Rail Extension Phase 2</h3>
                    <p className="text-sm text-slate-500">Ministry of Housing and Urban Affairs</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">85% Qualified</span>
                    <p className="text-xs text-slate-400 mt-2">Due in 14 days</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg border flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <h3 className="font-bold">Smart City Traffic Management</h3>
                    <p className="text-sm text-slate-500">Municipal Corporation</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Needs Review</span>
                    <p className="text-xs text-slate-400 mt-2">Due in 5 days</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-slate-950 rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Action Items</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                  <p>Upload audited financials for 2023 to improve Metro Rail score by 15%.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                  <p>Review contradiction in ISO certificate dates.</p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
