"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Priority, Todo } from "../types/todo";
import { toggleTodo } from "../actions/toggle";
import { deleteTodo } from "../actions/delete";
import { bulkDeleteTodos, bulkSetCompleted } from "../actions/bulk";
import RelativeTime from "./RelativeTime";

const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  // Only count selections that are still in the list: todos can disappear
  // after searching, filtering or another action.
  const selected = todos.filter((todo) => selectedIds.has(todo._id)).map((todo) => todo._id);
  const allSelected = todos.length > 0 && selected.length === todos.length;
  const someSelected = selected.length > 0 && !allSelected;
  const bulkDisabled = selected.length === 0 || isPending;

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds(allSelected ? new Set() : new Set(todos.map((todo) => todo._id)));
  }

  function runBulkAction(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      setSelectedIds(new Set());
    });
  }

  function handleBulkDelete() {
    const label = selected.length === 1 ? "1 todo" : `${selected.length} todos`;
    if (window.confirm(`Delete ${label}? This can't be undone.`)) {
      runBulkAction(() => bulkDeleteTodos(selected));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={toggleSelectAll}
            className="h-4 w-4 accent-blue-600"
          />
          {selected.length > 0 ? `${selected.length} selected` : "Select all"}
        </label>

        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            type="button"
            disabled={bulkDisabled}
            onClick={() => runBulkAction(() => bulkSetCompleted(selected, true))}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-green-50 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
          >
            ✓ Mark complete
          </button>
          <button
            type="button"
            disabled={bulkDisabled}
            onClick={() => runBulkAction(() => bulkSetCompleted(selected, false))}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            ↺ Mark incomplete
          </button>
          <button
            type="button"
            disabled={bulkDisabled}
            onClick={handleBulkDelete}
            className="px-3 py-1 text-sm rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <ul className={`space-y-3 transition-opacity ${isPending ? "opacity-60" : ""}`}>
        {todos.map((todo) => {
          const isSelected = selectedIds.has(todo._id);

          return (
            <li
              key={todo._id}
              className={`flex items-center gap-3 border rounded-lg p-4 transition-colors ${
                isSelected ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelected(todo._id)}
                aria-label={`Select "${todo.title}"`}
                className="h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
              />

              <form action={toggleTodo.bind(null, todo._id)}>
                <button
                  type="submit"
                  title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm transition-colors ${
                    todo.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-400 text-transparent hover:border-green-500 hover:text-green-500"
                  }`}
                >
                  ✓
                </button>
              </form>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-lg break-words min-w-0 ${
                      todo.completed ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${PRIORITY_BADGE_STYLES[todo.priority]}`}
                  >
                    {todo.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Created <RelativeTime date={todo.createdAt} />
                  {todo.updatedAt && (
                    <>
                      {" · "}Updated <RelativeTime date={todo.updatedAt} />
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <Link
                  href={`/Todo/edit/${todo._id}`}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title="Edit todo"
                >
                  ✏️
                </Link>

                <form action={deleteTodo.bind(null, todo._id)}>
                  <button
                    type="submit"
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    title="Delete todo"
                  >
                    🗑️
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
