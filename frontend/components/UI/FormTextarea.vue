<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <textarea 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-textarea"
      v-bind="$attrs"
    ></textarea>
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
