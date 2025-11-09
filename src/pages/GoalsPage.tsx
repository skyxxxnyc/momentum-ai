import React from 'react';
import { Header } from '@/components/layout/Header';
import { useCrmStore } from '@/stores/crm-store';
import { useUserStore } from '@/stores/user-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Handshake, Calendar } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
const GoalCard = ({ goal }: { goal: any }) => {
  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isRevenue = goal.type === 'revenue';
  const Icon = isRevenue ? DollarSign : Handshake;
  const getProgressColor = (p: number) => {
    if (p < 25) return 'bg-red-500';
    if (p < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-momentum-slate flex items-center gap-2">
            <Icon className="h-5 w-5 text-momentum-cyan" />
            {isRevenue ? 'Quarterly Revenue' : 'Deals Won'}
          </CardTitle>
          <div className="text-xs text-momentum-dark-slate flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(goal.startDate), 'MMM d')} - {format(new Date(goal.endDate), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <CardDescription className="text-momentum-dark-slate">
          {formatDistanceToNowStrict(new Date(goal.endDate), { addSuffix: true })} remaining
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-momentum-slate">
            {isRevenue ? `$${goal.currentValue.toLocaleString()}` : goal.currentValue}
          </span>
          <span className="text-momentum-dark-slate">
            / {isRevenue ? `$${goal.targetValue.toLocaleString()}` : goal.targetValue}
          </span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-momentum-light-slate">Progress</span>
            <span className="font-semibold text-momentum-cyan">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className={cn("h-2", getProgressColor(progress))} />
        </div>
      </CardContent>
    </Card>
  );
};
export function GoalsPage() {
  const user = useUserStore(s => s.user);
  const goals = useCrmStore(s => s.goals);
  const isLoading = useCrmStore(s => s.isLoading);
  const myGoals = goals.filter(g => g.userId === user?.id);
  return (
    <>
      <Header />
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">My Goals</h1>
          <p className="text-momentum-dark-slate">Track your performance and stay on target.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))
          ) : myGoals.length > 0 ? (
            myGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)
          ) : (
            <div className="col-span-full text-center py-16 border-2 border-dashed border-border/50 rounded-lg">
              <h3 className="text-xl font-semibold text-momentum-slate">No Goals Set</h3>
              <p className="text-momentum-dark-slate mt-2">Contact your administrator to set up your performance goals.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}