import { Plus, PlayCircle, Image as ImageIcon } from 'lucide-react'

interface PortfolioSectionProps {
  isOwner?: boolean
}

export default function PortfolioSection({ isOwner }: PortfolioSectionProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Portfolio</h2>
        {isOwner && (
          <button className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Work</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mock Item 1 */}
        <div className="group relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
          <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <PlayCircle className="h-8 w-8" />
            <span className="font-medium text-sm">Demo Reel 2024</span>
          </div>
        </div>

        {/* Mock Item 2 */}
        <div className="group relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
          <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <ImageIcon className="h-8 w-8" />
            <span className="font-medium text-sm">Set Photography</span>
          </div>
        </div>
      </div>
       
      <div className="mt-6 pt-4 border-t border-dashed border-border text-xs text-muted-foreground text-center italic">
        * Portfolio showcase is coming soon.
      </div>
    </div>
  )
}
