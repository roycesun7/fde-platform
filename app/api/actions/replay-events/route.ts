import { NextResponse } from "next/server";
import { JobStore } from "@/lib/JobStore";

export async function POST(request: Request) {
  const body = await request.json();
  const { deploymentId, count } = body;

  const job = JobStore.create("replay_events", deploymentId, {
    count: count || 20,
    replayed: 0,
  });

  return NextResponse.json({
    jobId: job.id,
    status: job.status,
  });
}

