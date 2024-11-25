<script lang="ts">
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import FeaturedArticle from '$lib/components/FeaturedArticle.svelte';
  
  const featuredArticle = {
    title: "The Future of AI: Transforming Tech News Consumption",
    summary: "Discover how artificial intelligence is revolutionizing the way we consume and understand technology news, making information more accessible and relevant than ever.",
    source: "BiteNews Featured",
    publishedAt: new Date(),
    url: "#",
    imageUrl: "https://via.placeholder.com/800x400"
  };

  const articles = [
    {
      title: "Web Development Trends 2024",
      summary: "Exploring the latest trends in web development, from new frameworks to innovative design patterns.",
      source: "TechCrunch",
      publishedAt: new Date(),
      url: "#"
    },
    {
      title: "The Rise of Edge Computing",
      summary: "How edge computing is changing the landscape of modern applications and improving user experience.",
      source: "Wired",
      publishedAt: new Date(),
      url: "#"
    },
    {
      title: "Understanding WebAssembly",
      summary: "A deep dive into WebAssembly and its impact on web performance and capabilities.",
      source: "Mozilla",
      publishedAt: new Date(),
      url: "#"
    }
  ];
</script>

<div class="space-y-8">
  <!-- Hero Section -->
  <div class="bg-indigo-700 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold mb-4">
        Stay Ahead with Tech News That Matters
      </h1>
      <p class="text-xl text-indigo-100">
        Curated tech news with AI-powered summaries, delivered daily.
      </p>
    </div>
  </div>

  <!-- Featured Article -->
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Featured Story</h2>
    <FeaturedArticle {...featuredArticle} />
  </div>

  <!-- Latest Articles -->
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h2>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul class="divide-y divide-gray-200">
        {#each articles as article}
          <li>
            <ArticleCard {...article} />
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- Newsletter Section -->
  <div class="bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Get the Latest Tech News in Your Inbox
        </h2>
        <p class="text-gray-600 mb-6">
          Join our newsletter and never miss important updates
        </p>
        <div class="max-w-md mx-auto">
          <div class="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>