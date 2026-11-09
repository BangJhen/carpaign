import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

export const GET = async (req: NextRequest) => {
  try {
    return await handlers.GET(req);
  } catch (err: any) {
    console.error("Better-Auth GET Error:", err);
    return NextResponse.json({ error: err?.message || "Auth GET error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    return await handlers.POST(req);
  } catch (err: any) {
    console.error("Better-Auth POST Error:", err);
    return NextResponse.json(
      {
        error: err?.message || "Auth POST error",
        detail: process.env.NODE_ENV !== "production" ? err?.stack : undefined,
      },
      { status: 500 }
    );
  }
};
