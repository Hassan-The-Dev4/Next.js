// 1. Server Component: no "use client", so this runs on the server.
type Product = {
  id: number;
  title: string;
};

export default async function ProductsPage() {
  const res = await fetch("https://dummyjson.com/products");
  const data: { products: Product[] } = await res.json();
  const products = data.products.slice(0, 5);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ul className="list-disc pl-6">
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </main>
  );
}
