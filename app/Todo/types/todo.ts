export const TITLE_MAX_LENGTH = 200;

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];
export const DEFAULT_PRIORITY: Priority = "medium";

export function isPriority(value: unknown): value is Priority {
  return PRIORITIES.includes(value as Priority);
}

export const STATUS_FILTERS = ["all", "active", "completed"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export function isStatusFilter(value: unknown): value is StatusFilter {
  return STATUS_FILTERS.includes(value as StatusFilter);
}

export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt?: string;
};

export type CreateTodoInput = {
  title: string;
  completed?: boolean;
  priority?: Priority;
};

export type UpdateTodoInput = {
  title?: string;
  completed?: boolean;
  priority?: Priority;
};

export type TodoFilters = {
  q?: string;
  status?: StatusFilter;
};

export type TodoFormValues = {
  title: string;
  priority: Priority;
};

// State returned by form actions used with useActionState.
// On success the action redirects, so only errors are ever returned, together
// with the submitted values so the form can show them again.
export type ActionState = { error: string; values?: TodoFormValues } | null;
