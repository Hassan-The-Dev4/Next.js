import Link from "next/link";
import { createTodoAction } from "../actions/create";
import TodoForm from "../_components/TodoForm";

export default function NewTodoPage() {
  return (
    <main className="max-w-2xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Todo</h1>
          <Link href="/Todo" className="text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Todos
          </Link>
        </div>

        <TodoForm action={createTodoAction} submitLabel="Create Todo" pendingLabel="Creating..." />
      </div>
    </main>
  );
}
