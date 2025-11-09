import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Handshake, Users, Building, MessageSquare, Settings, BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/deals', icon: Handshake, label: 'Deals' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/companies', icon: Building, label: 'Companies' },
  { to: '/knowledge-hub', icon: BookOpen, label: 'Knowledge Hub' },
  { to: '/chat', icon: MessageSquare, label: 'AI Agent' },
];
const bottomItems = [
    { to: '/settings', icon: Settings, label: 'Settings' },
]
export function Sidebar() {
  return (
    <aside className="w-16 bg-card flex flex-col items-center py-4 border-r border-border/50">
      <div className="mb-8">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      </div>
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'p-3 rounded-lg transition-colors duration-200',
                      isActive ? 'bg-momentum-cyan/20 text-momentum-cyan' : 'text-momentum-dark-slate hover:bg-accent hover:text-momentum-slate'
                    )
                  }
                >
                  <item.icon className="h-6 w-6" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4">
            {bottomItems.map((item) => (
                <Tooltip key={item.to}>
                <TooltipTrigger asChild>
                    <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                        cn(
                        'p-3 rounded-lg transition-colors duration-200',
                        isActive ? 'bg-momentum-cyan/20 text-momentum-cyan' : 'text-momentum-dark-slate hover:bg-accent hover:text-momentum-slate'
                        )
                    }
                    >
                    <item.icon className="h-6 w-6" />
                    </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{item.label}</p>
                </TooltipContent>
                </Tooltip>
            ))}
        </div>
      </TooltipProvider>
    </aside>
  );
}