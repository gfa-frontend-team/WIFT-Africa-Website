'use client';

import LandingLayout from '@/components/layout/LandingLayout';
import { Network, Crown, Target } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <LandingLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32 bg-primary/5">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                About <span className="text-primary">WIFT Africa</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Empowering and supporting African and Pan-African Women in the Film and TV industry.
              </p>
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </section>

        {/* Main Content */}
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    {/* About Text */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            WIFT Africa is an organization set up to empower and support African and Pan African Women in the Film and TV industry. The main objective of the organization is to provide support, capacity building, network, mentorship, educational and economic empowerment for women.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                            WIFT Africa aims to build effective collaboration and partnerships within Africa and the rest of the world; sustain relationships amongst women in the TV and Film community in Africa and encourage the establishment of more WIFT chapters across Africa. We aim to improve access to resources and funding by collaborating with relevant organizations, agencies and stakeholders that are in the position to help.
                        </p>
                    </div>

                    {/* Vision & Mission Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                <Target className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                To help African women in film & TV become key industry players through networking, capacity building, mentorship and access to funding.
                            </p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all group">
                             <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                <Crown className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                To create a strong network of African/Pan African women in Film & TV.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
      </div>
    </LandingLayout>
  );
}
