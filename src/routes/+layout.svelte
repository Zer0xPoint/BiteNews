<script lang="ts">
  import '../app.css';
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-2xl font-bold text-indigo-600">BiteNews</a>
          </div>
        </div>
        <div class="flex items-center">
          <!-- Auth buttons will go here -->
        </div>
      </div>
    </nav>
  </header>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <slot />
  </main>

  <footer class="bg-white border-t">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <p class="text-center text-gray-500 text-sm">
        © 2024 BiteNews. All rights reserved.
      </p>
    </div>
  </footer>
</div>