import Form from "next/form";
import Link from "next/link";
import { STATUS_FILTERS, StatusFilter } from "../types/todo";

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

// Build a /Todo URL for the given filters, leaving out defaults to keep it clean.
function filterHref(q: string, status: StatusFilter): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status !== "all") params.set("status", status);
  const query = params.toString();
  return query ? `/Todo?${query}` : "/Todo";
}

type TodoFiltersProps = {
  q: string;
  status: StatusFilter;
};

export default function TodoFilters({ q, status }: TodoFiltersProps) {
  return (
    <div className="space-y-3 mb-6">
      {/* next/form submits as a GET request to /Todo?q=..., using client-side navigation.
          The page reads the search params and runs the query on the server. */}
      <Form action="/Todo" className="flex gap-2">
        <input
          key={q}
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search todos..."
          aria-label="Search todos"
          className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {status !== "all" && <input type="hidden" name="status" value={status} />}
        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
        >
          🔍 Search
        </button>
        {q && (
          <Link
            href={filterHref("", status)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear
          </Link>
        )}
      </Form>

      <nav aria-label="Filter by status" className="flex gap-2">
        {STATUS_FILTERS.map((option) => (
          <Link
            key={option}
            href={filterHref(q, option)}
            aria-current={option === status ? "page" : undefined}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              option === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {STATUS_LABELS[option]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
