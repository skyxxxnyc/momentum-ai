import React, { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { useUserStore } from '@/stores/user-store';
import { useCrmStore } from '@/stores/crm-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Handshake, Activity, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { STAGES } from '@/lib/mock-data';
export function MyHubPage() {
  const user = useUserStore(s => s.user);
  const deals = useCrmStore(s => s.deals);
  const activities = useCrmStore(s => s.activities);
  const myDeals = useMemo(() => deals.filter(d => d.ownerId === user?.id), [deals, user]);
  const myActivities = useMemo(() => activities.filter(a => a.userId === user?.id), [activities, user]);
  const kpiData = useMemo(() => {
    const openDeals = myDeals.filter(d => d.stage !== 'Closed-Won' && d.stage !== 'Closed-Lost');
    const pipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0);
    const dealsWon = myDeals.filter(d => d.stage === 'Closed-Won').length;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activitiesThisWeek = myActivities.filter(a => new Date(a.date) > sevenDaysAgo).length;
    return [
      { title: 'My Open Pipeline', value: `$${(pipelineValue / 1000).toFixed(0)}k`, icon: DollarSign },
      { title: 'My Deals Won (All Time)', value: dealsWon, icon: Handshake },
      { title: 'My Activities (Last 7 Days)', value: activitiesThisWeek, icon: Activity },
      { title: 'My Quota Attainment', value: '78%', icon: Target },
    ];
  }, [myDeals, myActivities]);
  const pipelineChartData = useMemo(() => {
    const openDeals = myDeals.filter(d => d.stage !== 'Closed-Won' && d.stage !== 'Closed-Lost');
    const dealStageData = STAGES.reduce((acc, stage) => {
      if (stage !== 'Closed-Won' && stage !== 'Closed-Lost') {
        acc[stage] = { name: stage, value: 0 };
      }
      return acc;
    }, {} as Record<string, { name: string; value: number }>);
    openDeals.forEach(deal => {
      if (dealStageData[deal.stage]) {
        dealStageData[deal.stage].value += deal.value;
      }
    });
    return Object.values(dealStageData);
  }, [myDeals]);
  if (!user) {
    return null; // Or a loading state
  }
  return (
    <>
      <Header />
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-momentum-slate">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-momentum-dark-slate">Here's your personal hub for today.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map(item => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-momentum-dark-slate">{item.title}</CardTitle>
                <item.icon className="h-5 w-5 text-momentum-dark-slate" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-momentum-slate">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Pipeline by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>My Top 5 Deals</CardTitle>
              <CardDescription>Your highest value open opportunities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myDeals
                  .filter(d => d.stage !== 'Closed-Won' && d.stage !== 'Closed-Lost')
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map(deal => (
                    <Link to="/deals" key={deal.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                      <div>
                        <p className="font-semibold text-momentum-slate">{deal.title}</p>
                        <p className="text-sm text-momentum-dark-slate">{deal.stage}</p>
                      </div>
                      <p className="font-bold text-momentum-cyan">${deal.value.toLocaleString()}</p>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}