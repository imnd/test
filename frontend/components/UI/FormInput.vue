<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <input 
      :type="type" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-input"
      v-bind="$attrs"
    />
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
  type: {
    type: String,
    default: 'text'
  },
  error: String
});

defineEmits(['update:modelValue']);
</script>
