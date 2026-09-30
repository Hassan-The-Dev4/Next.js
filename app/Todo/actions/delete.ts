"use server";

import { revalidatePath } from "next/cache";
import { deleteTodo as deleteTodoFromDB } from "../lib/todo";

export async function deleteTodo(id: string) {
  if (!id) {
    console.error("Todo ID is required");
    return;
  }

  const success = await deleteTodoFromDB(id);

  if (!success) {
    console.error("Failed to delete todo");
    return;
  }

  revalidatePath("/Todo");
}
