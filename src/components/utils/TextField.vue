<script setup>
import { ref } from "vue";
const props = defineProps({
  placeholder: String,
  setValue: String,
  modelValue: String,
  disabled: String,
});
defineEmits(["update:modelValue"]);

// if (props.setValue) props.modelValue = props.setValue;
</script>

<template>
  <div>
    <textarea
      class="bg-gray-700 rounded-xl shadow-xl resize-none w-full h-full p-2"
      autocomplete="off"
      autocorrect="off"
      :placeholder="props.placeholder"
      :value="props.setValue || props.modelValue"
      :disabled="disabled"
      @input="
        $emit('update:modelValue', $event.target.value);
        console.log($event.target.value);
      "
    />
  </div>
</template>
