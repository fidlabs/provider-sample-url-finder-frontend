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
                  {!!jobResult.provider && (
                    <Button className="text-lg" variant="link" asChild>
                      <Link
                        href={`${ADDRESS_EXPLORER_URL}/${jobResult.provider}`}
                        target="_blank"
                      >
                        Provider: {jobResult.provider}
                      </Link>
                    </Button>
                  )}
                  {!!jobResult.provider && !!jobResult.client && 
                    <SlashIcon size={12} />
                  }

                  {!!jobResult.client && (
                    <Button className="text-lg" variant="link" asChild>
                      <Link
                        href={`${ADDRESS_EXPLORER_URL}/${jobResult.client}`}
                        target="_blank"
                      >
                        Client: {jobResult.client}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <JobStatusLabel status={jobResult.status} />
            </CardTitle>
            <CardDescription>Job ID: {jobId}</CardDescription>
          </CardHeader>
          {!!jobResult.results && jobResult.results.length > 0 && (
            <CardContent className="grid gap-4">
              {jobResult.results.map((result, index) => (
                <div key={index} className="p-3 border rounded-md">
                  {(jobResult.provider == null &&
                    // for client only jobs, show provider for each result
                    <Button className="text-lg" variant="link" asChild>
                      <Link
                        href={`${ADDRESS_EXPLORER_URL}/${result.provider}`}
                        target="_blank"
                      >
                        Provider: {result.provider}
                      </Link>
                    </Button>
                  )}
                  <div>
                    <p>
                      <span className="font-semibold">URL:</span>{" "}
                      {result?.working_url ? (
                        <Link
                          className="text-link underline"
                          href={result.working_url}
                          target="_blank"
                        >
                          {result.working_url}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>

                  {typeof result?.retrievability !== "undefined" && (
                    <div className="mt-1">
                      <p>
                        <span className="font-semibold">Retrievability:</span>{" "}
                        {typeof result.retrievability === "number"
                          ? result.retrievability + "%"
                          : "-"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          )}
        </>
      )}
    </Card>
  );
}
