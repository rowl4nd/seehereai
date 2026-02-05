import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Subtle warm border frame */}
      <div className="fixed inset-4 border border-border/50 rounded-2xl pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 flex justify-end p-6 md:p-8">
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
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl font-serif font-light text-foreground tracking-tight">
            See Here
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
            A psychologically informed listening ear
          </p>

          {/* Warm decorative element */}
          <div className="flex justify-center pt-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>

          {/* Gentle call to action */}
          <p className="text-sm text-muted-foreground/70 pt-8 font-light">
            When you're ready, take a moment for yourself
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          A space for reflection
        </p>
      </footer>
    </div>
  );
};

export default Index;
