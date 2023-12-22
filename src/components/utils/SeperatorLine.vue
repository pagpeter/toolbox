<script setup>
const props = defineProps({
  title: String,
});
</script>

<template>
  <div class="flex items-center justify-between">
    <div
      class="border border-bottom my-5 mt-7 border-gray-800 w-4/12 lg:w-5/12"
    ></div>
    <p class="text-xl font-bold">{{ title }}</p>
    <div
      class="border border-bottom my-5 mt-7 border-gray-800 w-4/12 lg:w-5/12"
    ></div>
  </div>
</template>
