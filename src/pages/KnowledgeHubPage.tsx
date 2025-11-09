import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ARTICLES } from '@/lib/mock-data';
import { ArticleCard } from '@/components/knowledge-hub/ArticleCard';
import { cn } from '@/lib/utils';
const categories = ['All', ...Array.from(new Set(ARTICLES.map(a => a.category)))];
export function KnowledgeHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.summary.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);
  return (
    <>
      <Header />
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-momentum-slate mb-4">Knowledge Hub</h1>
            <p className="text-lg text-momentum-dark-slate">
              Your central resource for sales tips, AI best practices, and platform guides.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-momentum-dark-slate" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10 bg-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map(category => (
              <Button
                key={category}
                variant="outline"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'border-momentum-dark-slate/50 hover:bg-accent',
                  selectedCategory === category ? 'bg-momentum-cyan text-momentum-dark hover:bg-momentum-cyan/90 hover:text-momentum-dark' : 'text-momentum-dark-slate'
                )}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-momentum-dark-slate">No articles found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}