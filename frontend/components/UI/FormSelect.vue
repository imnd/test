<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

withDefaults(defineProps<{
  label?: string;
  modelValue?: string | number;
  error?: string;
  options?: { value: string | number; label: string }[];
}>(), {
  options: () => []
});

defineEmits<{
  'update:modelValue': [value: string]
}>();
</script>

<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target?.value)"
      class="form-select"
      v-bind="$attrs"
    >
      <slot></slot>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>