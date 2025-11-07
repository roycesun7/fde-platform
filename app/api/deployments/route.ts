import { NextResponse } from "next/server";
import deploymentsData from "@/fixtures/deployments.json";

export async function GET() {
  return NextResponse.json(deploymentsData);
}

