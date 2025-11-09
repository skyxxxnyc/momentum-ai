import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DEALS } from '@/lib/mock-data';
import { DollarSign, Handshake, Target, Activity as ActivityIcon } from 'lucide-react';
import { Header } from '@/components/layout/Header';
const kpiData = [
  { title: 'Pipeline Value', value: '$1.2M', icon: DollarSign, change: '+12%' },
  { title: 'Deals Won', value: '82', icon: Handshake, change: '+5' },
  { title: 'Conversion Rate', value: '24%', icon: Target, change: '-1.2%' },
  { title: 'Activities Logged', value: '452', icon: ActivityIcon, change: '+50' },
];
const dealStageData = DEALS.reduce((acc, deal) => {
  const stage = deal.stage;
  if (!acc[stage]) {
    acc[stage] = { name: stage, value: 0 };
  }
  acc[stage].value += deal.value;
  return acc;
}, {} as Record<string, { name: string; value: number }>);
const pipelineChartData = Object.values(dealStageData);
const salesActivityData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2023, i, 1).toLocaleString('default', { month: 'short' });
    return {
        name: month,
        deals: Math.floor(Math.random() * 20) + 5,
        activities: Math.floor(Math.random() * 100) + 50,
    };
});
export function DashboardPage() {
  return (
    <>
      <Header />
      <div className="p-4 md:p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-momentum-dark-slate">{kpi.title}</CardTitle>
                <kpi.icon className="h-5 w-5 text-momentum-dark-slate" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-momentum-slate">{kpi.value}</div>
                <p className="text-xs text-momentum-dark-slate">{kpi.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sales Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                  <Line type="monotone" dataKey="deals" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="activities" stroke="hsl(var(--foreground))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}