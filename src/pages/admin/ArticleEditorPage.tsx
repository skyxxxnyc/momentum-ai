import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCrmStore } from '@/stores/crm-store';
import { Article } from '@/lib/types';
import { Toaster, toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
export function ArticleEditorPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const articles = useCrmStore(s => s.articles);
  const addArticle = useCrmStore(s => s.addArticle);
  const updateArticle = useCrmStore(s => s.updateArticle);
  const [article, setArticle] = useState<Partial<Article>>({
    title: '',
    category: '',
    summary: '',
    imageUrl: '',
    content: '',
  });
  const isEditing = Boolean(articleId);
  useEffect(() => {
    if (isEditing) {
      const existingArticle = articles.find(a => a.id === articleId);
      if (existingArticle) {
        setArticle(existingArticle);
      }
    }
  }, [articleId, articles, isEditing]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setArticle(prev => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = isEditing
      ? updateArticle(article as Article)
      : addArticle({ ...article, id: `article-${Date.now()}` } as Article);
    toast.promise(promise, {
      loading: 'Saving article...',
      success: () => {
        navigate('/admin/articles');
        return 'Article saved successfully!';
      },
      error: 'Failed to save article.',
    });
  };
  return (
    <>
      <Toaster richColors theme="dark" />
      <Header />
      <div className="p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate('/admin/articles')} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-momentum-slate">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={article.title} onChange={handleChange} required className="bg-accent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={article.category} onChange={handleChange} required className="bg-accent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" value={article.imageUrl} onChange={handleChange} required className="bg-accent" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" value={article.summary} onChange={handleChange} required className="bg-accent" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <Textarea id="content" value={article.content} onChange={handleChange} required className="bg-accent" rows={15} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create Article'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}