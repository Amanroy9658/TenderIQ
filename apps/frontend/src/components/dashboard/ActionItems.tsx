import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

export function ActionItems({ tenders }: { tenders: any[] }) {
  // Extract all recommendations across all tenders
  const actionItems: { tenderTitle: string, rec: any }[] = [];
  
  if (tenders) {
    tenders.forEach(t => {
      if (t.assessments) {
        t.assessments.forEach((a: any) => {
          if (a.recommendations) {
            a.recommendations.forEach((rec: any) => {
              actionItems.push({ tenderTitle: t.title, rec });
            });
          }
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Items</CardTitle>
      </CardHeader>
      <CardContent>
        {actionItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-neutral-300 dark:text-neutral-700 mb-2" />
            <p className="text-sm text-neutral-500">No pending action items.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {actionItems.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm group">
                <Circle className="h-4 w-4 mt-0.5 text-neutral-300 dark:text-neutral-700 shrink-0 group-hover:text-neutral-900 dark:group-hover:text-neutral-50 transition-colors" />
                <div className="space-y-1">
                  <p className="text-neutral-900 dark:text-neutral-100">{item.rec.actionText}</p>
                  <p className="text-xs text-neutral-500">
                    <span className="font-medium">{item.tenderTitle}</span>
                    <ArrowRight className="inline-block h-3 w-3 mx-1" />
                    Potentially <span className="font-semibold text-neutral-900 dark:text-neutral-50">{item.rec.potentialStatus}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
