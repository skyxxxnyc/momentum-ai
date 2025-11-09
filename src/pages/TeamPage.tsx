import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Mail } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'sonner';
export function TeamPage() {
  const users = useCrmStore(s => s.users);
  const isLoading = useCrmStore(s => s.isLoading);
  const handleInvite = () => {
    toast.info("Invite functionality is not implemented in this demo.");
  };
  return (
    <>
      <Toaster richColors theme="dark" />
      <Header>
        <Button onClick={handleInvite}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </Header>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">Team Members</h1>
          <p className="text-momentum-dark-slate">Manage your team and their roles.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="items-center text-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-4 w-full mx-auto" />
                </CardContent>
              </Card>
            ))
          ) : (
            users.map(user => (
              <Card key={user.id} className="bg-card border-border/50 text-center transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="items-center">
                  <Avatar className="h-24 w-24 border-4 border-momentum-cyan/20">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold text-momentum-slate">{user.name}</h3>
                  <p className="text-momentum-cyan">{user.title}</p>
                  <a href={`mailto:${user.email}`} className="mt-2 inline-flex items-center gap-2 text-sm text-momentum-dark-slate hover:text-momentum-slate transition-colors">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </a>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}