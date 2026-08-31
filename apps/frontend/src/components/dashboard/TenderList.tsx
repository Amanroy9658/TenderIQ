import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FileText, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

export function TenderList({ tenders }: { tenders: any[] }) {
  if (!tenders || tenders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Tenders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">No active tenders found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Tenders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tenders.map((tender) => {
          // Calculate qualification status if we have assessments
          const assessments = tender.assessments || [];
          const fails = assessments.filter((a: any) => a.status === 'FAIL').length;
          const reviews = assessments.filter((a: any) => a.status === 'NEEDS_REVIEW').length;
          const passes = assessments.filter((a: any) => a.status === 'PASS').length;
          
          let statusBadge = <Badge variant="outline">Pending</Badge>;
          if (fails > 0) statusBadge = <Badge variant="destructive">Unqualified</Badge>;
          else if (reviews > 0) statusBadge = <Badge variant="warning">Needs Review</Badge>;
          else if (passes > 0) statusBadge = <Badge variant="success">Qualified</Badge>;

          return (
            <div key={tender.id} className="flex items-center justify-between p-4 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-50">{tender.title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md truncate">
                    {tender.description || 'No description provided'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-neutral-500">
                      Due: {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                {statusBadge}
                <span className="text-xs font-mono text-neutral-400">ID: {tender.id.split('-')[0]}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
