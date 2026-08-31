import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { FileUpload } from '../../components/ui/FileUpload';
import { Database, FileText } from 'lucide-react';

async function getCompanyProfiles() {
  try {
    const res = await fetch('http://localhost:3001/company-profiles', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function CompanyProfile() {
  const profiles = await getCompanyProfiles();
  const profile = profiles[0]; // Assuming single tenant for MVP

  return (
    <div className="min-h-screen bg-[#fdfdfd] dark:bg-black font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <Navbar />

      <main className="container mx-auto max-w-4xl p-6 mt-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">Company Evidence</h2>
          <p className="text-neutral-500 text-sm">Manage your documents and verified facts.</p>
        </div>

        {!profile ? (
          <Card>
            <CardContent className="p-12 text-center text-neutral-500">
              No company profile found in database.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Upload Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingest New Document</CardTitle>
                </CardHeader>
                <CardContent>
                   <FileUpload 
                    endpoint={`http://localhost:3001/company-profiles/${profile.id}/documents`} 
                    label="Upload ISO, Audit, or Capability PDF"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Uploaded Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {profile.documents?.map((doc: any) => (
                      <li key={doc.id} className="text-sm p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between">
                        <span className="truncate">{doc.filename}</span>
                        <span className="text-neutral-500 text-xs">{(doc.sizeBytes / 1024).toFixed(1)} KB</span>
                      </li>
                    ))}
                    {profile.documents?.length === 0 && <p className="text-xs text-neutral-500">No documents yet.</p>}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Extracted Facts Section */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Verified Facts Vector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.facts?.map((fact: any) => (
                      <div key={fact.id} className="p-3 rounded border border-neutral-200 dark:border-neutral-800">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-400">
                            {fact.category}
                          </span>
                          <span className="text-xs text-neutral-400">conf: {fact.confidenceScore}%</span>
                        </div>
                        <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          {typeof fact.value === 'object' ? JSON.stringify(fact.value) : fact.value}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{fact.context}</p>
                      </div>
                    ))}
                    {profile.facts?.length === 0 && <p className="text-xs text-neutral-500">No facts extracted yet.</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
