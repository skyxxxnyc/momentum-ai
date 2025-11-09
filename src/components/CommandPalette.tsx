import React, { useEffect } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { LayoutDashboard, Handshake, Users, MessageSquare, PlusCircle, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen, open]);
  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/deals'))}>
            <Handshake className="mr-2 h-4 w-4" />
            <span>Deals</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/contacts'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Contacts</span>
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => navigate('/companies'))}>
            <Building className="mr-2 h-4 w-4" />
            <span>Companies</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/chat'))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>AI Agent</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => console.log('New Deal'))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Deal</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => console.log('New Contact'))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Contact</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}