'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, UserPlus } from 'lucide-react'

interface PublicProfileCTAProps {
  firstName: string
}

export default function PublicProfileCTA({ firstName }: PublicProfileCTAProps) {
  const router = useRouter()

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Sign in to view full profile
              </p>
              <p className="text-sm text-muted-foreground">
                Join WIFT Africa to see {firstName}&apos;s contact details, connections, and more.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2.5 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors flex-1 sm:flex-none"
            >
              Log In
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <UserPlus className="h-4 w-4" />
              Join Now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
