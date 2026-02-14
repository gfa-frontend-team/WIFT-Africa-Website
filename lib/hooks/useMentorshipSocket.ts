'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/lib/socket'
import { useAuth } from '@/lib/hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const useMentorshipSocket = () => {
    const { user } = useAuth()
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('accessToken'))
        }
    }, [user]) // Re-fetch token when user changes (login/logout)

    const socket = useSocket(token)
    const queryClient = useQueryClient()
    const router = useRouter()

    useEffect(() => {
        if (!socket || !user) return

        // Listen for accepted applications
        // Event: 'notification:new' is the standard channel
        // We check the type of notification
        const handleNotification = (notification: any) => {
            // console.log('Socket notification:', notification)

            if (notification.type === 'MENTORSHIP_APPLICATION_ACCEPTED') {
                toast.success(notification.message || 'Your mentorship application was accepted!', {
                    action: {
                        label: 'View',
                        onClick: () => router.push('/opportunities/mentorship/applications')
                    }
                })
                queryClient.invalidateQueries({ queryKey: ['my-applications'] })
                queryClient.invalidateQueries({ queryKey: ['mentorship', notification.entityId] }) // invalidate specific mentorship if needed
            }

            if (notification.type === 'MENTORSHIP_APPLICATION_REJECTED') {
                toast.info(notification.message || 'Your mentorship application was updated')
                queryClient.invalidateQueries({ queryKey: ['my-applications'] })
            }

            // For admins (if we implement admin side later)
            if (notification.type === 'MENTORSHIP_APPLICATION_CREATED' && user.accountType === 'CHAPTER_ADMIN') {
                // handle admin notification
                queryClient.invalidateQueries({ queryKey: ['mentorship-applications'] })
            }
        }

        socket.on('notification:new', handleNotification)

        // Also listen for specific mentorship events if backend emits them directly
        // socket.on('mentorship:updated', ...)

        return () => {
            socket.off('notification:new', handleNotification)
        }
    }, [socket, user, queryClient, router])
}
