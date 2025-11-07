import { NextResponse } from "next/server";
import deploymentsData from "@/fixtures/deployments.json";
import acmeDeployment from "@/fixtures/acme.deployment.json";
import acmeLogs from "@/fixtures/acme.logs.json";
import acmeSchema from "@/fixtures/acme.schema.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id === "acme") {
    // Aggregate all acme fixtures
    return NextResponse.json({
      ...acmeDeployment,
      logs: acmeLogs,
      schema: acmeSchema,
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

