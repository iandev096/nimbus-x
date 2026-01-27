import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { capture } from "../../lib/posthog-server";

export async function POST() {
  revalidateTag("prismic", "max");

  // Capture content revalidated event
  capture({
    distinctId: "system",
    event: "content_revalidated",
    properties: {
      source: "api",
      tag: "prismic",
      timestamp: Date.now(),
    },
  });

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
