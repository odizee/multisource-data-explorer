import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { User } from "@/types";
import { fakeStoreApi } from "@/lib/api/fakeStore";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { DataSection } from "./DataSection";
import { PaginationControls } from "./PaginationControls";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "./useDebounce";

const ITEMS_PER_PAGE = 10;

export function UserList({
  searchQuery,
  isEnabled,
  onToggle,
}: {
  searchQuery: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const fetchUsers = useCallback(() => fakeStoreApi.getUsers(), []);

  const {
    data: users,
    loading,
    error,
    refetch,
  } = useDataFetcher<User[]>({
    fetcher: fetchUsers,
    enabled: isEnabled,
  });

  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState("");
  const debouncedLocal = useDebounce(localQuery, 300);

  const effectiveQuery = debouncedLocal || searchQuery;

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!effectiveQuery) return users;
    const q = effectiveQuery.toLowerCase();
    return users.filter((u) => {
      const name = `${u.name.firstname} ${u.name.lastname}`.toLowerCase();
      const username = u.username.toLowerCase();
      const email = u.email.toLowerCase();
      const city = (u.address?.city || "").toLowerCase();
      return (
        name.includes(q) ||
        username.includes(q) ||
        email.includes(q) ||
        city.includes(q)
      );
    });
  }, [users, effectiveQuery]);

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
      title="Users"
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
            placeholder="Search users..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2 p-4">
          {paginated.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-8">
              No users found
            </div>
          )}
          {paginated.map((u) => (
            <Link href={`/user/${u.id}`} key={u.id} className="block group">
              <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary">
                    {u.name.firstname} {u.name.lastname}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {u.username}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {u.email}
                    </span>
                    {u.address?.city && (
                      <span className="text-xs text-muted-foreground">
                        City {u.address.city}
                      </span>
                    )}
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
