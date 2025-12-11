import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="flex-1">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}