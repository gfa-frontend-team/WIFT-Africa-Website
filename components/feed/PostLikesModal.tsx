'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Avatar from '@/components/ui/Avatar'
import { usePostLikes } from '@/lib/hooks/usePostLikes'
import { Loader2 } from 'lucide-react'
import { getProfileUrl } from '@/lib/utils/routes'

interface PostLikesModalProps {
    isOpen: boolean
    onClose: () => void
    postId: string
}

export default function PostLikesModal({ isOpen, onClose, postId }: PostLikesModalProps) {
    const { t } = useTranslation()
    const { data, isLoading } = usePostLikes(postId, isOpen)

    const users = data?.users || []

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Likes</DialogTitle>
                </DialogHeader>

                <div className="h-[300px] pr-4 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-muted-foreground text-sm">
                            No likes yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center gap-3">
                                    <Link href={getProfileUrl(user)} onClick={onClose}>
                                        <Avatar
                                            src={user.profilePhoto}
                                            name={`${user.firstName} ${user.lastName}`}
                                            size="sm"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={getProfileUrl(user)}
                                            onClick={onClose}
                                            className="font-semibold text-sm hover:underline block truncate"
                                        >
                                            {user.firstName} {user.lastName}
                                        </Link>
                                        <p className="text-xs text-muted-foreground truncate">{user.headline}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
