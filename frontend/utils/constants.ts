export const TASK_STATUS_MAP: Record<string, string> = {
  pending: 'Ожидает',
  in_progress: 'В процессе',
  completed: 'Завершено'
};

export const TASK_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'pending', label: TASK_STATUS_MAP.pending as string },
  { value: 'in_progress', label: TASK_STATUS_MAP.in_progress as string },
  { value: 'completed', label: TASK_STATUS_MAP.completed as string }
];
