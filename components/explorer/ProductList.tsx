import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { fakeStoreApi } from "@/lib/api/fakeStore";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { DataSection } from "./DataSection";
import { PaginationControls } from "./PaginationControls";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Image from "next/image";

const ITEMS_PER_PAGE = 5;

export function ProductList({
  searchQuery,
  isEnabled,
  onToggle,
}: {
  searchQuery: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const fetchProducts = useCallback(() => fakeStoreApi.getProducts(100), []);

  const {
    data: products,
    loading,
    error,
    refetch,
  } = useDataFetcher<Product[]>({
    fetcher: fetchProducts,
    enabled: isEnabled,
  });

  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery) return products;
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <DataSection
      title="Products"
      count={filteredProducts.length}
      isLoading={loading}
      error={error}
      isEnabled={isEnabled}
      onToggle={onToggle}
      onRetry={refetch}
    >
      <div className="flex flex-col min-h-[400px]">
        <div className="flex-1 space-y-2 p-4">
          {paginatedProducts.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-8">
              No products found
            </div>
          )}
          {paginatedProducts.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="block group"
            >
              <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                <div className="h-20 w-20 flex-shrink-0 bg-white rounded-md p-2 flex items-center justify-center border">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary">
                    {product.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {product.rating.rate} ({product.rating.count})
                    </div>
                  </div>
                  <div className="mt-2 font-bold text-sm">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-auto border-t">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </DataSection>
  );
}
