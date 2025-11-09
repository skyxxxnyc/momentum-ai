import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCrmStore } from '@/stores/crm-store';
export function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const articles = useCrmStore(s => s.articles);
  const article = articles.find(a => a.id === articleId);
  if (!article) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center text-center p-8 flex-1">
          <h1 className="text-4xl font-bold text-momentum-slate mb-4">Article Not Found</h1>
          <p className="text-lg text-momentum-dark-slate mb-8">
            We couldn't find the article you were looking for.
          </p>
          <Button asChild>
            <Link to="/knowledge-hub">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Hub
            </Link>
          </Button>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="p-4 md:p-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/knowledge-hub">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Hub
            </Link>
          </Button>
          <article>
            <header className="mb-8">
              <Badge variant="secondary" className="mb-4">{article.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-momentum-slate mb-4 leading-tight">
                {article.title}
              </h1>
            </header>
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="prose prose-invert prose-lg max-w-none text-momentum-light-slate
                            prose-headings:text-momentum-slate prose-a:text-momentum-cyan
                            prose-strong:text-momentum-slate">
              <p className="lead text-xl text-momentum-dark-slate mb-8">{article.summary}</p>
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}