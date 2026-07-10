<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target.value)"
      class="form-select"
      v-bind="$attrs"
    >
      <slot></slot>
    </select>
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script setup>
defineOptions({
  inheritAttrs: false
});

defineProps({
  label: String,
  modelValue: [String, Number],
  error: String
});

defineEmits(['update:modelValue']);
</script>
