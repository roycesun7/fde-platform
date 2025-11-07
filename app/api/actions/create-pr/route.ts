import { NextResponse } from "next/server";
import { JobStore } from "@/lib/JobStore";

export async function POST(request: Request) {
  const body = await request.json();
  const { deploymentId, diff } = body;

  // Create a job for PR creation
  const job = JobStore.create("create_pr", deploymentId, {
    diff,
    prNumber: Math.floor(Math.random() * 1000) + 100,
  });

  // Simulate PR creation
  const prNumber = job.meta.prNumber;
  const prUrl = `https://github.com/foundry/deployments/pull/${prNumber}`;

  return NextResponse.json({
    jobId: job.id,
    prNumber,
    url: prUrl,
    status: "created",
  });
}

