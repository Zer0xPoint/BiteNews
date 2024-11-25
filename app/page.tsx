import { prisma } from '@/lib/prisma';
import { ArticleCard } from '@/components/ArticleCard';

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    include: {
      source: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 20,
  });

  return (
    <main className="container mx-auto py-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
} 