<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import TextField from "./utils/TextField.vue";
import ToolField from "./utils/ToolField.vue";
import Tools from "../tools";

const tools = Tools();
const value = ref("");
let similarOnes = [];
let tool = {};

const computeVal = (input) => {
  if (!input) return "  ";
  try {
    return tool.func(input);
  } catch (e) {
    console.log(tool.func);
    console.log(e);
    return e.message;
  }
};

const mount = (route) => {
  tool = route?.meta.tool;
  similarOnes = tool.similar?.map((s) => tools.find((x) => s === x.name));
};

mount(useRoute());
const route = useRoute();
watch(route, () => mount(route));
</script>

<template>
  <div>
    <h1 class="text-3xl text-center m-5 font-black">{{ tool.title }}</h1>
    <router-link class="text-xl text-center m-5 font-bold" to="/"
      >Home</router-link
    >

    <div class="grid grid-cols-2 gap-2 m-2">
      <TextField
        class="m-2 text-center h-64"
        placeholder="Input..."
        v-model="value"
      />
      <TextField
        class="m-2 text-center"
        :set-value="computeVal(value)"
        disabled="true"
      />
    </div>

    <h2
      v-if="similarOnes?.length > 0"
      class="text-2xl font-bold mx-5 mt-7 mb-3"
    >
      Similar tools
    </h2>
    <div v-if="similarOnes?.length > 0" class="grid grid-cols-4">
      <div v-for="sim in similarOnes" class="m-2">
        <router-link :to="`/utils/${sim.name}`">
          <ToolField :title="sim.title" :subtitle="sim.subtitle" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
