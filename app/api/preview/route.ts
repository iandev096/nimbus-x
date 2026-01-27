import { NextRequest } from "next/server";
import { redirectToPreviewURL } from "@prismicio/next";

import { createClient } from "../../../prismicio";
import { capture } from "../../lib/posthog-server";

export async function GET(request: NextRequest) {
  const client = createClient();

  // Capture preview started event
  capture({
    distinctId: "anonymous",
    event: "preview_started",
    properties: {
      source: "api",
      url: request.url,
    },
  });

  return await redirectToPreviewURL({ client, request });
}
