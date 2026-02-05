import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl font-serif font-light text-foreground">
          Page not found
        </h1>
        <p className="text-muted-foreground">
          Let's find our way back
        </p>
        <Link to="/">
          <Button variant="outline" className="border-border/50">
            Return home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
