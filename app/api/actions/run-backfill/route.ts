import { NextResponse } from "next/server";
import { JobStore } from "@/lib/JobStore";

export async function POST(request: Request) {
  const body = await request.json();
  const { deploymentId, count } = body;

  const job = JobStore.create("backfill", deploymentId, {
    count: count || 100,
    processed: 0,
  });

  return NextResponse.json({
    jobId: job.id,
    status: job.status,
  });
}

