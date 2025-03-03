"use client";

import { JobResult } from "./job-result";

export interface JobResultsProps {
  items: string[];
}

export function JobResults({ items }: JobResultsProps) {
  return (
    <div className="grid gap-6">
      {items.map((jobId) => (
        <JobResult key={jobId} jobId={jobId} />
      ))}
    </div>
  );
}
