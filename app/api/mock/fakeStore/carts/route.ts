import { NextResponse } from "next/server";

const carts = [
  {
    id: 1,
    userId: 1,
    date: "2023-08-01",
    products: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ],
  },
  {
    id: 2,
    userId: 2,
    date: "2023-08-05",
    products: [{ productId: 3, quantity: 3 }],
  },
];

export async function GET() {
  return NextResponse.json(carts);
}

