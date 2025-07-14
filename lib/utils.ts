import {
  FilecoinAddress,
  URLFinderAPIErrorResponse,
  URLFinderResultCode,
} from "@/definitions/types";

export function isPlainObject(
  input: unknown
): input is Record<string, unknown> {
  return !!input && typeof input === "object" && !Array.isArray(input);
}

export function isFilecoinAddress(input: unknown): input is FilecoinAddress {
  return (
    typeof input === "string" &&
    input.length >= 3 &&
    ["f0", "f1", "f2", "f3", "f4"].some((prefix) => {
      return input.startsWith(prefix);
    })
  );
}

export function isURLFinderResultCode(
  input: unknown
): input is URLFinderResultCode {
  return (
    typeof input === "string" &&
    Object.values<string>(URLFinderResultCode).includes(input)
  );
}

export function isURLFinderAPIErrorResponse(
  input: unknown
): input is URLFinderAPIErrorResponse {
  return isPlainObject(input) && typeof input.error === "string";
}

export async function parseURLFinderAPIResponseOrThrow(
  response: Response
): Promise<unknown> {
  try {
    const result = await response.json();
    console.log("Parsed result:", result);
    if (!response.ok) {
      const errorMessage = isURLFinderAPIErrorResponse(result)
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
