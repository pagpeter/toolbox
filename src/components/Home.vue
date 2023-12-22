<script setup>
import ToolField from "./utils/ToolField.vue";
import Tools from "../tools";
import ToolType from "../tools/types";
import SeperatorLine from "./utils/SeperatorLine.vue";

const tools = Tools();
</script>

<template>
  <div>
    <h1 class="text-3xl text-center m-5 font-black">Debugging ToolBox</h1>

    <SeperatorLine title="General tools" class="my-4" />

    <div class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
      <div
        v-for="t in tools.filter((t) => t.type === ToolType.GENERAL)"
        class="m-2"
      >
        <router-link :to="`/utils/${t.name}`">
          <ToolField :title="t.title" :subtitle="t.subtitle" />
        </router-link>
      </div>
    </div>

    <SeperatorLine title="Antibot tools" class="my-4" />

    <div class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1">
      <div
        v-for="t in tools.filter((t) => t.type === ToolType.ANTIBOT)"
        class="m-2"
      >
        <router-link :to="`/utils/${t.name}`">
          <ToolField :title="t.title" :subtitle="t.subtitle" />
        </router-link>
      </div>
    </div>

    <SeperatorLine title="External links" class="my-4" />

    <div class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 mb-5">
      <div
        v-for="t in tools.filter((t) => t.type === ToolType.EXTERNAL)"
        class="m-2"
      >
        <a :href="t.link" target="_blank" rel="noopener noreferrer"
          ><ToolField :title="t.title" :subtitle="t.subtitle"
        /></a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
