import Link from 'next/link';
import { Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/WIFTAFRICA.png" alt="WIFT Africa" className="h-5 w-auto" />
            </div>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              Empowering women in the African film and television industry. Connect with professionals, discover opportunities, and advance your career.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.linkedin.com/company/women-in-film-and-tv-africa/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://www.facebook.com/wiftafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://www.instagram.com/wiftafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a
                href="http://www.youtube.com/@wiftafrica4002"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary/10 border border-primary/20 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/feed" className="text-muted-foreground hover:text-primary transition-colors">Feed</Link></li>
              <li><Link href="/directory" className="text-muted-foreground hover:text-primary transition-colors">Member Directory</Link></li>
              <li><Link href="/chapters" className="text-muted-foreground hover:text-primary transition-colors">Chapters</Link></li>
              <li><Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">Learning Resources</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="mailto:support@wiftafrica.org" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</a></li>
              <li><a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 WIFT Africa. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-muted-foreground text-sm">
              Made with Love
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}