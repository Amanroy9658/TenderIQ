import { Card, CardContent } from "../ui/Card";
import { FolderGit2, CheckSquare, Target } from "lucide-react";

export function StatCards({ tenders }: { tenders: any[] }) {
  const totalTenders = tenders?.length || 0;
  
  let fullyQualified = 0;
  let needsReview = 0;

  if (tenders) {
    tenders.forEach(t => {
      const fails = t.assessments?.filter((a: any) => a.status === 'FAIL').length || 0;
      const reviews = t.assessments?.filter((a: any) => a.status === 'NEEDS_REVIEW').length || 0;
      
      if (fails === 0 && reviews === 0 && t.assessments?.length > 0) {
        fullyQualified++;
      } else if (reviews > 0 || fails > 0) {
        needsReview++;
      }
    });
  }

  const stats = [
    {
      title: "Active Tenders",
      value: totalTenders,
      icon: FolderGit2,
    },
    {
      title: "Fully Qualified",
      value: fullyQualified,
      icon: CheckSquare,
    },
    {
      title: "Action Required",
      value: needsReview,
      icon: Target,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <Card key={i} className="hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-500">{stat.title}</p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{stat.value}</p>
            </div>
            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center">
              <stat.icon className="h-5 w-5 text-neutral-900 dark:text-neutral-50" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
