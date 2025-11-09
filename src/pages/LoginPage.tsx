import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';
import { User } from '@/lib/types';
import apiService from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
export function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const login = useUserStore(s => s.login);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await apiService.getAll<User>('users');
        setUsers(fetchedUsers);
      } catch (error) {
        toast.error('Failed to load user profiles.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);
  const handleLogin = (user: User) => {
    login(user);
    toast.success(`Welcome back, ${user.name}!`);
    setTimeout(() => navigate('/'), 1000);
  };
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Toaster richColors theme="dark" />
      <div className="text-center mb-8">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="url(#paint1_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="url(#paint2_linear_1_2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
                <linearGradient id="paint0_linear_1_2" x1="12" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#64FFDA"/>
                    <stop offset="1" stopColor="#64FFDA" stopOpacity="0.5"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_2" x1="12" y1="17" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#64FFDA"/>
                    <stop offset="1" stopColor="#64FFDA" stopOpacity="0.5"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_2" x1="12" y1="12" x2="12" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#64FFDA"/>
                    <stop offset="1" stopColor="#64FFDA" stopOpacity="0.5"/>
                </linearGradient>
            </defs>
        </svg>
        <h1 className="text-4xl font-bold text-momentum-slate">Momentum AI</h1>
        <p className="text-momentum-dark-slate mt-2">The Autonomous Revenue Platform</p>
      </div>
      <Card className="w-full max-w-md bg-card border-border/50">
        <CardHeader>
          <CardTitle>Select a profile to log in</CardTitle>
          <CardDescription>This is a demo environment. Please choose a user to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-momentum-cyan" />
            </div>
          ) : (
            <div className="space-y-4">
              {users.map(user => (
                <Button
                  key={user.id}
                  variant="outline"
                  className="w-full h-auto justify-start p-4 text-left"
                  onClick={() => handleLogin(user)}
                >
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-momentum-slate">{user.name}</p>
                    <p className="text-sm text-momentum-dark-slate">{user.title}</p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <footer className="absolute bottom-4 text-center text-xs text-momentum-dark-slate">
        <p>Built with ❤️ at Cloudflare.</p>
      </footer>
    </div>
  );
}