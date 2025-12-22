"use client";

import { useState } from "react";
import { ProductList } from "./ProductList";
import { RepoList } from "./RepoList";
import { CountryList } from "./CountryList";
import { UserList } from "./UserList";
import { CartList } from "./CartList";
import { DashboardHeader } from "./DashboardHeader";

export function UnifiedExplorer() {
  const [toggles, setToggles] = useState({
    products: true,
    countries: true,
    repos: true,
    users: true,
    carts: true,
  });

  const handleToggle = (key: keyof typeof toggles) => (enabled: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: enabled }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Data Explorer</h1>
          <p className="text-muted-foreground">
            Unified, multi-source dashboard
          </p>
        </div>
      </div>

      <DashboardHeader query="" toggles={toggles} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="h-full min-h-[500px]">
          <ProductList
            searchQuery=""
            isEnabled={toggles.products}
            onToggle={handleToggle("products")}
          />
        </div>

        <div className="h-full min-h-[500px]">
          <CountryList
            searchQuery=""
            isEnabled={toggles.countries}
            onToggle={handleToggle("countries")}
          />
        </div>

        <div className="h-full min-h-[500px]">
          <RepoList
            searchQuery=""
            isEnabled={toggles.repos}
            onToggle={handleToggle("repos")}
          />
        </div>

        <div className="h-full min-h-[500px]">
          <UserList
            searchQuery=""
            isEnabled={toggles.users}
            onToggle={handleToggle("users")}
          />
        </div>

        {/* <div className="h-full min-h-[500px]">
          <CartList
            searchQuery=""
            isEnabled={toggles.carts}
            onToggle={handleToggle("carts")}
          />
        </div> */}
      </div>
    </div>
  );
}
