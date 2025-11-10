import { NextResponse } from "next/server";
import deploymentsData from "@/fixtures/deployments.json";
import dropboxDeployment from "@/fixtures/dropbox.deployment.json";
import dropboxLogs from "@/fixtures/dropbox.logs.json";
import dropboxSchema from "@/fixtures/dropbox.schema.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id === "dropbox") {
    // Aggregate all dropbox fixtures
    return NextResponse.json({
      ...dropboxDeployment,
      logs: dropboxLogs,
      schema: dropboxSchema,
    });
  }

  // For other deployments, return basic info
  const deployment = deploymentsData.find((d) => d.id === id);
  
  if (!deployment) {
    return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...deployment,
    connectors: null,
    message: "Connectors not configured for this deployment",
  });
}

