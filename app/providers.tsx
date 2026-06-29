'use client'

import { PostHogProvider } from 'posthog-js/react'
import { ReactNode } from 'react'
// posthog-client initializes eagerly at module level — no useEffect needed here.
import { posthog } from '@/lib/posthog-client'

export function PHProvider({ children }: { children: ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
