<script setup>
import ToolField from "./utils/ToolField.vue";
import Tools from "../tools";

const tools = Tools();
</script>

<template>
  <div>
    <h1 class="text-3xl text-center m-5 font-black">Debugging ToolBox</h1>
    <div class="grid grid-cols-4">
      <div v-for="t in tools" class="m-2">
        <router-link :to="`/utils/${t.name}`">
          <ToolField :title="t.title" :subtitle="t.subtitle" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
