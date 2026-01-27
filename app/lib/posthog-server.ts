import { PostHog } from 'posthog-node';
import { prefixNimbusEvent } from './posthog-event';

let posthogClient: PostHog | null = null;

function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_KEY!,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0
      }
    );
  }
  return posthogClient;
}

/**
 * Capture an event with automatic [NIMBUS]__ prefixing
 */
export function capture(options: {
  distinctId: string;
  event: string;
  properties?: Record<string, any>;
  groups?: Record<string, string>;
  sendFeatureFlags?: boolean;
  timestamp?: Date;
}): void {
  const client = getPostHogClient();
  const prefixedEvent = prefixNimbusEvent(options.event);
  client.capture({
    ...options,
    event: prefixedEvent,
  });
}

/**
 * Identify a user
 */
export function identify(options: {
  distinctId: string;
  properties?: Record<string, any>;
}): void {
  const client = getPostHogClient();
  client.identify(options);
}

/**
 * Shutdown PostHog client
 */
export async function shutdown() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}

/**
 * Access the underlying PostHog client for advanced usage
 * Use sparingly - prefer the facade methods
 */
export function getPostHogInstance() {
  return getPostHogClient();
}
