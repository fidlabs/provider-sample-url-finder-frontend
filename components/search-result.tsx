import { ADDRESS_EXPLORER_URL } from "@/definitions/constants";
import { SearchQuery } from "@/definitions/types";
import { useURLSearch } from "@/hooks/use-url-search";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@fidlabs/common-react-ui";
import { Loader2, RefreshCwIcon, SlashIcon } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { SearchStatusLabel } from "./search-status-label";

export interface SearchResultProps {
  query: SearchQuery;
}

export function SearchResult({ query }: SearchResultProps) {
  const {
    data: searchResult,
    isError,
    isFetching,
    refetch,
  } = useURLSearch(query);

  const handleRefreshButtonClick = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button className="text-lg" variant="link" asChild>
              <Link
                href={`${ADDRESS_EXPLORER_URL}/${query.provider}`}
                target="_blank"
              >
                Provider: {query.provider}
              </Link>
            </Button>
            {!!query.client && (
              <>
                <SlashIcon size={12} />
                <Button className="text-lg" variant="link" asChild>
                  <Link
                    href={`${ADDRESS_EXPLORER_URL}/${query.client}`}
                    target="_blank"
                  >
                    Client: {query.client}
                  </Link>
                </Button>
              </>
            )}
          </div>

          <Button
            disabled={isFetching}
            variant="ghost"
            size="icon"
            onClick={handleRefreshButtonClick}
          >
            {isFetching ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RefreshCwIcon />
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div>
          <p>
            <span className="font-semibold">URL:</span>{" "}
            {searchResult?.url?.url ? (
              <Link
                className="text-link underline"
                href={searchResult.url.url}
                target="_blank"
              >
                {searchResult?.url?.url}
              </Link>
            ) : (
              "-"
            )}
          </p>
          <SearchStatusLabel
            result={searchResult?.url.result}
            isError={isError}
          />
        </div>

        {!!searchResult?.retrievability && (
          <div>
            <p>
              <span className="font-semibold">Retrievability:</span>{" "}
              {searchResult?.retrievability
                ? searchResult.retrievability.retrievability_percent + "%"
                : "-"}
            </p>
            <SearchStatusLabel
              result={searchResult?.retrievability?.result}
              isError={isError}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
