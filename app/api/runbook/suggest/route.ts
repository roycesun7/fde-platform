import { NextResponse } from "next/server";
import { LLMService } from "@/lib/LLMService";
import dropboxDeployment from "@/fixtures/dropbox.deployment.json";
import dropboxLogs from "@/fixtures/dropbox.logs.json";
import dropboxSchema from "@/fixtures/dropbox.schema.json";

export async function POST(request: Request) {
  const body = await request.json();
  const { deploymentId, goal } = body;

  // For demo, we only have detailed data for dropbox
  if (deploymentId !== "dropbox") {
    return NextResponse.json(
      { error: "Runbook generation only available for Dropbox deployment" },
      { status: 400 }
    );
  }

  const spec = {
    ...dropboxDeployment,
    schema: dropboxSchema,
  };

  const plan = await LLMService.suggestRunbook({
    spec,
    logs: dropboxLogs,
    goal,
  });

  return NextResponse.json({
    ...plan,
    mode: LLMService.getMode(),
  });
}

