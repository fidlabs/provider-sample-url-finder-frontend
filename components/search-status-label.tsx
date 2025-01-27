import { URLFinderResultCode } from "@/definitions/types";
import { cn } from "@fidlabs/common-react-ui";
import type { HTMLAttributes } from "react";

export interface SearchStatusLabelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  isError?: boolean;
  result?: URLFinderResultCode;
}

export function SearchStatusLabel({
  className,
  isError,
  result,
  ...rest
}: SearchStatusLabelProps) {
  return (
    <div {...rest} className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("w-2 h-2 rounded-full bg-yellow-400", {
          ["bg-red-500"]: isError,
          ["bg-green-500"]: result === URLFinderResultCode.Success,
        })}
      />
      <p className="text-sm text-muted-foreground">
        {isError
          ? "Error loading data"
          : result
            ? resultCodeToReadableText(result)
            : "-"}
      </p>
    </div>
  );
}

function resultCodeToReadableText(result: URLFinderResultCode): string {
  switch (result) {
    case URLFinderResultCode.FailedToGetWorkingUrl:
      return "None of tested URLs is working and can be downloaded";
    case URLFinderResultCode.MissingAddrFromCidContact:
      return "No entry point found in cid contact";
    case URLFinderResultCode.MissingHttpAddrFromCidContact:
      return "No HTTP entry point in cid contact";
    case URLFinderResultCode.NoCidContactData:
      return "No entry in cid contact";
    case URLFinderResultCode.NoDealsFound:
      return "No deals found for given miner";
    case URLFinderResultCode.Success:
      return "Success";
    case URLFinderResultCode.TimedOut:
      return "Searching for working URL is took too long";
  }
}
