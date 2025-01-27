import { FilecoinAddress } from "@/definitions/types";

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
