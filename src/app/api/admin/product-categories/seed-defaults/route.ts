import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "The demo catalogue seed is retired. Import the canonical workbook catalogue instead.",
    },
    { status: 410 }
  );
}
