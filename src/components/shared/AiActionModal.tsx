import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
interface AiActionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isLoading: boolean;
  content: string;
  onRegenerate: () => void;
}
export function AiActionModal({ isOpen, onOpenChange, title, isLoading, content, onRegenerate }: AiActionModalProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-card border-border/50 text-momentum-slate">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-momentum-slate">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 min-h-[300px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-momentum-dark-slate">
              <Loader2 className="h-12 w-12 animate-spin text-momentum-cyan" />
              <p>Generating response...</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] w-full">
              <Textarea
                readOnly
                value={content}
                className="w-full h-full min-h-[300px] bg-accent border-border/50 text-momentum-slate text-base"
                rows={12}
              />
            </ScrollArea>
          )}
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isLoading}
            className="text-momentum-cyan border-momentum-cyan/50 hover:bg-momentum-cyan/10 hover:text-momentum-cyan"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button onClick={handleCopy} disabled={isLoading || !content}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}