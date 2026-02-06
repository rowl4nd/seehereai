import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import lakeBackground from "@/assets/lake-background.jpg";

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${lakeBackground})` }}
      />
      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-background/30" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-8 bg-sage-soft/80 backdrop-blur-sm">
        <Link to="/" className="font-serif text-xl text-foreground hover:text-primary transition-colors">
          see here
        </Link>
        {!loading && (
          user ? (
            <Link to="/dashboard">
              <Button variant="ghost" className="font-sans text-sm hover:bg-accent/50">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" className="font-sans text-sm hover:bg-accent/50">
                Log in
              </Button>
            </Link>
          )
        )}
      </header>

      {/* Main content - centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in-slow">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-foreground/80 font-light leading-relaxed max-w-2xl mx-auto font-serif drop-shadow-md whitespace-nowrap" style={{ textShadow: '0 2px 10px rgba(255,255,255,0.3)' }}>
            a psychologically informed listening ear
          </p>

          {/* Warm decorative element */}
          <div className="flex justify-center pt-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent" />
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-serif">
                When you're ready, let's proceed
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center bg-sage-soft/80 backdrop-blur-sm">
        <p className="text-xs text-foreground/60 font-serif">
          A space for reflection
        </p>
      </footer>
    </div>
  );
};

export default Index;
