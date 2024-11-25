<script lang="ts">
  export let title: string;
  export let summary: string;
  export let source: string;
  export let url: string;
  export let publishedAt: Date;
  export let imageUrl: string = 'https://via.placeholder.com/800x400';
</script>

<div class="relative bg-white rounded-lg shadow-lg overflow-hidden">
  <img src={imageUrl} alt={title} class="w-full h-48 object-cover" />
  <div class="p-6">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-indigo-600">{source}</span>
      <span class="text-sm text-gray-500">{publishedAt.toLocaleDateString()}</span>
    </div>
    <h2 class="text-xl font-bold text-gray-900 mb-2">{title}</h2>
    <p class="text-gray-600 mb-4">{summary}</p>
    <a href={url} class="text-indigo-600 hover:text-indigo-800 font-medium">
      Read more →
    </a>
  </div>
</div>