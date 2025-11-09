import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Wrench, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { chatService, renderToolCall } from '@/lib/chat';
import type { ChatState } from '../../worker/types';
import { cn } from '@/lib/utils';
import { Header } from './layout/Header';
export function AiChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    sessionId: chatService.getSessionId(),
    isProcessing: false,
    model: 'google-ai-studio/gemini-2.5-flash',
    streamingMessage: ''
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadCurrentSession = useCallback(async () => {
    const response = await chatService.getMessages();
    if (response.success && response.data) {
      setChatState(prev => ({ ...prev, ...response.data }));
    }
  }, []);
  useEffect(() => {
    loadCurrentSession();
  }, [loadCurrentSession]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages, chatState.streamingMessage]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatState.isProcessing) return;
    const message = input.trim();
    setInput('');
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: message,
      timestamp: Date.now()
    };
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
      streamingMessage: ''
    }));
    await chatService.sendMessage(message, chatState.model, (chunk) => {
      setChatState(prev => ({
        ...prev,
        streamingMessage: (prev.streamingMessage || '') + chunk
      }));
    });
    await loadCurrentSession();
    setChatState(prev => ({ ...prev, isProcessing: false, streamingMessage: '' }));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <div className="flex flex-col h-full bg-card">
      <Header />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatState.messages.length === 0 && !chatState.isProcessing && (
          <div className="text-center text-momentum-dark-slate h-full flex flex-col justify-center items-center">
            <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-momentum-slate">Momentum AI Agent</h2>
            <p className="max-w-md mx-auto mt-2">
              I can help you with tasks, find information, and automate your workflow.
            </p>
          </div>
        )}
        {chatState.messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex items-start gap-4', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && <Bot className="w-8 h-8 rounded-full bg-momentum-cyan text-momentum-dark p-1.5 flex-shrink-0" />}
            <div className={cn('max-w-[80%] p-4 rounded-2xl', msg.role === 'user' ? 'bg-momentum-cyan text-momentum-dark' : 'bg-accent')}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                    <Wrench className="w-3 h-3" />
                    <span>Tools used:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.toolCalls.map((tool, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {renderToolCall(tool)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {msg.role === 'user' && <User className="w-8 h-8 rounded-full bg-momentum-dark-slate text-momentum-slate p-1.5 flex-shrink-0" />}
          </motion.div>
        ))}
        {chatState.streamingMessage && (
          <div className="flex items-start gap-4 justify-start">
            <Bot className="w-8 h-8 rounded-full bg-momentum-cyan text-momentum-dark p-1.5 flex-shrink-0" />
            <div className="max-w-[80%] p-4 rounded-2xl bg-accent">
              <p className="whitespace-pre-wrap">{chatState.streamingMessage}<span className="animate-pulse">|</span></p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-background">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Momentum AI..."
            className="w-full pr-20 pl-4 py-3 bg-accent border-2 border-transparent focus:border-momentum-cyan focus:ring-0 transition-colors"
            rows={1}
            disabled={chatState.isProcessing}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-momentum-cyan hover:bg-momentum-cyan/90 text-momentum-dark"
            disabled={!input.trim() || chatState.isProcessing}
          >
            {chatState.isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}