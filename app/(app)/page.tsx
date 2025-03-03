"use client";

import { JobResults } from "@/components/job-results";
import { SearchStatusLabel } from "@/components/search-status-label";
import { useSearchHistory } from "@/hooks/use-search-history";
import { isFilecoinAddress } from "@/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@fidlabs/common-react-ui";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  provider: string;
  client?: string;
}

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>();
  const {
    data: searchResult,
    error: searchError,
    reset: resetSearch,
    history: jobs,
    clear: clearHistory,
    search,
  } = useSearchHistory();
  const formEnabled = !searchResult && !searchError;

  const reset = useCallback(() => {
    resetForm();
    resetSearch();
  }, [resetForm, resetSearch]);

  const onSubmit = handleSubmit(async ({ provider, client }) => {
    if (!isFilecoinAddress(provider)) {
      return;
    }

    const response = await search({
      provider,
      client: isFilecoinAddress(client) ? client : undefined,
    });

    if (response.result === "JobCreated") {
      reset();
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto">
      <form onSubmit={onSubmit}>
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>URL Search</CardTitle>
            <CardDescription>
              Enter the Storage Provider and Client ID to find the nearest
              working URL.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="provider-input">
                Storage Provider Address (SP)
              </Label>
              <Input
                id="provider-input"
                placeholder="Enter SP address..."
                disabled={!formEnabled}
                {...register("provider", {
                  validate: isFilecoinAddress,
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-input">Client ID (optional)</Label>
              <Input
                id="client-input"
                placeholder="Enter Client ID..."
                disabled={!formEnabled}
                {...register("client", {
                  required: false,
                  validate: (value) => value === "" || isFilecoinAddress(value),
                })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            {!!searchResult && searchResult.result !== "JobCreated" && (
              <>
                <div className="flex flex-col items-center text-center gap-0.5 mb-4">
                  <p>Search returned with status:</p>
                  <SearchStatusLabel result={searchResult.result} />
                </div>
                <Button className="w-full" onClick={reset}>
                  Reset
                </Button>
              </>
            )}

            {!isSubmitting && !!searchError && (
              <>
                <div className="flex flex-col items-center text-center gap-0.5 mb-4">
                  <p>Search returned with error:</p>
                  <p className="text-sm text-muted-foreground">
                    {searchError.message}
                  </p>
                </div>
                <Button className="w-full" onClick={reset}>
                  Try Again
                </Button>
              </>
            )}

            {formEnabled && (
              <Button
                className="w-full"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Find URL
                {isSubmitting && <Loader2 className="animate-spin" />}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>

      <div>
        {isClient && (
          <>
            <div className="flex items-center justify-between gap-2 mb-6">
              <h3 className="text-xl font-semibold">Search Results</h3>
              <Button disabled={jobs.length === 0} onClick={clearHistory}>
                Clear Results
              </Button>
            </div>

            {jobs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing to show. Use the search form above and check the results
                here later.
              </p>
            )}

            <JobResults items={jobs} />
          </>
        )}
      </div>
    </div>
  );
}
