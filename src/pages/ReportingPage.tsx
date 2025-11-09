import React, { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { useCrmStore } from '@/stores/crm-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell } from 'recharts';
import { STAGES } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const SalesLeaderboard = ({ users, deals }) => {
  const leaderboardData = useMemo(() => {
    return users.map(user => {
      const dealsWon = deals.filter(d => d.ownerId === user.id && d.stage === 'Closed-Won');
      const revenue = dealsWon.reduce((sum, d) => sum + d.value, 0);
      return { ...user, revenue, dealsWon: dealsWon.length };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [users, deals]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Leaderboard</CardTitle>
        <CardDescription>Top performers by revenue generated.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((user, index) => (
            <div key={user.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-accent">
              <span className="font-bold text-lg text-momentum-dark-slate w-6">{index + 1}</span>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-momentum-slate">{user.name}</p>
                <p className="text-sm text-momentum-dark-slate">{user.dealsWon} deals won</p>
              </div>
              <p className="font-bold text-lg text-momentum-cyan">${user.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
const DealFunnel = ({ deals }) => {
  const funnelData = useMemo(() => {
    const stageCounts = STAGES.reduce((acc, stage) => ({ ...acc, [stage]: 0 }), {});
    deals.forEach(deal => {
      if (stageCounts[deal.stage] !== undefined) {
        stageCounts[deal.stage]++;
      }
    });
    return STAGES.map(stage => ({
      name: stage,
      value: stageCounts[stage],
      fill: `hsl(var(--primary), ${1 - (STAGES.indexOf(stage) / STAGES.length) * 0.7})`,
    }));
  }, [deals]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Conversion Funnel</CardTitle>
        <CardDescription>Number of deals in each stage.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              <LabelList position="right" fill="#CCD6F6" stroke="none" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
const ActivityBreakdown = ({ activities }) => {
  const activityData = useMemo(() => {
    const typeCounts = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [activities]);
  const COLORS = ['#64FFDA', '#CCD6F6', '#8892b0', '#a8b2d1'];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Breakdown</CardTitle>
        <CardDescription>Activities logged by type.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={activityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {activityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
export function ReportingPage() {
  const deals = useCrmStore(s => s.deals);
  const users = useCrmStore(s => s.users);
  const activities = useCrmStore(s => s.activities);
  const isLoading = useCrmStore(s => s.isLoading);
  return (
    <>
      <Header />
      <div className="p-4 md:p-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">Reporting & Analytics</h1>
          <p className="text-momentum-dark-slate">Insights into your team's performance and pipeline.</p>
        </div>
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full lg:col-span-2" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <DealFunnel deals={deals} />
            <ActivityBreakdown activities={activities} />
            <div className="lg:col-span-2">
              <SalesLeaderboard users={users} deals={deals} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}