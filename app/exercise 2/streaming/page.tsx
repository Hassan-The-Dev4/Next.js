// 5. Streaming: the page shell is sent right away, the fallback shows,
import { Suspense } from "react";
import SlowComponent from "../_components/SlowComponent";

export const dynamic = "force-dynamic";

export default function StreamingPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Streaming Demo</h1>
      <Suspense fallback="Loading...">
        <SlowComponent />
      </Suspense>
    </main>
  );
}
