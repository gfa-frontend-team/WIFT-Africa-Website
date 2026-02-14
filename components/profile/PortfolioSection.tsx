import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, PlayCircle, Image as ImageIcon, Link as LinkIcon, Calendar, Info, Loader2, Trash2, Pencil, CheckCircle } from 'lucide-react'
import { portfolioApi, PortfolioItem } from '@/lib/api/portfolio'
import { toast } from 'sonner'
import { useAuth } from '@/lib/hooks/useAuth'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PortfolioSectionProps {
  isOwner?: boolean
  userId?: string // We might need userId if not owner to fetch their portfolio
}

export default function PortfolioSection({ isOwner, userId }: PortfolioSectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const targetUserId = userId || user?.id

  // Form State
  const initialFormState = {
    title: '',
    year: new Date().getFullYear().toString(),
    role: '',
    mediaType: 'VIDEO' as const,
    mediaUrl: '',
    description: '',
    visibility: 'PUBLIC' as const
  }
  const [uploadMode, setUploadMode] = useState<'LINK' | 'FILE'>('LINK')
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)

  const [formData, setFormData] = useState<{
    title: string
    year: string
    role: string
    mediaType: 'IMAGE' | 'VIDEO' | 'EXTERNAL'
    mediaUrl: string
    description: string
    visibility: 'PUBLIC' | 'CONNECTIONS'
  }>(initialFormState)

  useEffect(() => {
    if (targetUserId) {
      fetchPortfolio()
    }
  }, [targetUserId])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setFormData(initialFormState)
      setEditingId(null)
      setUploadMode('LINK')
      setIsUploadingMedia(false)
    }
  }, [isDialogOpen])

  const fetchPortfolio = async () => {
    if (!targetUserId) return
    try {
      const response = await portfolioApi.getPortfolio(targetUserId)
      let data: any = response
      
      // Handle various response structures
      if (data && data.data && Array.isArray(data.data)) {
        // format: { data: [...] }
        setItems(data.data)
      } else if (data && data.items && Array.isArray(data.items)) {
        // format: { items: [...] }
        setItems(data.items)
      } else if (Array.isArray(data)) {
        // format: [...]
        setItems(data)
      } else {
        console.warn('Unexpected portfolio data format:', response)
        setItems([])
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File too large. Max 10MB.")
      return
    }

    setIsUploadingMedia(true)
    try {
      const response = await portfolioApi.uploadMedia(file)
      // Auto-detect type
      const type = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'
      
      setFormData(prev => ({ 
        ...prev, 
        mediaUrl: response.url,
        mediaType: type as any
      }))
      toast.success("File uploaded")
    } catch (error) {
      console.error("Upload failed", error)
      toast.error("Upload failed. Please try again.")
    } finally {
      setIsUploadingMedia(false)
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id || item._id || null)
    setFormData({
      title: item.title,
      year: item.year.toString(),
      role: item.role,
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      description: item.description || '',
      visibility: item.visibility || 'PUBLIC'
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.title || !formData.role || !formData.mediaUrl) {
        toast.error(t('profile.portfolio.error_missing'), { description: t('profile.portfolio.error_missing_desc') })
        setIsSubmitting(false)
        return
      }

      const payload = {
        ...formData,
        year: parseInt(formData.year)
      }

      if (editingId) {
        await portfolioApi.updatePortfolioItem(editingId, payload)
        toast.success(t('profile.portfolio.success_update'))
      } else {
        await portfolioApi.addPortfolioItem(payload)
        toast.success(t('profile.portfolio.success_add'))
      }
      
      setIsDialogOpen(false)
      fetchPortfolio()
    } catch (error) {
      console.error('Failed to save portfolio item:', error)
      toast.error("Error", { description: "Failed to save work." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('profile.portfolio.confirm_delete'))) return

    try {
      await portfolioApi.deletePortfolioItem(id)
      toast.success("Item deleted")
      setItems(prev => prev.filter(item => (item.id || item._id) !== id))
    } catch (error) {
      toast.error("Error", { description: "Failed to delete item." })
    }
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle className="h-8 w-8" />
      case 'IMAGE': return <ImageIcon className="h-8 w-8" />
      default: return <LinkIcon className="h-8 w-8" />
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
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
           <PlayCircle className="h-5 w-5 text-primary" />
           {t('profile.portfolio.title')}
        </h2>
        {isOwner && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10 border-primary/20">
                <Plus className="h-4 w-4" />
                <span>{t('profile.portfolio.add_btn')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingId ? t('profile.portfolio.edit_title') : t('profile.portfolio.add_title')}</DialogTitle>
                <DialogDescription>
                  {editingId ? t('profile.portfolio.edit_desc') : t('profile.portfolio.add_desc')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('profile.portfolio.project_title')} *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    placeholder={t('profile.portfolio.project_placeholder')}
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">{t('profile.portfolio.year')} *</Label>
                    <Input 
                      id="year" 
                      name="year" 
                      type="number"
                      value={formData.year} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('profile.portfolio.role_label')} *</Label>
                    <Input 
                      id="role" 
                      name="role" 
                      value={formData.role} 
                      onChange={handleInputChange} 
                      placeholder={t('profile.portfolio.role_placeholder')}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mediaType">{t('profile.portfolio.media_type')}</Label>
                    <Select value={formData.mediaType} onValueChange={(val) => handleSelectChange('mediaType', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIDEO">{t('profile.portfolio.types.video')}</SelectItem>
                        <SelectItem value="IMAGE">{t('profile.portfolio.types.image')}</SelectItem>
                        <SelectItem value="EXTERNAL">{t('profile.portfolio.types.external')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">{t('profile.portfolio.visibility')}</Label>
                    <Select value={formData.visibility} onValueChange={(val) => handleSelectChange('visibility', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">{t('profile.portfolio.vis_options.public')}</SelectItem>
                        <SelectItem value="CONNECTIONS">{t('profile.portfolio.vis_options.connections')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                  <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Label className="text-sm font-medium">{t('profile.portfolio.media_source')}</Label>
                    <div className="flex bg-muted rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => setUploadMode('LINK')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${uploadMode === 'LINK' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Link
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode('FILE')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${uploadMode === 'FILE' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  {uploadMode === 'LINK' ? (
                    <div className="space-y-2">
                      <Label htmlFor="mediaUrl">{t('profile.portfolio.media_url')} *</Label>
                      <Input 
                        id="mediaUrl" 
                        name="mediaUrl" 
                        value={formData.mediaUrl} 
                        onChange={handleInputChange} 
                        placeholder="https://..."
                        required={uploadMode === 'LINK'}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="fileUpload">{t('profile.portfolio.upload_file')} *</Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          id="fileUpload" 
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          disabled={isUploadingMedia}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        {isUploadingMedia && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      </div>
                      {formData.mediaUrl && uploadMode === 'FILE' && (
                         <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                           <CheckCircle className="h-3 w-3" /> File uploaded successfully
                         </p>
                      )}
                      <p className="text-xs text-muted-foreground">Max 10MB. Images or Videos.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('profile.portfolio.desc_label')}</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows={3}
                  />
                </div>

                <DialogFooter className="mt-4">
                   <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>{t('profile.portfolio.cancel')}</Button>
                   <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? (
                       <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         {t('profile.portfolio.saving')}
                       </>
                     ) : t('profile.portfolio.save')}
                   </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
           <PlayCircle className="h-10 w-10 mx-auto mb-3 opacity-20" />
           <p>{t('profile.portfolio.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id || item._id} className="group relative aspect-video bg-black/5 dark:bg-black/20 rounded-lg overflow-hidden flex flex-col items-center justify-center cursor-pointer border border-border hover:border-primary/50 transition-all">
              {/* If we had a thumbnail, we'd show it here. For now, showing placeholder with icon */}
              {item.thumbnailUrl ? (
                 <img src={item.thumbnailUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              ) : (
                 <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20" />
              )}
              
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white z-10 pointer-events-none">
                <div className="font-semibold text-sm truncate">{item.title}</div>
                <div className="text-xs text-white/80 flex items-center gap-1.5">
                   <span>{item.year}</span> • <span>{item.role}</span>
                   {item.visibility === 'CONNECTIONS' && (
                     <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] ml-1">{t('profile.portfolio.connections_badge')}</span>
                   )}
                </div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-2 text-foreground/70 group-hover:text-primary transition-colors pointer-events-none">
                {getMediaIcon(item.mediaType)}
              </div>

               {isOwner && (
                <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation()
                       handleEdit(item)
                     }}
                     className="p-1.5 bg-background/80 text-foreground rounded-full hover:bg-background hover:text-primary transition-colors cursor-pointer"
                   >
                     <Pencil className="h-3 w-3" />
                   </button>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation()
                       handleDelete(item.id || item._id!)
                     }}
                     className="p-1.5 bg-destructive/80 text-white rounded-full hover:bg-destructive transition-colors cursor-pointer"
                   >
                     <Trash2 className="h-3 w-3" />
                   </button>
                </div>
              )}
              
              {/* Click to open behavior */}
              <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
