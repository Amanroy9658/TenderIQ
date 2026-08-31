import { Navbar } from '../../../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { FileUpload } from '../../../components/ui/FileUpload';
import { RunAIButton } from '../../../components/dashboard/RunAIButton';
import { CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';

async function getTender(id: string) {
  try {
    const res = await fetch(`http://localhost:3001/tenders/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCompanyProfiles() {
  try {
    const res = await fetch('http://localhost:3001/company-profiles', { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}

export default async function TenderDetailsPage({ params }: { params: { id: string } }) {
  const tender = await getTender(params.id);
  const profiles = await getCompanyProfiles();
  const defaultCompanyId = profiles[0]?.id;

  if (!tender) {
    return <div className="p-8 text-center">Tender not found.</div>;
  }

  // Pre-calculate stats
  const reqCount = tender.requirements?.length || 0;
  const asseCount = tender.assessments?.length || 0;

  return (
    <div className="min-h-screen bg-[#fdfdfd] dark:bg-black font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <Navbar />

      <main className="container mx-auto max-w-6xl p-6 mt-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">{tender.title}</h2>
            <p className="text-neutral-500 text-sm max-w-2xl">{tender.description}</p>
          </div>
          {defaultCompanyId && (
            <RunAIButton tenderId={tender.id} companyId={defaultCompanyId} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingest Tender PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  endpoint={`http://localhost:3001/tenders/${tender.id}/documents`} 
                  label="Upload Tender RFP Document"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Requirements Extracted</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-50">{reqCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Requirements Assessed</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-50">{asseCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extracted Requirements Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reqCount === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-sm border border-dashed border-neutral-300 dark:border-neutral-700 rounded-md">
                    No requirements extracted yet. Upload a PDF and the AI will populate this matrix.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tender.requirements.map((req: any) => {
                      const assessment = tender.assessments?.find((a: any) => a.requirementId === req.id);
                      
                      let statusIcon = null;
                      let statusBadge = <Badge variant="outline">Not Evaluated</Badge>;
                      
                      if (assessment) {
                        switch (assessment.status) {
                          case 'PASS':
                            statusBadge = <Badge variant="success">Pass</Badge>;
                            statusIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
                            break;
                          case 'FAIL':
                            statusBadge = <Badge variant="destructive">Fail</Badge>;
                            statusIcon = <XCircle className="h-5 w-5 text-red-500" />;
                            break;
                          case 'NEEDS_REVIEW':
                            statusBadge = <Badge variant="warning">Needs Review</Badge>;
                            statusIcon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
                            break;
                        }
                      }

                      return (
                        <div key={req.id} className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-2 items-center">
                              {statusIcon}
                              <h4 className="font-semibold text-neutral-900 dark:text-neutral-50">{req.category}</h4>
                            </div>
                            {statusBadge}
                          </div>
                          
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2">{req.description}</p>
                          <div className="bg-neutral-50 dark:bg-neutral-900 p-2 rounded text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-2">
                            {JSON.stringify(req.metadata)}
                          </div>
                          
                          {assessment && (
                            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                              <p className="text-xs font-semibold text-neutral-500 mb-1">AI Reasoning:</p>
                              <p className="text-sm text-neutral-700 dark:text-neutral-300">{assessment.reasoning}</p>
                              <p className="text-xs text-neutral-400 mt-2">Confidence: {assessment.confidence}%</p>
                              
                              {assessment.recommendations && assessment.recommendations.length > 0 && (
                                <div className="mt-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-3 rounded">
                                  <p className="text-xs font-bold mb-1">Action Item</p>
                                  <p className="text-xs text-neutral-800 dark:text-neutral-200">{assessment.recommendations[0].actionText}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
