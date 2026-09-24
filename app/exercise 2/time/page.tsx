// 3. SSR simulation: force-dynamic renders this page on every request,
// so the time changes each time you refresh.
export const dynamic = "force-dynamic";

export default function TimePage() {
  const time = new Date().toLocaleTimeString();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Server Time</h1>
      <p>Rendered on the server at: {time}</p>
      <p className="text-sm text-gray-500 mt-2">
        Refresh the page. The time updates on every request.
      </p>
    </main>
  );
}
