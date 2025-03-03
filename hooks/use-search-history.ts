import { MutationKey, URL_FINDER_API_URL } from "@/definitions/constants";
import {
  SearchQuery,
  URLFinderAPICreateJobResponse,
} from "@/definitions/types";
import {
  isPlainObject,
  isURLFinderResultCode,
  parseURLFinderAPIResponseOrThrow,
} from "@/lib/utils";
import { MutationFunction, useMutation } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import packageMetadata from "../package.json";
import { useStoredState } from "./use-stored-state";

interface UseSearchHistoryOptions {
  onSearchSuccess?(): void;
}

const defaultValue = JSON.stringify([]);
const historyLength = 5;

export function useSearchHistory(options?: UseSearchHistoryOptions) {
  const { onSearchSuccess } = options || {};
  const [storedValue, setStoredValue] = useStoredState(
    "search-history-v" + packageMetadata.version,
    defaultValue
  );

  const history = useMemo(() => {
    const storedJSON = JSON.parse(storedValue);
    return Array.isArray(storedJSON) ? sanitize(storedJSON) : [];
  }, [storedValue]);

  const mutationFn = useCallback<
    MutationFunction<URLFinderAPICreateJobResponse, SearchQuery>
  >(
    async (searchQuery) => {
      if (!URL_FINDER_API_URL) {
        throw new Error("Finder API URL is not defined");
      }

      const response = await fetch(`${URL_FINDER_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchQuery),
      });
      const json = await parseURLFinderAPIResponseOrThrow(response);
      assertIsCreateJobResponse(json);

      if (json.id) {
        const nextHistory = [json.id, ...history];
        setStoredValue(JSON.stringify(nextHistory));
      }

      return json;
    },
    [history, setStoredValue]
  );

  const { mutateAsync, ...restOfMutation } = useMutation({
    mutationFn,
    mutationKey: [MutationKey.SEARCH],
    onMutate: onSearchSuccess,
  });

  const clear = useCallback(() => {
    setStoredValue(JSON.stringify([]));
  }, [setStoredValue]);

  return {
    ...restOfMutation,
    history,
    search: mutateAsync,
    clear,
  };
}

function assertIsCreateJobResponse(
  input: unknown
): asserts input is URLFinderAPICreateJobResponse {
  const valid =
    isPlainObject(input) &&
    (input.result === "JobCreated" || isURLFinderResultCode(input.result)) &&
    (input.id == null || typeof input.id === "string");

  if (!valid) {
    throw new Error(
      "Invalid response from URL Finder API. Returned job creation response does not match expected schema."
    );
  }
}

function sanitize(history: unknown[]): string[] {
  return history
    .filter((item, index, queries): item is string => {
      return (
        typeof item === "string" &&
        queries.findIndex((comparedItem) => comparedItem === item) === index
      );
    }, [])
    .slice(0, historyLength);
}
