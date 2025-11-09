import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCrmStore } from '@/stores/crm-store';
import { chatService } from '@/lib/chat';
import { Loader2, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast, Toaster } from 'sonner';
const collateralTypes = [
  { value: 'proposal', label: 'Sales Proposal' },
  { value: 'battle-card', label: 'Competitor Battle Card' },
  { value: 'one-pager', label: 'Product One-Pager' },
];
export function SalesCollateralPage() {
  const deals = useCrmStore(s => s.deals);
  const contacts = useCrmStore(s => s.contacts);
  const companies = useCrmStore(s => s.companies);
  const [collateralType, setCollateralType] = useState('');
  const [dealId, setDealId] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerate = async () => {
    if (!collateralType) {
      toast.error('Please select a collateral type.');
      return;
    }
    setIsLoading(true);
    setGeneratedContent('');
    const deal = deals.find(d => d.id === dealId);
    const contact = deal ? contacts.find(c => c.id === deal.contactId) : null;
    const company = deal ? companies.find(c => c.id === deal.companyId) : null;
    let prompt = `You are an expert sales operations assistant. Generate a "${collateralTypes.find(c => c.value === collateralType)?.label}" document.`;
    if (deal && contact && company) {
      prompt += `\n\nThe document is for the deal: "${deal.title}" with ${company.name}. The primary contact is ${contact.name}. The deal value is $${deal.value}.`;
    }
    if (additionalContext) {
      prompt += `\n\nHere is some additional context to consider: ${additionalContext}`;
    }
    prompt += `\n\nPlease format the output in clean, professional markdown.`;
    await chatService.sendMessage(prompt, undefined, (chunk) => {
      setGeneratedContent(prev => prev + chunk);
    });
    setIsLoading(false);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard!');
  };
  return (
    <>
      <Toaster richColors theme="dark" />
      <Header />
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-momentum-slate">AI Sales Collateral Generator</h1>
          <p className="text-momentum-dark-slate">Create professional sales documents in seconds.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Provide details for the AI to generate your document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Collateral Type</Label>
                <Select value={collateralType} onValueChange={setCollateralType}>
                  <SelectTrigger className="bg-accent">
                    <SelectValue placeholder="Select a document type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {collateralTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Related Deal (Optional)</Label>
                <Select value={dealId} onValueChange={setDealId}>
                  <SelectTrigger className="bg-accent">
                    <SelectValue placeholder="Select a deal to add context..." />
                  </SelectTrigger>
                  <SelectContent>
                    {deals.map(deal => (
                      <SelectItem key={deal.id} value={deal.id}>{deal.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Additional Context</Label>
                <Textarea
                  placeholder="e.g., Mention our new Q3 features, focus on scalability..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  className="bg-accent"
                  rows={5}
                />
              </div>
              <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Document
              </Button>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>Your AI-generated document will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="relative flex-1">
                <ScrollArea className="absolute inset-0 pr-4">
                  {isLoading && !generatedContent && (
                    <div className="flex flex-col items-center justify-center h-full text-momentum-dark-slate">
                      <Loader2 className="h-12 w-12 animate-spin text-momentum-cyan mb-4" />
                      <p>Generating your document...</p>
                    </div>
                  )}
                  {generatedContent && (
                    <div className="prose prose-invert prose-sm max-w-none text-momentum-light-slate
                                    prose-headings:text-momentum-slate prose-a:text-momentum-cyan
                                    prose-strong:text-momentum-slate whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  )}
                  {!isLoading && !generatedContent && (
                    <div className="flex flex-col items-center justify-center h-full text-momentum-dark-slate text-center">
                      <p>Your generated content will be displayed here.</p>
                      <p className="text-xs mt-2">Configure your document on the left and click "Generate".</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
              {generatedContent && !isLoading && (
                <div className="flex gap-2 pt-4 border-t mt-4">
                  <Button variant="outline" onClick={handleGenerate}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                  </Button>
                  <Button onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}