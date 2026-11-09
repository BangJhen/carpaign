import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    hasBetterAuthUrl: !!process.env.BETTER_AUTH_URL,
    betterAuthUrlValue: process.env.BETTER_AUTH_URL || null,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || null,
  });
}
