import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUserStore } from '@/stores/user-store';
import { Toaster, toast } from 'sonner';
export function SettingsPage() {
  const user = useUserStore((s) => s.user);
  const preferences = useUserStore((s) => s.preferences);
  const setUser = useUserStore((s) => s.setUser);
  const setPreference = useUserStore((s) => s.setPreference);
  const [profile, setProfile] = useState(user);
  const [prefs, setPrefs] = useState(preferences);
  useEffect(() => {
    setProfile(user);
  }, [user]);
  useEffect(() => {
    setPrefs(preferences);
  }, [preferences]);
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(p => ({ ...p, [id]: value }));
  };
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(profile);
    toast.success('Profile updated successfully!');
  };
  const handlePrefsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreference('emailNotifications', prefs.emailNotifications);
    toast.success('Preferences saved!');
  };
  return (
    <>
      <Toaster richColors theme="dark" />
      <Header />
      <div className="p-4 md:p-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <form onSubmit={handleProfileSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={profile.name} onChange={handleProfileChange} className="bg-accent" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile.email} onChange={handleProfileChange} className="bg-accent" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
          <TabsContent value="preferences">
            <form onSubmit={handlePrefsSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your application experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="font-normal leading-snug text-muted-foreground">
                        Receive email updates and summaries.
                      </span>
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={prefs.emailNotifications}
                      onCheckedChange={(checked) => setPrefs(p => ({ ...p, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                      <span>Dark Mode</span>
                      <span className="font-normal leading-snug text-muted-foreground">
                        Toggle the application's color scheme.
                      </span>
                    </Label>
                    <Switch id="dark-mode" disabled checked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Preferences</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}