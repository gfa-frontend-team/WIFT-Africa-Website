'use client'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
  footer?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children, className, contentClassName, footer }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200",
        className
      )}
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={cn(
          "bg-card w-full max-w-lg rounded-xl shadow-xl border border-border flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200",
          contentClassName
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
        
        {footer && (
          <div className="p-4 border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
