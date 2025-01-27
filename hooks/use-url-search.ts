import { QueryKey, URL_FINDER_API_URL } from "@/definitions/constants";
import {
  SearchResult,
  URLFinderAPIErrorResponse,
  URLFinderAPIRetrieviabilityResponse,
  URLFinderAPIURLResponse,
  URLFinderResultCode,
} from "@/definitions/types";
import { isFilecoinAddress, isPlainObject } from "@/lib/utils";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface SearchInput {
  provider: string;
  client?: string | null;
}

type URLSearchQueryKey = [QueryKey.SEARCH, string, string | null | undefined];

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
        fetch(urlEndpoint).then(parseResponseOrThrow),
        clientIdProvided
          ? fetch(
              `${URL_FINDER_API_URL}/url/retrievability/${provider}/${client}`
            ).then(parseResponseOrThrow)
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

async function parseResponseOrThrow(response: Response): Promise<unknown> {
  try {
    const result = await response.json();

    if (!response.ok) {
      const errorMessage = isErrorResponse(result)
        ? result.error
        : "An unknown error has occured";

      throw new Error(errorMessage);
    }

    return result;
  } catch {
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    throw new Error("Invalid Finder API response");
  }
}

function isValidResultCode(input: unknown): input is URLFinderResultCode {
  return (
    typeof input === "string" &&
    Object.values<string>(URLFinderResultCode).includes(input)
  );
}

function isURLResponse(input: unknown): input is URLFinderAPIURLResponse {
  if (!isPlainObject(input) || !isValidResultCode(input.result)) {
    return false;
  }

  return typeof input.url === "string" || input.url == null;
}

function isRetrievabilityResponse(
  input: unknown
): input is URLFinderAPIRetrieviabilityResponse {
  return (
    isPlainObject(input) &&
    isValidResultCode(input.result) &&
    typeof input.retrievability_percent === "number"
  );
}

function isErrorResponse(input: unknown): input is URLFinderAPIErrorResponse {
  return isPlainObject(input) && typeof input.error === "string";
}
