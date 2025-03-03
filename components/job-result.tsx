import { ADDRESS_EXPLORER_URL } from "@/definitions/constants";
import { useJob } from "@/hooks/use-job";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fidlabs/common-react-ui";
import { Loader2, SlashIcon } from "lucide-react";
import Link from "next/link";
import { JobStatusLabel } from "./job-status-label";

export interface SearchResultProps {
  jobId: string;
}

export function JobResult({ jobId }: SearchResultProps) {
  const { data: jobResult, isError, isFetching } = useJob(jobId);

  return (
    <Card>
      {!jobResult && isFetching && (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {!jobResult && !isFetching && isError && (
        <div className="flex items-center justify-center p-6">
          <p className="text-sm text-center text-muted-foreground">
            Error loading job {jobId}
          </p>
        </div>
      )}

      {!!jobResult && (
        <>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Button className="text-lg" variant="link" asChild>
                    <Link
                      href={`${ADDRESS_EXPLORER_URL}/${jobResult.provider}`}
                      target="_blank"
                    >
                      Provider: {jobResult.provider}
                    </Link>
                  </Button>

                  {!!jobResult.client && (
                    <>
                      <SlashIcon size={12} />
                      <Button className="text-lg" variant="link" asChild>
                        <Link
                          href={`${ADDRESS_EXPLORER_URL}/${jobResult.client}`}
                          target="_blank"
                        >
                          Client: {jobResult.client}
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <JobStatusLabel status={jobResult.status} />
            </CardTitle>
            <CardDescription>Job ID: {jobId}</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div>
              <p>
                <span className="font-semibold">URL:</span>{" "}
                {jobResult?.working_url ? (
                  <Link
                    className="text-link underline"
                    href={jobResult.working_url}
                    target="_blank"
                  >
                    {jobResult.working_url}
                  </Link>
                ) : (
                  "-"
                )}
              </p>
            </div>

            {typeof jobResult?.retrievability !== "undefined" && (
              <div>
                <p>
                  <span className="font-semibold">Retrievability:</span>{" "}
                  {typeof jobResult?.retrievability === "number"
                    ? jobResult.retrievability + "%"
                    : "-"}
                </p>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
