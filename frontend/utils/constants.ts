export const TASK_STATUS_MAP: Record<string, string> = {
  pending: 'Ожидает',
  in_progress: 'В процессе',
  completed: 'Завершено'
};

export const TASK_STATUS_OPTIONS = [
  { value: 'pending', label: TASK_STATUS_MAP.pending },
  { value: 'in_progress', label: TASK_STATUS_MAP.in_progress },
  { value: 'completed', label: TASK_STATUS_MAP.completed }
];
