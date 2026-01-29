'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { MentorshipFormat, MentorshipStatus } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

// Schema
const mentorshipSchema = z.object({
    mentorName: z.string().min(2, 'Name is required'),
    mentorRole: z.string().min(2, 'Role is required'),
    areasOfExpertise: z.string().min(3, 'At least one area is required (comma separated)'),
    mentorshipFormat: z.nativeEnum(MentorshipFormat),
    availability: z.string().min(2, 'Availability is required'),
    duration: z.string().min(2, 'Duration is required'),
    description: z.string().min(10, 'Description is required'),
    eligibility: z.string().min(5, 'Eligibility criteria is required'),
})

type MentorshipFormValues = z.infer<typeof mentorshipSchema>

export function MentorshipForm() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const form = useForm<MentorshipFormValues>({
        resolver: zodResolver(mentorshipSchema),
        defaultValues: {
            mentorName: '',
            mentorRole: '',
            areasOfExpertise: '',
            mentorshipFormat: MentorshipFormat.VIRTUAL,
            availability: 'Weekly',
            duration: '3 months',
            description: '',
            eligibility: '',
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: MentorshipFormValues) => {
            // Convert comma-separated string to array
            const payload = {
                ...values,
                areasOfExpertise: values.areasOfExpertise.split(',').map(s => s.trim()).filter(Boolean),
                status: MentorshipStatus.OPEN
            }
            return mentorshipsApi.createMentorship(payload)
        },
        onSuccess: () => {
            toast.success('Mentorship offer created successfully')
            queryClient.invalidateQueries({ queryKey: ['mentorships'] })
            router.push('/opportunities?tab=mentorship')
        },
        onError: (error) => {
            toast.error('Failed to create mentorship: ' + (error as Error).message)
        }
    })

    function onSubmit(values: MentorshipFormValues) {
        mutate(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="mentorName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mentor Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Jane Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mentorRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Professional Role</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Senior Director" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="areasOfExpertise"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Areas of Expertise (Comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Directing, Screenwriting, Career Advice" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="mentorshipFormat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Format</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={MentorshipFormat.VIRTUAL}>Virtual</SelectItem>
                                        <SelectItem value={MentorshipFormat.PHYSICAL}>Physical</SelectItem>
                                        <SelectItem value={MentorshipFormat.HYBRID}>Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 3 months" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Availability</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Weekly calls" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="eligibility"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Eligibility Criteria</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Must have 1 short film credit" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the mentorship program..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Offer
                    </Button>
                </div>
            </form>
        </Form>
    )
}
