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
    name: 'Felicia Naiwa Sithebe',
    role: 'Award Winning Industry Trailblazer',
    chapter: 'WIFT South Africa',
    image: '/Naiwa Sithibe.jpeg',
    quote: "WIFT Africa is a response to what we have been yearning, an all inclusive space for women by women, championing ownership of our industry contributions",
    achievement: 'ACMA Award Recipient 2025',
    verified: true
  },
  {
    name: 'Fatou Jupiter Touré',
    role: 'Award-Winning Producer',
    chapter: 'WIFT Senegal',
    image: '/Fatou Jupiter Touré.jpeg',
    quote: "Through WIFT, I was able to expand my professional network and access new opportunities within the film and television industry.",
    achievement: 'Producer',
    verified: true
  },
  {
    name: 'Tatapong Beyala',
    role: 'University Film Lecturer',
    chapter: 'WIFT Cameroon',
    image: '/Tatapong Bayela.jpeg',
    quote: "WIFT Africa welcomed me into a community of women sharing the same objectives with one voice, and this has changed everything — empowering us to grow, collaborate, and break barriers I never thought possible",
    achievement: 'Public Vision Award 2021',
    verified: true
  }
];

export default function LandingPage() {


  return (
    <LandingLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section - Member-Focused */}
        <section className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/heroBG.png"
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
              {/* Badge Removed */}

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
        <section id="about" className="py-16 md:py-24 bg-card relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Content Left */}
              <div className="lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Target className="h-4 w-4" />
                  Who We Are
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Empowering Women in <br />
                  <span className="text-primary">African Media</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  WIFT Africa is an organization set up to empower and support African and Pan African Women in the Film and TV industry. We are dedicated to providing support, capacity building, networking, mentorship, and economic empowerment for women in our industry.
                </p>

                <Link
                  href="/about"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-8"
                >
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>

              {/* Image Right */}
              <div className="lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />

                  <Image
                    src="/aboutImg.png"
                    alt="WIFT Africa Members"
                    width={400}
                    height={533}
                    className="w-full h-auto rounded-3xl shadow-xl relative z-10"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-primary relative overflow-hidden text-white">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/abstract.png"
              alt="Pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              {/* Left: Framed Vision Image */}
              <div className="lg:w-2/5">
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  {/* <div className="absolute inset-0 border-[8px] border-yellow-400/30 rounded-lg transform translate-x-4 translate-y-4" /> */}
                  {/* <div className="÷relative h-full w-full border-[8px] border-white shadow-2xl rounded-lg overflow-hidden bg-white"> */}
                  <Image
                    src="/4.png"
                    alt="WIFT Africa Vision"
                    fill
                    className="object-cover"
                  />
                  {/* </div> */}
                </div>
              </div>

              {/* Right: Content */}
              <div className="lg:w-3/5 space-y-12">
                {/* Vision */}
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Vision</h3>
                  <div className="w-20 h-1 bg-yellow-400 rounded-full" />
                  <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                    To help African women in film & TV become key industry players through networking, capacity building, mentorship and access to funding.
                  </p>
                </div>

                {/* Mission */}
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Mission</h3>
                  <div className="w-20 h-1 bg-yellow-400 rounded-full" />
                  <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                    To create a strong network of African/Pan African women in Film & TV.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Members Section - Redesigned */}
        <section id="success-stories" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-6 uppercase tracking-tight leading-tight">
                Real Community. Real Opportunities.<br />Real Growth.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                See how WIFT Africa members have expanded their networks, increased their visibility, and unlocked new creative opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {featuredMembers.map((member, index) => (
                <div key={index} className="relative group hover:-translate-y-1 transition-all duration-300 h-full">
                  {/* Card Container */}
                  <div className="bg-card rounded-[2.5rem] shadow-xl overflow-hidden border border-border flex flex-col h-full relative z-10">

                    {/* Top Red Shape */}
                    <div className="absolute top-0 left-0 right-0 h-24 w-full z-0">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-primary">
                        {/* Start top-left(0,0), go top-right(100,0), go down-right(100,60), curve to down-left(0,25) */}
                        <path d="M0 0 H100 V60 Q50 35 0 25 Z" />
                      </svg>
                    </div>

                    <div className="pt-28 pb-24 px-6 flex-grow flex flex-col items-center relative z-10">

                      {/* Header: Avatar + Info */}
                      <div className="flex flex-row items-center gap-4 w-full mb-8">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-full border-[3px] border-red-500 shadow-md overflow-hidden relative p-0.5 bg-card">
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          {/* Red dot badge */}
                          <div className="absolute bottom-0 right-0 w-6 h-6 bg-red-600 rounded-full border-2 border-background z-30 shadow-sm" />
                        </div>

                        {/* Text Info */}
                        <div className="flex flex-col text-left">
                          <h3 className="text-sm font-bold text-foreground leading-tight">{member.name}</h3>
                          <p className="text-lg font-bold text-red-600 leading-tight my-0.5 uppercase">{member.chapter}</p>
                          <p className="text-sm font-bold text-foreground leading-tight">{member.role}</p>
                        </div>
                      </div>

                      {/* Achievement - Emphasized */}
                      <div className="text-red-600 font-bold uppercase text-base mb-4 tracking-tight leading-tight text-center w-full">
                        {member.achievement}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-muted-foreground text-sm leading-relaxed px-2 text-center">
                        &ldquo;{member.quote}&rdquo;
                      </blockquote>
                    </div>

                    {/* Bottom Red Shape */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 w-full z-0">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-primary">
                        {/* Start bottom-left(0,100), go bottom-right(100,100), go up-right(100,75), curve to up-left(0,40) */}
                        <path d="M0 100 H100 V75 Q50 85 0 40 Z" />
                      </svg>
                    </div>
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto items-center">
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center h-24">
                    <div className="relative w-full h-full">
                      <Image
                        src="/WIF LA.jpg"
                        alt="WIF Los Angeles"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center h-24">
                    <div className="relative w-full h-full">
                      <Image
                        src="/BMGFoundation_logo_banner.jpg"
                        alt="Bill & Melinda Gates Foundation"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div> */}
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center h-24">
                    <div className="relative w-full h-full">
                      <Image
                        src="/Film Independent logo_png.png"
                        alt="Film Independent"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-center h-24">
                    <div className="relative w-full h-full">
                      <Image
                        src="/multichoice.jpg"
                        alt="MultiChoice Group"
                        fill
                        className="object-contain"
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