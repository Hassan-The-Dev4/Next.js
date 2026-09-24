// 4. Static page: rendered once at build time into plain HTML.
export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <p>
        We are a small team learning Next.js. This page is generated at build
        time and served as static HTML.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Built at: {new Date().toLocaleTimeString()}. This value never changes
        after the build.
      </p>
    </main>
  );
}
