"use server";

import { revalidatePath } from "next/cache";
import { deleteTodos, setTodosCompleted } from "../lib/todo";

// Server actions can be called with any payload, so check the shape at runtime
// even though TypeScript says it's a string[].
function toIdList(ids: unknown): string[] {
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
}

export async function bulkSetCompleted(ids: string[], completed: boolean) {
  const todoIds = toIdList(ids);

  if (todoIds.length === 0 || typeof completed !== "boolean") {
    console.error("Todo IDs and completed status are required");
    return;
  }

  const updatedCount = await setTodosCompleted(todoIds, completed);

  if (updatedCount === 0) {
    console.error("Failed to update todos");
    return;
  }

  revalidatePath("/Todo");
}

export async function bulkDeleteTodos(ids: string[]) {
  const todoIds = toIdList(ids);

  if (todoIds.length === 0) {
    console.error("Todo IDs are required");
    return;
  }

  const deletedCount = await deleteTodos(todoIds);

  if (deletedCount === 0) {
    console.error("Failed to delete todos");
    return;
  }

  revalidatePath("/Todo");
}
