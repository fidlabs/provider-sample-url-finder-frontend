import { SearchQuery } from "@/definitions/types";
import { isFilecoinAddress, isPlainObject } from "@/lib/utils";
import { useStoredState } from "./use-stored-state";

const defaultValue = JSON.stringify([]);
const historyLength = 5;

export function useSearchHistory(): [
  SearchQuery[],
  (searchQuery: SearchQuery) => void,
] {
  const [storedValue, setStoredValue] = useStoredState(
    "search-history",
    defaultValue
  );
  const storedJSON = JSON.parse(storedValue);
  const history = Array.isArray(storedJSON) ? sanitize(storedJSON) : [];

  const search = (searchItem: SearchQuery) => {
    const nextHistory = sanitize([searchItem, ...history]);
    setStoredValue(JSON.stringify(nextHistory));
  };

  return [history, search];
}

function isSearchQuery(input: unknown): input is SearchQuery {
  if (!isPlainObject(input)) {
    return false;
  }

  if (!isFilecoinAddress(input.provider)) {
    return false;
  }

  return typeof input.client === "undefined" || isFilecoinAddress(input.client);
}

function sanitize(history: unknown[]): SearchQuery[] {
  return history
    .filter(isSearchQuery)
    .filter((item, index, queries) => {
      const hash = hashQuery(item);
      return queries.findIndex((query) => hashQuery(query) === hash) === index;
    }, [])
    .slice(0, historyLength);
}

function hashQuery(query: SearchQuery): string {
  return query.provider + "-" + (query.client ?? "");
}
