'use client'

import { useMentorshipSocket } from '@/lib/hooks/useMentorshipSocket'

/**
 * Global listener for mentorship socket events.
 * Mount this in the authenticated layout.
 */
export function MentorshipSocketListener() {
    useMentorshipSocket()
    return null
}
