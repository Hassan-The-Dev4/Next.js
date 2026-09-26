import Link from "next/link";

const exercises = [
  { href: "/exercise-3/basic-form", label: "1. Basic Form – Email" },
  { href: "/exercise-3/required-field", label: "2. Required Field – Password" },
  { href: "/exercise-3/greeting", label: "3. Full Name Greeting" },
];

export default function Exercise3Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Exercise 3</h1>
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
