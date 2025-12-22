import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { GithubRepo } from "@/types";
import { githubApi } from "@/lib/api/github";
import { useDataFetcher } from "@/hooks/useDataFetcher";
import { DataSection } from "./DataSection";
import { PaginationControls } from "./PaginationControls";
import { Badge } from "@/components/ui/badge";
import { GitFork, Star, CircleDot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "./useDebounce";

const ITEMS_PER_PAGE = 5;

export function RepoList({
  searchQuery,
  isEnabled,
  onToggle,
}: {
  searchQuery: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const [page, setPage] = useState(1);
  const [localQuery, setLocalQuery] = useState("");
  const debouncedLocal = useDebounce(localQuery, 300);
  const effectiveQuery = debouncedLocal || searchQuery;

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [effectiveQuery]);

  const fetchRepos = useCallback(async () => {
    // API uses 1-based indexing
    return githubApi.searchRepos(effectiveQuery, page, ITEMS_PER_PAGE);
  }, [effectiveQuery, page]);

  const { data, loading, error, refetch } = useDataFetcher({
    fetcher: fetchRepos,
    enabled: isEnabled,
  });

  const repos = data?.items || [];
  const totalCount = data?.total_count || 0;
  // GitHub API limits results to first 1000, so cap pages
  const totalPages = Math.min(
    Math.ceil(totalCount / ITEMS_PER_PAGE),
    1000 / ITEMS_PER_PAGE
  );

  return (
    <DataSection
      title="Repositories"
      count={totalCount}
      isLoading={loading}
      error={error}
      isEnabled={isEnabled}
      onToggle={onToggle}
      onRetry={refetch}
    >
      <div className="flex flex-col min-h-[400px]">
        <div className="p-4 border-b">
          <Input
            placeholder="Search repositories..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2 p-4">
          {repos.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-8">
              No repositories found
            </div>
          )}
          {repos.map((repo) => (
            <Link
              href={`/repo/${repo.owner.login}/${repo.name}`}
              key={repo.id}
              className="block group"
            >
              <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary flex items-center gap-2">
                    {repo.full_name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {repo.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stargazers_count.toLocaleString()}
                    </div>
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <CircleDot className="h-3 w-3" />
                        {repo.language}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {repo.forks_count.toLocaleString()}
                    </div>
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
