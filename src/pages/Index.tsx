import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import lakeBackground from "@/assets/lake-background.jpg";

const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  return <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background image with soft overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${lakeBackground})` }}
      />
      <div className="absolute inset-0 bg-background/60" />
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-8 bg-sage-soft">
        <span className="font-serif text-xl text-foreground">see here</span>
        {!loading && (user ? <Link to="/dashboard">
              <Button variant="ghost" className="text-sm hover:bg-sage-muted/50">
                Dashboard
              </Button>
            </Link> : <Link to="/auth">
              <Button variant="ghost" className="text-sm hover:bg-sage-muted/50">
                Log in
              </Button>
            </Link>)}
      </header>

      {/* Main content - centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-in-slow">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Main title */}
          <h1 className="text-4xl font-serif text-foreground tracking-tight md:text-5xl font-medium">
            A psychologically informed listening ear
          </h1>
          
          {/* Warm decorative element */}
          <div className="flex justify-center">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>

          {/* Description */}
          <div className="space-y-4 max-w-lg mx-auto">
            <p className="text-lg text-foreground font-medium">
              A calming space for reflection where YOU set the pace.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The AI reflective mirror offers gentle and compassionate questions, supporting awareness of emotions, patterns, and core beliefs as they emerge.
            </p>
          </div>

          {/* Call to action */}
          <div className="pt-4">
            <Link to="/auth">
              <Button className="bg-sage-soft hover:bg-sage-muted text-foreground border border-sage-muted/50 px-8 py-2">
                When you're ready, let's proceed
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center bg-sage-soft">
        <p className="text-xs text-foreground/70">
          A space for reflection
        </p>
      </footer>
    </div>;
};
export default Index;