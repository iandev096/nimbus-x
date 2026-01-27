# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 16 App Router project. The integration includes client-side event tracking using `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), server-side tracking using `posthog-node`, and a reverse proxy configuration to improve tracking reliability by routing requests through your domain.

## Summary of Changes

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization
- `app/lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables for PostHog configuration

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for PostHog ingestion
- `app/page.tsx` - Added CTA click event tracking
- `app/api/preview/route.ts` - Added preview session tracking
- `app/api/revalidate/route.ts` - Added content revalidation tracking

### Dependencies Added
- `posthog-js` - Client-side JavaScript SDK
- `posthog-node` - Server-side Node.js SDK

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `cta_clicked` | User clicked on a call-to-action button (Deploy Now or Documentation) | `app/page.tsx` |
| `preview_started` | User initiated a preview session via Prismic preview API | `app/api/preview/route.ts` |
| `content_revalidated` | Content was revalidated via the revalidation API endpoint | `app/api/revalidate/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/119820/dashboard/501212)

### Insights
- [CTA Clicks Over Time](https://eu.posthog.com/project/119820/insights/wqnP0jRN) - Tracks clicks on call-to-action buttons
- [CTA Clicks by Type](https://eu.posthog.com/project/119820/insights/IDir7ubu) - Breakdown of CTA clicks by button type
- [Preview Sessions](https://eu.posthog.com/project/119820/insights/Wo6IOrQC) - Tracks Prismic preview sessions
- [Content Revalidations](https://eu.posthog.com/project/119820/insights/aCpFFCb2) - Tracks content revalidation events
- [All Events Overview](https://eu.posthog.com/project/119820/insights/Ujz6vkHR) - Overview of all tracked events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
