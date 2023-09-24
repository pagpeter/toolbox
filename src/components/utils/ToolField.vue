<script setup>
const props = defineProps({ title: String, subtitle: String, path: String });
</script>

<template>
  <div
    class="bg-gray-800 p-2 m-2 h-full shadow-xl rounded-xl hover:bg-gray-700 cursor-pointer"
  >
    <h2 class="text-xl font-bold">{{ props.title }}</h2>
    <p class="text-gray-100">{{ props.subtitle }}</p>
  </div>
</template>
