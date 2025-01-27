import { Providers } from "@/components/providers";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { version } from "../../package.json";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <header className="container mx-auto py-3 flex justify-between items-center gap-6 mb-12">
        <h1 className="text-xl font-semibold">
          <Link className="hover:underline" href="/">
            URL Finder
          </Link>
          <sup className="text-sm font-normal text-muted-foreground">BETA</sup>
        </h1>
      </header>
      <main className="pb-24 flex-1">{children}</main>
      <footer className="container mx-auto p-3">
        <p className="text-center text-muted-foreground text-sm">
          Version v{version}
        </p>
      </footer>
    </Providers>
  );
}
