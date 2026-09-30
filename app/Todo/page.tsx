import Link from "next/link";
import { fetchTodos } from "./lib/todo";
import { isStatusFilter, StatusFilter } from "./types/todo";
import TodoFilters from "./_components/TodoFilters";
import TodoList from "./_components/TodoList";

type SearchParam = string | string[] | undefined;

interface TodoHomeProps {
  // In Next.js 15, searchParams is a Promise and must be awaited.
  searchParams: Promise<{ q?: SearchParam; status?: SearchParam }>;
}

// ?q=a&q=b gives an array; only the first value is used.
function firstValue(value: SearchParam): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TodoHome({ searchParams }: TodoHomeProps) {
  const params = await searchParams;
  const q = (firstValue(params.q) ?? "").trim();
  const rawStatus = firstValue(params.status);
  const status: StatusFilter = isStatusFilter(rawStatus) ? rawStatus : "all";
  const isFiltered = q !== "" || status !== "all";

  const todos = await fetchTodos({ q, status });
  const time = new Date().toLocaleTimeString();

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Todo App</h1>
            <p className="text-sm text-gray-500">Last updated: {time}</p>
          </div>
          <Link
            href="/Todo/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ➕ Add New Todo
          </Link>
        </div>

        <TodoFilters q={q} status={status} />

        {isFiltered && todos.length > 0 && (
          <p className="text-sm text-gray-500 mb-3">
            Showing {todos.length} {todos.length === 1 ? "todo" : "todos"}
            {q && <> matching &ldquo;{q}&rdquo;</>}
          </p>
        )}

        {todos.length === 0 ? (
          <div className="text-center py-8">
            {isFiltered ? (
              <>
                <p className="text-gray-500 text-lg">No todos match your filters.</p>
                <Link href="/Todo" className="inline-block text-blue-600 hover:text-blue-800 text-sm mt-2">
                  Clear filters
                </Link>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg">No todos yet!</p>
                <p className="text-gray-400 text-sm mt-2">Create your first todo to get started.</p>
              </>
            )}
          </div>
        ) : (
          <TodoList todos={todos} />
        )}
      </div>
    </main>
  );
}
