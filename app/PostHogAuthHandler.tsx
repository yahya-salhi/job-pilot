'use client'

import { useEffect, useRef } from "react"
import { usePostHog } from "posthog-js/react"
import { insforge } from "@/lib/insforge-client"

export default function PostHogAuthHandler() {
  const posthog = usePostHog()
  const lastUserId = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function hydrateAuth() {
      try {
        const { data } = await insforge.auth.getCurrentUser()
        if (cancelled) return
        
        const user = data?.user
        if (user) {
          if (user.id !== lastUserId.current) {
            posthog.identify(user.id, {
              email: user.email,
              name: user.profile?.name || user.email,
            })
            lastUserId.current = user.id
          }
        } else {
          if (lastUserId.current) {
            posthog.reset()
            lastUserId.current = null
          }
        }
      } catch (err) {
        console.error("[PostHogAuthHandler] Auth hydration failed", err)
      }
    }

    hydrateAuth()
    
    // Check periodically for session changes (e.g. login/logout in other tabs)
    const interval = setInterval(hydrateAuth, 10000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [posthog])

  return null
}
