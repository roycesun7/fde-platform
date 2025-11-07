import { NextResponse } from "next/server";
import { LLMService } from "@/lib/LLMService";
import acmeDeployment from "@/fixtures/acme.deployment.json";
import acmeLogs from "@/fixtures/acme.logs.json";
import acmeSchema from "@/fixtures/acme.schema.json";

export async function POST(request: Request) {
  const body = await request.json();
  const { deploymentId, goal } = body;

  // For demo, we only have detailed data for acme
  if (deploymentId !== "acme") {
    return NextResponse.json(
      { error: "Runbook generation only available for Acme deployment" },
      { status: 400 }
    );
  }

  const spec = {
    ...acmeDeployment,
    schema: acmeSchema,
  };

  const plan = await LLMService.suggestRunbook({
    spec,
    logs: acmeLogs,
    goal,
  });

  return NextResponse.json({
    ...plan,
    mode: LLMService.getMode(),
  });
}

