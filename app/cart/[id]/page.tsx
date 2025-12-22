import { fakeStoreApi } from "@/lib/api/fakeStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const p = await params;
    const cart = await fakeStoreApi.getCart(parseInt(p.id));
    return { title: `Cart #${cart.id}` };
  } catch (e) {
    return { title: "Cart Not Found" };
  }
}

export default async function CartPage({ params }: PageProps) {
  const { id } = await params;
  let cart;
  let error;

  try {
    cart = await fakeStoreApi.getCart(parseInt(id));
  } catch (e) {
    error = "Failed to load cart details";
  }

  if (error || !cart) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="mb-4">{error || "Cart not found"}</p>
        <Button asChild>
          <Link href="/">Back to Explorer</Link>
        </Button>
      </div>
    );
  }

  const totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Explorer
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Cart #{cart.id}</h1>
        <div className="text-muted-foreground">
          User {cart.userId} • {new Date(cart.date).toLocaleDateString()} • Items {totalItems}
        </div>

        <div className="mt-4 space-y-2">
          {cart.products.map((p) => (
            <div key={p.productId} className="flex items-center justify-between border rounded p-3">
              <span>Product {p.productId}</span>
              <span className="text-muted-foreground">Qty {p.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

