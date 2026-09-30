import { DEFAULT_PRIORITY, isPriority, TITLE_MAX_LENGTH, TodoFormValues } from "../types/todo";

type ParsedTodoForm =
  | { success: true; data: TodoFormValues }
  | { success: false; error: string; values: TodoFormValues };

// Shared validation for the create and edit forms. On failure it also returns
// the submitted values so the form can be re-filled instead of cleared.
export function parseTodoForm(formData: FormData): ParsedTodoForm {
  const rawTitle = String(formData.get("title") ?? "");
  const rawPriority = formData.get("priority") ?? DEFAULT_PRIORITY;

  const values: TodoFormValues = {
    title: rawTitle,
    priority: isPriority(rawPriority) ? rawPriority : DEFAULT_PRIORITY,
  };

  const title = rawTitle.trim();

  if (title.length === 0) {
    return { success: false, error: "Title is required", values };
  }

  if (title.length > TITLE_MAX_LENGTH) {
    return { success: false, error: `Title must be ${TITLE_MAX_LENGTH} characters or less`, values };
  }

  if (!isPriority(rawPriority)) {
    return { success: false, error: "Please choose a valid priority", values };
  }

  return { success: true, data: { title, priority: rawPriority } };
}
