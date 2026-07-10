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
    </select>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

defineProps<{
  label?: string;
  modelValue?: string | number;
  error?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string]
}>();
</script>
