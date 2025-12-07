import { prisma } from "@/lib/prisma";

export default async function TestDBPage() {
  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        category: true,
        owner: { select: { name: true, email: true } },
      },
    });

    return (
      <div className="space-y-4 p-8">
        <h1 className="text-2xl font-bold">Database Test</h1>
        <p>✅ Database connection working!</p>
        <p>Found {products.length} products</p>
        
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="rounded border p-4">
              <h2 className="font-bold">{p.title}</h2>
              <p>ID: {p.id}</p>
              <p>Category: {p.category?.name || "N/A"}</p>
              <p>Owner: {p.owner.name || p.owner.email}</p>
              <p>Active: {p.isActive ? "Yes" : "No"}</p>
              <p>Price: ₹{p.basePricePerMonth}/month</p>
              <p>Images: {p.images ? "Has images" : "No images"}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-4 p-8">
        <h1 className="text-2xl font-bold text-red-600">Database Error</h1>
        <p>❌ Could not connect to database</p>
        <pre className="rounded bg-gray-100 p-4">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}
