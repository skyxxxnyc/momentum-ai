import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { CommandPalette } from '../CommandPalette';
import { NotificationsPopover } from '../notifications/NotificationsPopover';
import { UserProfileDropdown } from './UserProfileDropdown';
const getTitleFromPath = (path: string) => {
  if (path === '/') return 'Dashboard';
  const title = path.replace('/', '').charAt(0).toUpperCase() + path.slice(2);
  return title;
};
interface HeaderProps {
  children?: React.ReactNode;
  onNewDeal?: () => void;
  onNewContact?: () => void;
}
export function Header({ children, onNewDeal, onNewContact }: HeaderProps) {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <header className="flex items-center justify-between h-16 px-4 md:px-8 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-momentum-slate">{getTitleFromPath(location.pathname)}</h1>
          {children}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Search className="h-5 w-5 text-momentum-dark-slate" />
          </Button>
          <NotificationsPopover />
          <UserProfileDropdown />
        </div>
      </header>
      <CommandPalette open={open} setOpen={setOpen} onNewDeal={onNewDeal} onNewContact={onNewContact} />
    </>
  );
}