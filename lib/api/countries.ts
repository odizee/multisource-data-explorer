import { Country } from "@/types";
import { fetchJson } from "./utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_COUNTRIES_API_URL || "https://restcountries.com/v3.1";

export const countriesApi = {
  getAll: async (): Promise<Country[]> => {
    // Request only the fields we actually render to reduce payload and satisfy APIs requiring 'fields'
    const fields = [
      "name",
      "cca3",
      "capital",
      "region",
      "population",
      "flags",
      "languages",
      "currencies",
    ].join(",");
    return fetchJson<Country[]>(
      `${BASE_URL}/all?fields=${encodeURIComponent(fields)}`
    );
  },
};
