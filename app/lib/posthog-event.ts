/**
 * Shared PostHog event utilities for Nimbus project
 */

const NIMBUS_PREFIX = "[NIMBUS]__";

/**
 * Prefix an event name with [NIMBUS]__ if not already prefixed.
 * Prevents double-prefixing.
 */
export function prefixNimbusEvent(eventName: string): string {
  if (eventName.startsWith(NIMBUS_PREFIX)) {
    return eventName;
  }
  return `${NIMBUS_PREFIX}${eventName}`;
}
