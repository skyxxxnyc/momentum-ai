import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Zap, Lightbulb, MessageSquare } from 'lucide-react';
import { useCrmStore } from '@/stores/crm-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
const notificationIcons = {
  reminder: Zap,
  suggestion: Lightbulb,
  ai_advice: MessageSquare,
};
export function NotificationsPopover() {
  const navigate = useNavigate();
  const notifications = useCrmStore(s => s.notifications);
  const markAllAsRead = useCrmStore(s => s.markAllNotificationsAsRead);
  const setSelectedDealId = useCrmStore(s => s.setSelectedDealId);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (notification.dealId) {
      navigate('/deals');
      setSelectedDealId(notification.dealId);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-momentum-dark-slate" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-momentum-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-momentum-cyan text-xs items-center justify-center text-momentum-dark font-bold">
                {unreadCount}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card border-border/50 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold text-momentum-slate">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="link" className="p-0 h-auto text-momentum-cyan" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-96">
          {notifications.length > 0 ? (
            notifications.map(notification => {
              const Icon = notificationIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "p-4 flex items-start gap-4",
                    !notification.isRead && "bg-accent/50",
                    notification.dealId ? "cursor-pointer hover:bg-accent" : ""
                  )}
                >
                  <div className="mt-1">
                    <Icon className="h-5 w-5 text-momentum-cyan" />
                  </div>
                  <div>
                    <p className="text-sm text-momentum-light-slate">{notification.message}</p>
                    <p className="text-xs text-momentum-dark-slate mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-8 text-momentum-dark-slate">
              <p>You're all caught up!</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}