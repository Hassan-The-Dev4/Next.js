import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTodoById } from "../../lib/todo";
import { updateTodoAction } from "../../actions/update";
import TodoForm from "../../_components/TodoForm";
import RelativeTime from "../../_components/RelativeTime";

interface EditTodoPageProps {
  // In Next.js 15, params is a Promise and must be awaited.
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTodoPage({ params }: EditTodoPageProps) {
  const { id } = await params;
  const todo = await fetchTodoById(id);

  if (!todo) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Todo</h1>
          <Link href="/Todo" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Todos
          </Link>
        </div>

        <TodoForm todo={todo} action={updateTodoAction} submitLabel="Update Todo" pendingLabel="Updating...">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Status:</span> {todo.completed ? "Completed" : "Pending"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Created:</span>{" "}
              {new Date(todo.createdAt).toLocaleDateString()} (<RelativeTime date={todo.createdAt} />)
            </p>
            {todo.updatedAt && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Last updated:</span>{" "}
                {new Date(todo.updatedAt).toLocaleDateString()} (<RelativeTime date={todo.updatedAt} />)
              </p>
            )}
          </div>
        </TodoForm>
      </div>
    </main>
  );
}
