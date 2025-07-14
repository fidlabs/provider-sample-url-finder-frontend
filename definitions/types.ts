export type FilecoinAddress = `${"f0" | "f1" | "f2" | "f3" | "f4"}${string}`;

export enum URLFinderResultCode {
  NoCidContactData = "NoCidContactData",
  MissingAddrFromCidContact = "MissingAddrFromCidContact",
  MissingHttpAddrFromCidContact = "MissingHttpAddrFromCidContact",
  FailedToGetWorkingUrl = "FailedToGetWorkingUrl",
  NoDealsFound = "NoDealsFound",
  TimedOut = "TimedOut",
  Success = "Success",
}

export interface URLFinderAPIURLResponse {
  result: URLFinderResultCode;
  url?: string | null;
}

export interface URLFinderAPIRetrieviabilityResponse {
  result: URLFinderResultCode;
  retrievability_percent: number;
}

export interface URLFinderAPIErrorResponse {
  error: string;
}

export interface URLFinderAPICreateJobResponse {
  id?: string | null;
  result: "JobCreated" | URLFinderResultCode;
}

export interface URLFinderAPIJobResultResponse {
  provider: string;
  client: string | null;
  working_url: string | null;
  retrievability: number;
  result: URLFinderResultCode;
  error?: string | null;
}

export interface URLFinderAPIJobResponse {
  id: string;
  client: string | null;
  provider: string | null;
  status: "Pending" | "Completed" | "Failed";
  error?: string | null;
  results: URLFinderAPIJobResultResponse[];
  created_at: string;
  updated_at: string;
}

export interface SearchQuery {
  provider?: FilecoinAddress;
  client?: FilecoinAddress;
}

export interface SearchResult {
  url: URLFinderAPIURLResponse;
  retrievability: URLFinderAPIRetrieviabilityResponse | null;
}
