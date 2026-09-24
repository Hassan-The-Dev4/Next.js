// 2. This page is a Server Component that renders a Client Component.
import Counter from "../_components/Counter";

export default function CounterPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Client Component Counter</h1>
      <Counter />
    </main>
  );
}
