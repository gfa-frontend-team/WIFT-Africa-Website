'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const applicationSchema = z.object({
    coverLetter: z.string()
        .min(50, 'Cover letter must be at least 50 characters')
        .max(2000, 'Cover letter must be less than 2000 characters'),
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

interface MentorshipApplicationModalProps {
    mentorshipId: string
    mentorName: string
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function MentorshipApplicationModal({
    mentorshipId,
    mentorName,
    trigger,
    open,
    onOpenChange
}: MentorshipApplicationModalProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const queryClient = useQueryClient()

    // Handle controlled vs uncontrolled state
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            coverLetter: '',
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: ApplicationFormValues) => {
            return mentorshipsApi.applyForMentorship(mentorshipId, {
                coverLetter: values.coverLetter
            })
        },
        onSuccess: () => {
            toast.success('Application submitted successfully!')
            queryClient.invalidateQueries({ queryKey: ['mentorship', mentorshipId] })
            queryClient.invalidateQueries({ queryKey: ['my-applications'] })
            setIsOpen(false)
            form.reset()
        },
        onError: (error) => {
            toast.error('Failed to submit application: ' + (error as Error).message)
        }
    })

    function onSubmit(values: ApplicationFormValues) {
        mutate(values)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Apply for Mentorship</DialogTitle>
                    <DialogDescription>
                        Submit your application to {mentorName}. Please write a cover letter explaining why you're a good fit.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="coverLetter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cover Letter</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Introduce yourself, explain your goals, and why you want this mentorship..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value.length}/2000 characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
