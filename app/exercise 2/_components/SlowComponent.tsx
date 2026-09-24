// Async Server Component that waits 3 seconds before rendering.
export default async function SlowComponent() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return <p>Slow content loaded after 3 seconds!</p>;
}
