<template>
  <div class="filter-group">
    <label class="form-label">Сортировка</label>
    <select :value="modelValue" @change="onChange" class="form-select">
      <option value="created_at-desc">Сначала новые</option>
      <option value="created_at-asc">Сначала старые</option>
      <option value="due_date-asc">По дедлайну (сначала близкие)</option>
      <option value="due_date-desc">По дедлайну (сначала дальние)</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [];
}>();

const onChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLSelectElement).value);
  emit('change');
};
</script>
