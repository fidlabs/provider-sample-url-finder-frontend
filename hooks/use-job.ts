import { QueryKey, URL_FINDER_API_URL } from "@/definitions/constants";
import { URLFinderAPIJobResponse } from "@/definitions/types";
import {
  isPlainObject,
  isURLFinderResultCode,
  parseURLFinderAPIResponseOrThrow,
} from "@/lib/utils";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

type UseJobQueryKey = [QueryKey.GET_JOB, string];

export function useJob(jobId: string) {
  const search = useCallback<
    QueryFunction<URLFinderAPIJobResponse, UseJobQueryKey>
  >(async ({ queryKey }) => {
    const [, jobId] = queryKey;
    if (!URL_FINDER_API_URL) {
      throw new Error("Finder API URL is not defined");
    }

    const response = await fetch(`${URL_FINDER_API_URL}/jobs/${jobId}`);
    const json = await parseURLFinderAPIResponseOrThrow(response);
    assertIsJobResponse(json);

    return json;
  }, []);

  return useQuery({
    queryFn: search,
    queryKey: [QueryKey.GET_JOB, jobId],
    refetchOnMount(query) {
      return query.state.data?.status === "Pending";
    },
    refetchOnWindowFocus(query) {
      return query.state.data?.status === "Pending";
    },
    refetchInterval(query) {
      return query.state.data?.status === "Pending" ? 5000 : false;
    },
    retryOnMount: false,
    retry: false,
  });
}

function isJobResponse(input: unknown): input is URLFinderAPIJobResponse {
  if (!isPlainObject(input)) {
    return false;
  }

  return (
    (input.client === null || typeof input.client === "string") &&
    typeof input.created_at === "string" &&
    (input.error == null || typeof input.error === "string") &&
    typeof input.id === "string" &&
    typeof input.provider === "string" &&
    (input.result == null || isURLFinderResultCode(input.result)) &&
    (input.retrievability === null ||
      typeof input.retrievability === "number") &&
    typeof input.status === "string" &&
    ["Pending", "Completed", "Failed"].includes(input.status) &&
    typeof input.updated_at === "string" &&
    (input.working_url === null || typeof input.working_url === "string")
  );
}

function assertIsJobResponse(
  input: unknown
): asserts input is URLFinderAPIJobResponse {
  if (!isJobResponse(input)) {
    throw new TypeError(
      "Invalid response from URL Finder API. Returned job response does not match expected schema."
    );
  }
}
