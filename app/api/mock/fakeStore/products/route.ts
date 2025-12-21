import { NextResponse } from 'next/server';

const products = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  title: i === 0 ? 'Laptop Pro' : `Product ${i + 1}`,
  price: 10 + i,
  description: `Description ${i + 1}`,
  category: i % 2 === 0 ? 'Electronics' : 'Clothing',
  image: 'https://example.com/image.png',
  rating: { rate: 4.5, count: 10 + i },
}));

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam) : products.length;
  return NextResponse.json(products.slice(0, Math.max(0, limit)));
}

