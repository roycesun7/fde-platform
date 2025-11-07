import { NextResponse } from "next/server";
import { JobStore } from "@/lib/JobStore";

export async function POST() {
  const updated = JobStore.tick();
  return NextResponse.json({ updated });
}

