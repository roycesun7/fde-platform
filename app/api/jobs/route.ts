import { NextResponse } from "next/server";
import { JobStore } from "@/lib/JobStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const deploymentId = searchParams.get("deploymentId");

  const jobs = JobStore.list(deploymentId || undefined);

  // Sort by startedAt descending (newest first)
  jobs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return NextResponse.json(jobs);
}

