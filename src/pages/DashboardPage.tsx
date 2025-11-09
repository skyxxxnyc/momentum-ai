import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DEALS } from '@/lib/mock-data';
import { DollarSign, Handshake, Target, Activity as ActivityIcon } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Link } from 'react-router-dom';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useUserStore } from '@/stores/user-store';
import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
const kpiData = [
  { id: 'kpi-pipeline', title: 'Pipeline Value', value: '$1.2M', icon: DollarSign, change: '+12%', link: '/deals' },
  { id: 'kpi-deals-won', title: 'Deals Won', value: '82', icon: Handshake, change: '+5', link: '/deals' },
  { id: 'kpi-conversion', title: 'Conversion Rate', value: '24%', icon: Target, change: '-1.2%', link: '/deals' },
  { id: 'kpi-activities', title: 'Activities Logged', value: '452', icon: ActivityIcon, change: '+50', link: '/' },
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
const KpiCard = ({ item }: { item: typeof kpiData[0] }) => (
  <Link to={item.link}>
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-momentum-dark-slate">{item.title}</CardTitle>
        <item.icon className="h-5 w-5 text-momentum-dark-slate" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-momentum-slate">{item.value}</div>
        <p className="text-xs text-momentum-dark-slate">{item.change} from last month</p>
      </CardContent>
    </Card>
  </Link>
);
const PipelineChart = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Pipeline by Stage</CardTitle>
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
);
const ActivityChart = () => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Sales Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesActivityData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          <Line type="monotone" dataKey="deals" stroke="hsl(var(--primary))" strokeWidth={2} />
          <Line type="monotone" dataKey="activities" stroke="hsl(var(--foreground))" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
const allWidgets = {
  ...kpiData.reduce((acc, item) => ({ ...acc, [item.id]: <KpiCard item={item} /> }), {}),
  'chart-pipeline': <PipelineChart />,
  'chart-activity': <ActivityChart />,
};
export function DashboardPage() {
  const dashboardLayout = useUserStore(s => s.preferences.dashboardLayout);
  const setDashboardLayout = useUserStore(s => s.setDashboardLayout);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const sortedWidgets = useMemo(() => {
    return dashboardLayout.map(id => ({
      id,
      component: allWidgets[id as keyof typeof allWidgets],
      className: id.startsWith('chart-') ? 'lg:col-span-2' : 'md:col-span-1',
    })).filter(w => w.component);
  }, [dashboardLayout]);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = dashboardLayout.indexOf(active.id as string);
      const newIndex = dashboardLayout.indexOf(over!.id as string);
      setDashboardLayout(arrayMove(dashboardLayout, oldIndex, newIndex));
    }
  };
  return (
    <>
      <Header />
      <div className="p-4 md:p-8 space-y-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dashboardLayout} strategy={rectSortingStrategy}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {sortedWidgets.map(widget => (
                <DashboardWidget key={widget.id} id={widget.id} className={widget.className}>
                  {widget.component}
                </DashboardWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}