import { NextResponse } from "next/server";

const products = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  title: i === 0 ? "E2E Product" : `Product ${i + 1}`,
  price: 10 + i,
  description: `Description ${i + 1}`,
  category: i % 2 === 0 ? "Electronics" : "Clothing",
  image: "https://example.com/product.png",
  rating: { rate: 4.7, count: 123 },
}));

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const p = await params;
  const idNum = parseInt(p.id);
  const product = products.find((p) => p.id === idNum);
  if (!product) {
    return NextResponse.json({}, { status: 404 });
  }
  return NextResponse.json(product);
}
