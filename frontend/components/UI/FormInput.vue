<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <input 
      :type="type" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target?.value)"
      class="form-input"
      v-bind="$attrs"
    />
    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

withDefaults(defineProps<{
  label?: string;
  modelValue?: string | number;
  type?: string;
  error?: string;
}>(), {
  type: 'text'
});

defineEmits<{
  'update:modelValue': [value: string]
}>();
</script>
