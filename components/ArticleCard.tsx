import Image from 'next/image';
import { Article, Source } from '@prisma/client';

interface ArticleCardProps {
  article: Article & {
    source: Source;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow">
      {article.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{article.source.name}</span>
          <span>•</span>
          <time dateTime={article.publishedAt.toISOString()}>
            {new Date(article.publishedAt).toLocaleDateString()}
          </time>
        </div>
        <h3 className="text-lg font-semibold mt-2">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        {article.summary && (
          <p className="mt-2 text-muted-foreground">{article.summary}</p>
        )}
      </div>
    </div>
  );
} 