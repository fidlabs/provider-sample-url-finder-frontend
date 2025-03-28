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

export interface URLFinderAPIJobResponse {
  client: string | null;
  created_at: string;
  error?: string | null;
  id: string;
  provider: string;
  retrievability: number | null;
  status: "Pending" | "Completed" | "Failed";
  updated_at: string;
  working_url: string | null;
}

export interface SearchQuery {
  provider: FilecoinAddress;
  client?: FilecoinAddress;
}

export interface SearchResult {
  url: URLFinderAPIURLResponse;
  retrievability: URLFinderAPIRetrieviabilityResponse | null;
}
