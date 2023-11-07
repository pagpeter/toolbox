<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch, nextTick } from "vue";
import TextField from "./utils/TextField.vue";
import ToolField from "./utils/ToolField.vue";
import Tools from "../tools";

const tools = Tools();
const value = ref("");
let similarOnes = [];
let tool = ref({});

const getInputType = (i) => {
  switch (typeof i) {
    case "boolean":
      return "checkbox";
    case "number":
      return "number";
    case "string":
      return "text";
    default:
      return "text";
  }
};

const computeVal = (input) => {
  if (!input) return "  ";
  try {
    const cnfg = {};
    tool.value.config.forEach((e) => (cnfg[e.name] = e.val));
    return tool.value.func(input, cnfg);
  } catch (e) {
    return e.message;
  }
};

const mount = (route) => {
  tool = ref(route?.meta.tool);
  similarOnes = tool.value.similar?.map((s) => tools.find((x) => s === x.name));
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

    <div v-if="tool.config">
      <h2 class="text-2xl font-bold mx-5 mt-7 mb-3">Config</h2>
      <div class="grid grid-cols-5">
        <div
          v-for="(cnfg, i) in tool.config"
          :key="cnfg.name"
          @click="
            typeof cnfg.val === 'boolean'
              ? ((cnfg.val = !cnfg.val), nextTick(computeVal, 50))
              : null
          "
          class="m-2 flex gap-2 bg-gray-800 p-2 rounded-xl shadow-xl justify-center items-center cursor-pointer"
        >
          <span class="my-auto">{{ cnfg.title }}</span>
          <input
            :key="cnfg._c"
            :type="getInputType(cnfg.val)"
            v-model="cnfg.val"
            class="my-auto"
          />
        </div>
      </div>
    </div>

    <div v-if="similarOnes?.length > 0">
      <h2 class="text-2xl font-bold mx-5 mt-7 mb-3">Similar tools</h2>
      <div class="grid grid-cols-4">
        <div v-for="sim in similarOnes" class="m-2">
          <router-link :to="`/utils/${sim.name}`">
            <ToolField :title="sim.title" :subtitle="sim.subtitle" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
