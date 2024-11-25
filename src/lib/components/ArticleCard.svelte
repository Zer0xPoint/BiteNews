<script lang="ts">
  export let title: string;
  export let summary: string;
  export let source: string;
  export let url: string;
  export let publishedAt: Date;
</script>

<a href={url} class="block hover:bg-gray-50">
  <div class="px-4 py-4 sm:px-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium text-indigo-600 truncate">
        {title}
      </h2>
      <div class="ml-2 flex-shrink-0 flex">
        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {source}
        </p>
      </div>
    </div>
    <div class="mt-2">
      <p class="text-sm text-gray-500">
        {summary}
      </p>
    </div>
  </div>
</a>