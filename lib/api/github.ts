import { GithubRepo } from "@/types";
import { fetchJson } from "./utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_GITHUB_API_URL || "https://api.github.com";

interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
}

export const githubApi = {
  searchRepos: async (
    query: string,
    page = 1,
    perPage = 30
  ): Promise<GithubSearchResponse> => {
    const q = query || "react";
    return fetchJson<GithubSearchResponse>(
      `${BASE_URL}/search/repositories?q=${encodeURIComponent(
        q
      )}&page=${page}&per_page=${perPage}`
    );
  },

  getRepo: async (owner: string, name: string): Promise<GithubRepo> => {
    return fetchJson<GithubRepo>(`${BASE_URL}/repos/${owner}/${name}`);
  },
};
