import { NextResponse } from "next/server";
import type { OptimizationInput } from "@/lib/types";
import { loadGameDatabase } from "@/lib/data/loader";
import { optimizeParty } from "@/lib/optimizer/party-optimizer";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as OptimizationInput;
    const db = loadGameDatabase();
    const result = optimizeParty(input, db);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
