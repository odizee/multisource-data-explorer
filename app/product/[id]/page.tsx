import { fakeStoreApi } from "@/lib/api/fakeStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: { id: string };
}

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const p = await params;
    const product = await fakeStoreApi.getProduct(parseInt(p.id));
    return { title: product.title };
  } catch (e) {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  let product;
  let error;

  try {
    product = await fakeStoreApi.getProduct(parseInt(id));
  } catch (e) {
    error = "Failed to load product details";
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="mb-4">{error || "Product not found"}</p>
        <Button asChild>
          <Link href="/">Back to Explorer</Link>
        </Button>
      </div>
    );
  }

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

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-xl border flex items-center justify-center min-h-[400px]">
          <Image
            src={product.image}
            alt={product.title}
            width={600}
            height={400}
            className="h-auto w-auto max-h-[400px] object-contain"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {product.rating.rate} ({product.rating.count} reviews)
              </div>
            </div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
          </div>

          <div className="text-4xl font-bold">${product.price.toFixed(2)}</div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="pt-6">
            <Button size="lg" className="w-full md:w-auto gap-2">
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const products = await fakeStoreApi.getProducts(100);
    return products.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}
