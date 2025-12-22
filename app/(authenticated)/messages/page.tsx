'use client'

import { MessageCircle } from 'lucide-react'
import FeatureGate from '@/components/access/FeatureGate'

export default function MessagesPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <FeatureGate 
        feature="canSendMessages"
        restrictionTitle="Messaging Requires Verification"
        restrictionDescription="Complete your membership verification to send and receive messages from other WIFT Africa members."
        size="lg"
      >
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Messages Coming Soon
            </h2>
            <p className="text-muted-foreground">
              Connect and communicate with other WIFT Africa members through direct messaging.
            </p>
          </div>
        </div>
      </FeatureGate>
    </div>
  )
}
