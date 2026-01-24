import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Award, Briefcase, Calendar, Loader2, Trash2, Pencil } from 'lucide-react'
import { profilesApi } from '@/lib/api/profiles'
import { Experience } from '@/types'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ExperienceSectionProps {
  isOwner?: boolean
}

export default function ExperienceSection({ isOwner }: ExperienceSectionProps) {
  const { t } = useTranslation()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form State
  const initialFormState = {
    roleTitle: '',
    organizationName: '',
    employmentType: 'FULL_TIME',
    startDate: '',
    endDate: '',
    isPresent: false,
    description: ''
  }
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchExperience()
  }, [])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setFormData(initialFormState)
      setEditingId(null)
    }
  }, [isDialogOpen])

  const fetchExperience = async () => {
    try {
      const response = await profilesApi.getExperience()
      // Backend returns { message: string, data: Experience[] }
      // or sometimes just the array depending on the endpoint wrapper
      let data: any = response
      
      if (data && data.data && Array.isArray(data.data)) {
        data = data.data
      } else if (!Array.isArray(data)) {
        // Fallback for other potential structures
        if (Array.isArray(data.experience)) data = data.experience
        else data = []
      }
      
      setExperiences(data as Experience[])
    } catch (error) {
      console.error('Failed to fetch experience:', error)
      // Silent error or toast? depends on UX preference
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, employmentType: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPresent: checked }))
  }

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id || exp._id || null)
    setFormData({
      roleTitle: exp.roleTitle,
      organizationName: exp.organizationName || '',
      employmentType: exp.employmentType || 'FULL_TIME',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      isPresent: exp.isPresent,
      description: exp.description || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
       // Basic validation
      if (!formData.roleTitle || !formData.organizationName || !formData.startDate || !formData.employmentType) {
        toast.error(t('profile.experience.error_missing'), { description: t('profile.experience.error_missing_desc') })
        setIsSubmitting(false)
        return
      }

        if (editingId) {
        await profilesApi.updateExperience(editingId, formData)
        toast.success(t('profile.experience.success_update'))
      } else {
        await profilesApi.addExperience(formData)
        toast.success(t('profile.experience.success_add'))
      }
      
      setIsDialogOpen(false)
      fetchExperience()
    } catch (error) {
      console.error('Failed to save experience:', error)
      toast.error("Error", { description: "Failed to save experience." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('profile.experience.confirm_delete'))) return

    try {
      await profilesApi.deleteExperience(id)
      toast.success("Experience deleted")
      setExperiences(prev => prev.filter(exp => (exp.id || exp._id) !== id))
    } catch (error) {
      toast.error("Error", { description: "Failed to delete experience." })
    }
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          {t('profile.experience.title')}
        </h2>
        
        {isOwner && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10 border-primary/20">
                <Plus className="h-4 w-4" />
                <span>{t('profile.experience.add_btn')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingId ? t('profile.experience.edit_title') : t('profile.experience.add_title')}</DialogTitle>
                <DialogDescription>
                  {editingId ? t('profile.experience.edit_desc') : t('profile.experience.add_desc')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="roleTitle">{t('profile.experience.role_label')} *</Label>
                  <Input 
                    id="roleTitle" 
                    name="roleTitle" 
                    value={formData.roleTitle} 
                    onChange={handleInputChange} 
                    placeholder={t('profile.experience.role_placeholder')}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizationName">{t('profile.experience.org_label')} *</Label>
                  <Input 
                    id="organizationName" 
                    name="organizationName" 
                    value={formData.organizationName} 
                    onChange={handleInputChange} 
                    placeholder={t('profile.experience.org_placeholder')}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentType">{t('profile.experience.type_label')} *</Label>
                  <Select value={formData.employmentType} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('profile.experience.type_label')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">{t('profile.experience.types.full_time')}</SelectItem>
                      <SelectItem value="PART_TIME">{t('profile.experience.types.part_time')}</SelectItem>
                      <SelectItem value="CONTRACT">{t('profile.experience.types.contract')}</SelectItem>
                      <SelectItem value="FREELANCE">{t('profile.experience.types.freelance')}</SelectItem>
                      <SelectItem value="INTERNSHIP">{t('profile.experience.types.internship')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">{t('profile.experience.start_date')} *</Label>
                    <Input 
                      id="startDate" 
                      name="startDate" 
                      type="date"
                      value={formData.startDate} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className={formData.isPresent ? "text-muted-foreground" : ""}>{t('profile.experience.end_date')}</Label>
                    <Input 
                      id="endDate" 
                      name="endDate" 
                      type="date"
                      value={formData.endDate} 
                      onChange={handleInputChange} 
                      disabled={formData.isPresent}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="isPresent" 
                    checked={formData.isPresent}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isPresent">{t('profile.experience.current_work')}</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('profile.experience.desc_label')}</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder={t('profile.experience.desc_placeholder')}
                  />
                </div>

                <DialogFooter className="mt-4">
                   <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>{t('profile.experience.cancel')}</Button>
                   <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? (
                       <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         {t('profile.experience.saving')}
                       </>
                     ) : t('profile.experience.save')}
                   </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {experiences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
           <Award className="h-10 w-10 mx-auto mb-3 opacity-20" />
           <p>{t('profile.experience.empty')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id || exp._id} className="flex gap-4 group relative">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors mt-1">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-semibold text-foreground text-lg">{exp.roleTitle}</h3>
                     <div className="text-foreground/80 font-medium mb-1 flex items-center gap-1.5">
                       <span>{exp.organizationName}</span>
                       <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                         {exp.employmentType ? t(`profile.experience.types.${exp.employmentType.toLowerCase()}`) : t('profile.experience.default_role')}
                       </span>
                     </div>
                     <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
                       <Calendar className="h-3.5 w-3.5" />
                       <span>
                         {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.isPresent ? 'Present' : (exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : '')}
                       </span>
                     </div>
                   </div>
                   {isOwner && (
                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button
                         onClick={() => handleEdit(exp)}
                         className="text-muted-foreground hover:text-primary p-2 hover:bg-primary/10 rounded-md transition-colors"
                         title="Edit"
                       >
                         <Pencil className="h-4 w-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(exp.id || exp._id!)}
                         className="text-destructive p-2 hover:bg-destructive/10 rounded-md transition-colors"
                         title="Delete"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                     </div>
                   )}
                </div>
                {exp.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
