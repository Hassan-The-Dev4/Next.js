import Link from "next/link";

const exercises = [
  { href: "/exercise 2/products", label: "1. Server Component – Products" },
  { href: "/exercise 2/counter", label: "2. Client Component – Counter" },
  { href: "/exercise 2/time", label: "3. SSR Simulation – Current Time" },
  { href: "/exercise 2/about", label: "4. Static Page – About Us" },
  { href: "/exercise 2/streaming", label: "5. Streaming – Suspense" },
];

export default function Exercise2Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Exercise 2</h1>
      <ul className="list-disc pl-6 space-y-2">
        {exercises.map((ex) => (
          <li key={ex.href}>
            <Link href={ex.href} className="text-blue-600 underline">
              {ex.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
