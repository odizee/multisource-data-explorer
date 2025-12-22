import { useMemo, useCallback } from "react";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { fakeStoreApi } from "@/lib/api/fakeStore";
import { countriesApi } from "@/lib/api/countries";
import { githubApi } from "@/lib/api/github";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Globe, User, ShoppingCart, GitBranch } from "lucide-react";

interface DashboardHeaderProps {
  query: string;
  toggles: {
    products: boolean;
    countries: boolean;
    repos: boolean;
    users: boolean;
    carts: boolean;
  };
}

function Stat({
  title,
  icon: Icon,
  count,
  loading,
}: {
  title: string;
  icon: any;
  count: number | null;
  loading: boolean;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <div className="text-2xl font-bold">
            {count !== null ? count.toLocaleString() : "—"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardHeader({ query, toggles }: DashboardHeaderProps) {
  const fetchProducts = useCallback(() => fakeStoreApi.getProducts(100), []);
  const { data: products, loading: loadingProducts } = useDataFetcher({
    fetcher: fetchProducts,
    enabled: toggles.products,
  });
  const productCount = useMemo(
    () => (products ? products.length : null),
    [products]
  );

  const fetchCountries = useCallback(() => countriesApi.getAll(), []);
  const { data: countries, loading: loadingCountries } = useDataFetcher({
    fetcher: fetchCountries,
    enabled: toggles.countries,
  });
  const countryCount = useMemo(
    () => (countries ? countries.length : null),
    [countries]
  );

  const fetchRepos = useCallback(
    () => githubApi.searchRepos(query, 1, 1),
    [query]
  );
  const { data: reposData, loading: loadingRepos } = useDataFetcher({
    fetcher: fetchRepos,
    enabled: toggles.repos,
  });
  const repoCount = useMemo(
    () => (reposData ? reposData.total_count : null),
    [reposData]
  );

  const fetchUsers = useCallback(() => fakeStoreApi.getUsers(), []);
  const { data: users, loading: loadingUsers } = useDataFetcher({
    fetcher: fetchUsers,
    enabled: toggles.users,
  });
  const userCount = useMemo(() => (users ? users.length : null), [users]);

  const fetchCarts = useCallback(() => fakeStoreApi.getCarts(), []);
  const { data: carts, loading: loadingCarts } = useDataFetcher({
    fetcher: fetchCarts,
    enabled: toggles.carts,
  });
  const cartCount = useMemo(() => (carts ? carts.length : null), [carts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Stat
        title="Products"
        icon={Package}
        count={productCount}
        loading={loadingProducts}
      />
      <Stat
        title="Countries"
        icon={Globe}
        count={countryCount}
        loading={loadingCountries}
      />
      <Stat
        title="Repositories"
        icon={GitBranch}
        count={repoCount}
        loading={loadingRepos}
      />
      <Stat
        title="Users"
        icon={User}
        count={userCount}
        loading={loadingUsers}
      />
      <Stat
        title="Carts"
        icon={ShoppingCart}
        count={cartCount}
        loading={loadingCarts}
      />
    </div>
  );
}
