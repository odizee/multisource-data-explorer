import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { Cart } from "@/types";
import { fakeStoreApi } from "@/lib/api/fakeStore";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { DataSection } from "./DataSection";
import { PaginationControls } from "./PaginationControls";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "./useDebounce";

const ITEMS_PER_PAGE = 10;

export function CartList({
  searchQuery,
  isEnabled,
  onToggle,
}: {
  searchQuery: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const fetchCarts = useCallback(() => fakeStoreApi.getCarts(), []);

  const {
    data: carts,
    loading,
    error,
    refetch,
  } = useDataFetcher<Cart[]>({
    fetcher: fetchCarts,
    enabled: isEnabled,
  });

  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState("");
  const debouncedLocal = useDebounce(localQuery, 300);
  const effectiveQuery = debouncedLocal || searchQuery;

  const filtered = useMemo(() => {
    if (!carts) return [];
    if (!effectiveQuery) return carts;
    const q = effectiveQuery.toLowerCase();
    return carts.filter((c) => {
      const idStr = String(c.id);
      const userStr = String(c.userId);
      const dateStr = c.date.toLowerCase();
      return idStr.includes(q) || userStr.includes(q) || dateStr.includes(q);
    });
  }, [carts, effectiveQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [effectiveQuery]);

  return (
    <DataSection
      title="Carts"
      count={filtered.length}
      isLoading={loading}
      error={error}
      isEnabled={isEnabled}
      onToggle={onToggle}
      onRetry={refetch}
    >
      <div className="flex flex-col min-h-[400px]">
        <div className="p-4 border-b">
          <Input
            placeholder="Search carts..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2 p-4">
          {paginated.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-8">
              No carts found
            </div>
          )}
          {paginated.map((c) => {
            const totalItems = c.products.reduce(
              (sum, p) => sum + p.quantity,
              0
            );
            return (
              <Link href={`/cart/${c.id}`} key={c.id} className="block group">
                <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate group-hover:text-primary">
                      Cart #{c.id}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        User {c.userId}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Items {totalItems}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
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
