"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTodo } from "../lib/todo";
import { parseTodoForm } from "../lib/validation";
import { ActionState } from "../types/todo";

// Used with useActionState, so it receives the previous state first
// and returns an error (plus the submitted values) for the form to display.
export async function createTodoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = parseTodoForm(formData);

  if (!parsed.success) {
    return { error: parsed.error, values: parsed.values };
  }

  const todoId = await createTodo(parsed.data);

  if (!todoId) {
    return { error: "Failed to create todo. Please try again.", values: parsed.data };
  }

  revalidatePath("/Todo");
  redirect("/Todo");
}
