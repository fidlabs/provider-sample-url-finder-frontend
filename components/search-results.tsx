"use client";

import { SearchQuery } from "@/definitions/types";
import { SearchResult } from "./search-result";

export interface SearchResultsProps {
  items: SearchQuery[];
}

export function SearchResults({ items }: SearchResultsProps) {
  return (
    <div className="grid gap-6">
      {items.map((query) => (
        <SearchResult
          key={`${query.provider}-${query.client ?? ""}`}
          query={query}
        />
      ))}
    </div>
  );
}
