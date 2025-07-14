import { QueryKey, URL_FINDER_API_URL } from "@/definitions/constants";
import {
  SearchResult,
  URLFinderAPIRetrieviabilityResponse,
  URLFinderAPIURLResponse,
} from "@/definitions/types";
import {
  isFilecoinAddress,
  isPlainObject,
  isURLFinderResultCode,
  parseURLFinderAPIResponseOrThrow,
} from "@/lib/utils";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface SearchInput {
  provider?: string | null;
  client?: string | null;
}

type URLSearchQueryKey = [QueryKey.SEARCH, string | null | undefined, string | null | undefined];

export function useURLSearch(input: SearchInput) {
  const search = useCallback<QueryFunction<SearchResult, URLSearchQueryKey>>(
    async ({ queryKey }): Promise<SearchResult> => {
      const [, provider, client] = queryKey;
      if (!URL_FINDER_API_URL) {
        throw new Error("Finder API URL is not defined");
      }

      if (!isFilecoinAddress(provider)) {
        throw new Error("Invalid input");
      }

      const clientIdProvided = isFilecoinAddress(client);

      let urlEndpoint = `${URL_FINDER_API_URL}/url/find/${provider}`;

      if (clientIdProvided) {
        urlEndpoint += `/${client}`;
      }

      const [urlResult, retrievabilityResult] = await Promise.all([
        fetch(urlEndpoint).then(parseURLFinderAPIResponseOrThrow),
        clientIdProvided
          ? fetch(
              `${URL_FINDER_API_URL}/url/retrievability/${provider}/${client}`
            ).then(parseURLFinderAPIResponseOrThrow)
          : Promise.resolve(null),
      ]);

      if (
        !isURLResponse(urlResult) ||
        (retrievabilityResult !== null &&
          !isRetrievabilityResponse(retrievabilityResult))
      ) {
        throw new Error("Invalid URL Finder API response");
      }

      return {
        url: urlResult,
        retrievability: retrievabilityResult ?? null,
      };
    },
    []
  );

  return useQuery({
    queryFn: search,
    queryKey: [QueryKey.SEARCH, input.provider, input.client],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
  });
}

function isURLResponse(input: unknown): input is URLFinderAPIURLResponse {
  if (!isPlainObject(input) || !isURLFinderResultCode(input.result)) {
    return false;
  }

  return typeof input.url === "string" || input.url == null;
}

function isRetrievabilityResponse(
  input: unknown
): input is URLFinderAPIRetrieviabilityResponse {
  return (
    isPlainObject(input) &&
    isURLFinderResultCode(input.result) &&
    typeof input.retrievability_percent === "number"
  );
}
