import { useState, useMemo, useCallback, useEffect } from "react";
import { Country } from "@/types";
import { countriesApi } from "@/lib/api/countries";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { DataSection } from "./DataSection";
import { PaginationControls } from "./PaginationControls";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebounce } from "./useDebounce";

const ITEMS_PER_PAGE = 10;

export function CountryList({
  searchQuery,
  isEnabled,
  onToggle,
}: {
  searchQuery: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const fetchCountries = useCallback(() => countriesApi.getAll(), []);

  const { data: countries, loading, error, refetch } = useDataFetcher<Country[]>({
    fetcher: fetchCountries,
    enabled: isEnabled,
  });

  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState("");
  const debouncedLocal = useDebounce(localQuery, 300);
  const effectiveQuery = debouncedLocal || searchQuery;

  const filtered = useMemo(() => {
    if (!countries) return [];
    if (!effectiveQuery) return countries;
    const q = effectiveQuery.toLowerCase();
    return countries.filter((c) => {
      const name = c.name?.common?.toLowerCase() || "";
      const region = c.region?.toLowerCase() || "";
      const capital = (c.capital?.[0] || "").toLowerCase();
      return (
        name.includes(q) ||
        region.includes(q) ||
        capital.includes(q)
      );
    });
  }, [countries, effectiveQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [effectiveQuery]);

  return (
    <DataSection
      title="Countries"
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
            placeholder="Search countries..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2 p-4">
          {paginated.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-8">No countries found</div>
          )}
          {paginated.map((c) => (
            <div key={c.cca3} className="block group">
              <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                <div className="h-12 w-20 flex-shrink-0 bg-white rounded-md p-2 flex items-center justify-center border">
                  <Image
                    src={c.flags.png}
                    alt={c.flags.alt || c.name.common}
                    width={80}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary">
                    {c.name.common}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {c.region}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Pop. {c.population.toLocaleString()}
                    </span>
                    {c.capital?.[0] && (
                      <span className="text-xs text-muted-foreground">
                        Capital {c.capital[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
