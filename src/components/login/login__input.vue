<template>
  <fieldset
    class="flex relative justify-start w-full rounded-lg border border-gray-500 text-gray-500 transition-all duration-300"
  >
    <input
      :id="label"
      class="w-full h-full p-5 outline-none peer focus:border-primary-color"
      placeholder=" "
      :type="type"
      v-model="inputModel"
      :autocomplete="type"
    />
    <label :for="label" class="login-button__animation">{{ label }}</label>
  </fieldset>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps<{
  label: string
  type: string
  modelValue: string | ''
}>()

const emit = defineEmits(['update:modelValue'])
const inputModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
