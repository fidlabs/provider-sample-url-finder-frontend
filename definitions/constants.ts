import packageMetadata from "../package.json";

export const APP_VERSION = packageMetadata.version;
export const URL_FINDER_API_URL = process.env.NEXT_PUBLIC_URL_FINDER_API_URL;
export const ADDRESS_EXPLORER_URL = "https://filfox.info/en/address";

export enum QueryKey {
  SEARCH = "search",
  GET_JOB = "get_job",
}

export enum MutationKey {
  SEARCH = "search",
}
