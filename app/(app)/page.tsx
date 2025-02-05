"use client";

import { SearchResults } from "@/components/search-results";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  provider: string;
  client?: string;
}

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [queries, search] = useSearchHistory();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(({ provider, client }) => {
    if (!isFilecoinAddress(provider)) {
      return;
    }

    search({
      provider,
      client: isFilecoinAddress(client) ? client : undefined,
    });

    reset();
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
                {...register("client", {
                  required: false,
                  validate: (value) => value === "" || isFilecoinAddress(value),
                })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={!isValid} type="submit">
              Find URL
            </Button>
          </CardFooter>
        </Card>
      </form>

      {isClient && <SearchResults items={queries} />}
    </div>
  );
}
