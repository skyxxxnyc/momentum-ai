import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Article } from '@/lib/types';
import { Link } from 'react-router-dom';
interface ArticleCardProps {
  article: Article;
}
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/knowledge-hub/${article.id}`} className="group">
      <Card className="bg-card border-border/50 flex flex-col h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col">
          <Badge variant="secondary" className="mb-3 self-start">{article.category}</Badge>
          <h3 className="text-lg font-semibold text-momentum-slate mb-2 flex-1">{article.title}</h3>
          <p className="text-sm text-momentum-dark-slate line-clamp-3">{article.summary}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center text-sm font-semibold text-momentum-cyan group-hover:underline">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}