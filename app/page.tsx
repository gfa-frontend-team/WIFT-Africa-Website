"use client";

import {
  ArrowRight,
  Shield,
  Zap,
  Play,
  UserCheck,
  Eye,
  Network,
  Crown,
  Award,
  Target,
  Rocket,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LandingLayout from '@/components/layout/LandingLayout';

export default function LandingPage() {
  const memberBenefits = [
    {
      icon: Eye,
      title: "Enhanced Visibility",
      description:
        "Increase your profile reach among producers, directors, and collaborators across Africa and the diaspora.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: UserCheck,
      title: "Verified Professional Status",
      description:
        "Build trust and credibility with industry partners and employers.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Network,
      title: "Premium Networking Access",
      description:
        "Connect directly with chapter leaders, industry mentors, and emerging talent.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Crown,
      title: "Chapter Leadership Pathways",
      description:
        "Step into industry leadership and shape your local creative ecosystem.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Briefcase,
      title: "Access to Job Match & Talent Calls",
      description:
        "Get early access to exclusive opportunities and curated career recommendations.",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Zap,
      title: "Advanced Profile Toolkit",
      description:
        "Showcase reels, credits, achievements, and press — all in one professional profile.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const featuredMembers = [
    {
      name: "Asha Mandela",
      role: "Award-Winning Director",
      chapter: "WIFT South Africa",
      location: "Cape Town, South Africa",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=asha&backgroundColor=b6e3f4&clothesColor=262e33",
      achievement: "AMAA Best Director 2024",
      verified: true,
      quote: "WIFT Africa connected me with producers in 8 countries. My visibility grew more than 400% in just six months."
    },
    {
      name: "Kemi Adetiba",
      role: "Producer & Screenwriter",
      chapter: "WIFT Nigeria",
      location: "Lagos, Nigeria",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=kemi&backgroundColor=c0aede&clothesColor=3c4f5c",
      achievement: "Producer, Netflix Originals",
      verified: true,
      quote: "My profile reach skyrocketed. The platform opened professional doors I once thought were out of reach."
    },
    {
      name: "Wanuri Kahiu",
      role: "Cinematographer",
      chapter: "WIFT Kenya",
      location: "Nairobi, Kenya", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=wanuri&backgroundColor=ffd5dc&clothesColor=929598",
      achievement: "Cannes Film Festival Selection",
      verified: true,
      quote: "Three major collaborations started through my WIFT profile. The visibility is real — and it&apos;s global."
    }
  ];

  return (
    <LandingLayout>
      <div className="min-h-screen bg-background">
      {/* Hero Section - Member-Focused */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/herobg.jpg" 
            alt="WIFT Africa Community" 
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <UserCheck className="h-4 w-4" />
              Join 300+ Verified Film Professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Africa&apos;s Premier Network for
              <br />
              <span className="text-primary">Women in Film, Television & Media</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join 300+ verified professionals across 10 countries. Connect, 
              collaborate, and grow with a community that champions women&apos;s voices 
              in African storytelling.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <a 
                href="https://www.linkedin.com/company/women-in-film-and-tv-africa/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </a>
              <a 
                href="https://www.facebook.com/wiftafrica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/wiftafrica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a 
                href="http://www.youtube.com/@wiftafrica4002" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-8 py-4"
              >
                Join the Community - Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Watch Member Stories
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">300+</div>
                <div className="text-sm md:text-base text-white/80">Verified Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
                <div className="text-sm md:text-base text-white/80">Chapter Leaders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
                <div className="text-sm md:text-base text-white/80">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">92%</div>
                <div className="text-sm md:text-base text-white/80">Recommend to Colleagues</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About Us</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              WIFT Africa is an organization set up to empower and support African and Pan African Women in the Film and TV industry. We are dedicated to providing support, capacity building, networking, mentorship, and economic empowerment for women in our industry.
            </p>
            
            <Link 
              href="/about"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-2"
            >
              Read More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Member Success Stories */}
      <section id="success-stories" className="py-10 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Real Community. Real Opportunities. Real Growth.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how WIFT Africa members have expanded their networks, increased their visibility, and unlocked new creative opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {featuredMembers.map((member, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
                
                <div className="relative">
                  {/* Member Photo & Verification */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <Image 
                        src={member.image} 
                        alt={member.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                      />
                      {member.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">{member.name}</div>
                      <h3 className="font-bold text-primary text-lg mb-1">{member.chapter}</h3>
                      <p className="text-foreground font-medium text-sm">{member.role}</p>
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                    <Award className="h-3 w-3 inline mr-1" />
                    {member.achievement}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-muted-foreground text-sm italic leading-relaxed">
                    &ldquo;{member.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Benefits Section */}
      <section id="benefits" className="py-10 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="h-4 w-4" />
              Community Benefits
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Connect. Collaborate. Create Together.
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join 300+ verified professionals building a stronger community for women in African film, television, and media.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {memberBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-16 h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <Icon className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Membership CTA Section */}
      <section className="py-10 lg:py-12 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Main CTA */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Rocket className="h-4 w-4" />
                Start Your Journey Today
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Your Community Awaits
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Join 12,000+ verified professionals who&apos;ve found their tribe, built lasting connections, and amplified their voices through WIFT Africa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  href="/register"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-10 py-5"
                >
                  Join Our Community - Free
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
                <Link 
                  href="/login"
                  className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-xl font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-10 py-5"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="border-t border-border pt-12 mt-8">
              <p className="text-sm font-medium text-muted-foreground mb-8 text-center uppercase tracking-wider">
                Trusted by professionals at
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto items-center">
                <div className="bg-white backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center hover:border-primary/30 transition-colors h-24">
                  <div className="relative w-full h-full">
                    <Image
                      src="/WIF LA.jpg"
                      alt="WIF Los Angeles"
                      fill
                      className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div className="bg-white backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center hover:border-primary/30 transition-colors h-24">
                  <div className="relative w-full h-full">
                    <Image
                      src="/bill & melinda gates logo.png.png"
                      alt="Bill & Melinda Gates Foundation"
                      fill
                      className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div className="bg-white backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center hover:border-primary/30 transition-colors h-24">
                  <div className="relative w-full h-full">
                    <Image
                      src="/Film Independent_logo png.png"
                      alt="Film Independent"
                      fill
                      className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <div className="bg-white backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center hover:border-primary/30 transition-colors h-24">
                  <div className="relative w-full h-full">
                    <Image
                      src="/MultiChoice logo.png.webp"
                      alt="MultiChoice Group"
                      fill
                      className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </LandingLayout>
  );
}