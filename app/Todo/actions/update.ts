"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchTodoById, updateTodo } from "../lib/todo";
import { parseTodoForm } from "../lib/validation";
import { ActionState } from "../types/todo";

// Used with useActionState, so it receives the previous state first
// and returns an error (plus the submitted values) for the form to display.
export async function updateTodoAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const parsed = parseTodoForm(formData);

  if (!id) {
    return { error: "Todo ID is required" };
  }

  if (!parsed.success) {
    return { error: parsed.error, values: parsed.values };
  }

  const existingTodo = await fetchTodoById(id);

  if (!existingTodo) {
    return { error: "Todo not found", values: parsed.data };
  }

  const success = await updateTodo(id, parsed.data);

  if (!success) {
    return { error: "Failed to update todo. Please try again.", values: parsed.data };
  }

  revalidatePath("/Todo");
  redirect("/Todo");
}
