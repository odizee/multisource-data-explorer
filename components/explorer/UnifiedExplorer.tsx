"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProductList } from "./ProductList";
import { useDebounce } from "./useDebounce";

export function UnifiedExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [toggles, setToggles] = useState({
    products: true,
    countries: true,
    repos: true,
  });

  const handleToggle = (key: keyof typeof toggles) => (enabled: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: enabled }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Explorer</h1>
          <p className="text-muted-foreground">
            Aggregate data from multiple sources in real-time.
          </p>
        </div>
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <div className="h-full min-h-[500px]">
          <ProductList
            searchQuery={debouncedQuery}
            isEnabled={toggles.products}
            onToggle={handleToggle("products")}
          />
        </div>

        <div className="h-full min-h-[500px]">Repo</div>
      </div>
    </div>
  );
}
