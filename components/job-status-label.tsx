import { URLFinderAPIJobResponse } from "@/definitions/types";
import { cn } from "@fidlabs/common-react-ui";
import type { HTMLAttributes } from "react";

type Status = URLFinderAPIJobResponse["status"];

export interface JobStatusLabelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  status: Status;
}

export function JobStatusLabel({
  className,
  status,
  ...rest
}: JobStatusLabelProps) {
  return (
    <div {...rest} className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("w-2 h-2 rounded-full bg-gray-400", {
          ["bg-red-500"]: status === "Failed",
          ["bg-green-500"]: status === "Completed",
          ["bg-yellow-400 animate-pulse"]: status === "Pending",
        })}
      />
      <p className="text-sm text-muted-foreground">
        {statusToReadableText(status)}
      </p>
    </div>
  );
}

function statusToReadableText(status: Status): string {
  switch (status) {
    case "Completed":
      return "Success";
    case "Failed":
      return "Error";
    case "Pending":
      return "Pending";
  }
}
