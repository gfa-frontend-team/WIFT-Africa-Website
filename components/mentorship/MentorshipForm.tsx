'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { MentorshipFormat, MentorshipStatus, DayOfWeek } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Calendar, Clock } from 'lucide-react'

// Schema with new schedule fields
const mentorshipSchema = z.object({
    mentorName: z.string().min(2, 'Name is required').max(200, 'Name must be less than 200 characters'),
    mentorRole: z.string().min(2, 'Role is required').max(100, 'Role must be less than 100 characters'),
    areasOfExpertise: z.string().min(3, 'At least one area is required (comma separated)'),
    mentorshipFormat: z.nativeEnum(MentorshipFormat),

    // Enhanced Schedule Fields
    startPeriod: z.string().refine(
        (date) => {
            const selectedDate = new Date(date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return selectedDate >= today
        },
        { message: "Start date must be today or in the future" }
    ),
    endPeriod: z.string(),
    days: z.array(z.nativeEnum(DayOfWeek)).min(1, "Select at least one day"),
    timeFrame: z.string().min(2, 'Time frame is required (e.g., "12:30pm - 3:00pm")'),

    // Optional Fields
    mentorshipLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
    eligibility: z.string().max(500, 'Eligibility must be less than 500 characters').optional(),
}).refine(
    (data) => {
        const start = new Date(data.startPeriod)
        const end = new Date(data.endPeriod)
        return end > start
    },
    {
        message: "End date must be after start date",
        path: ["endPeriod"],
    }
)

type MentorshipFormValues = z.infer<typeof mentorshipSchema>

const daysOfWeek = [
    { value: DayOfWeek.Monday, label: 'Monday' },
    { value: DayOfWeek.Tuesday, label: 'Tuesday' },
    { value: DayOfWeek.Wednesday, label: 'Wednesday' },
    { value: DayOfWeek.Thursday, label: 'Thursday' },
    { value: DayOfWeek.Friday, label: 'Friday' },
    { value: DayOfWeek.Saturday, label: 'Saturday' },
    { value: DayOfWeek.Sunday, label: 'Sunday' },
]

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
            startPeriod: '',
            endPeriod: '',
            days: [],
            timeFrame: '',
            mentorshipLink: '',
            description: '',
            eligibility: '',
        },
    })

    const selectedFormat = form.watch('mentorshipFormat')
    const showLinkField = selectedFormat === MentorshipFormat.VIRTUAL || selectedFormat === MentorshipFormat.HYBRID

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: MentorshipFormValues) => {
            // Convert comma-separated string to array
            const payload = {
                ...values,
                areasOfExpertise: values.areasOfExpertise.split(',').map(s => s.trim()).filter(Boolean),
                status: MentorshipStatus.OPEN,
                // Only include mentorshipLink if it's provided and format is Virtual/Hybrid
                mentorshipLink: showLinkField && values.mentorshipLink ? values.mentorshipLink : undefined,
            }
            return mentorshipsApi.createMentorship(payload)
        },
        onSuccess: () => {
            toast.success('Mentorship created successfully')
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Mentor Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Mentor Information</h3>

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
                                        <Input placeholder="e.g. Award-Winning Director" {...field} />
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
                                <FormLabel>Areas of Expertise</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Script Development, Career Growth, Networking" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Separate multiple areas with commas
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Format & Schedule Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Format & Schedule</h3>

                    <FormField
                        control={form.control}
                        name="mentorshipFormat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mentorship Format</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select format" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={MentorshipFormat.VIRTUAL}>🌐 Virtual</SelectItem>
                                        <SelectItem value={MentorshipFormat.PHYSICAL}>📍 Physical</SelectItem>
                                        <SelectItem value={MentorshipFormat.HYBRID}>🔄 Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showLinkField && (
                        <FormField
                            control={form.control}
                            name="mentorshipLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meeting Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. https://zoom.us/j/123456789" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a link for virtual meetings (Zoom, Google Meet, etc.)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="startPeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                className="pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endPeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                className="pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="days"
                        render={() => (
                            <FormItem>
                                <FormLabel>Available Days</FormLabel>
                                <FormDescription>
                                    Select the days when mentorship sessions will be held
                                </FormDescription>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                    {daysOfWeek.map((day) => (
                                        <FormField
                                            key={day.value}
                                            control={form.control}
                                            name="days"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={day.value}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(day.value)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, day.value])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== day.value
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {day.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="timeFrame"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time Frame</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="e.g. 12:30pm - 3:00pm"
                                            className="pl-10"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Specify the time range for sessions
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Program Details</h3>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the mentorship program, what mentees will learn, and what to expect..."
                                        className="min-h-[150px]"
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

                    <FormField
                        control={form.control}
                        name="eligibility"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eligibility Criteria (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g. Open to all WIFT Africa members with at least 1 year of experience in screenwriting"
                                        className="min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Specify any requirements or prerequisites for applicants
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Mentorship
                    </Button>
                </div>
            </form>
        </Form>
    )
}
