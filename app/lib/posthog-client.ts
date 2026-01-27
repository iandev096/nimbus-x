/**
 * Client-side PostHog facade for Nimbus project
 * Wraps posthog-js to provide prefixed event names and consistent API
 */

import posthog from "posthog-js";
import { prefixNimbusEvent } from "./posthog-event";

/**
 * Capture an event with automatic [NIMBUS]__ prefixing
 */
export function capture(
  eventName: string,
  properties?: Record<string, any>
): void {
  const prefixedEvent = prefixNimbusEvent(eventName);
  posthog.capture(prefixedEvent, properties);
}

/**
 * Identify a user
 */
export function identify(
  distinctId: string,
  properties?: Record<string, any>
): void {
  posthog.identify(distinctId, properties);
}

/**
 * Reset the user session
 */
export function reset(): void {
  posthog.reset();
}

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(
  key: string,
  options?: { send_event: boolean }
): boolean | undefined {
  return posthog.isFeatureEnabled(key, options);
}

/**
 * Get feature flag value
 */
export function getFeatureFlag(key: string): string | boolean | undefined {
  return posthog.getFeatureFlag(key);
}

/**
 * Access the underlying PostHog instance for advanced usage
 * Use sparingly - prefer the facade methods
 */
export function getPostHogInstance() {
  return posthog;
}
