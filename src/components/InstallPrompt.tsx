import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";
import { Share, X } from "lucide-react";

const InstallPrompt = () => {
  const { showPrompt, isIOS, installApp, dismissPrompt } = useInstallPrompt();

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] animate-fade-in-up">
      <div className="max-w-md mx-auto bg-card border border-border/50 rounded-2xl shadow-lg p-5 relative">
        <button
          onClick={dismissPrompt}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-medium mb-2">Add SeeHere to your home screen</h3>
        <p className="text-sm text-muted-foreground mb-4">
          For a quieter, more private experience.
        </p>

        {isIOS ? (
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="flex items-center gap-2">
              <Share className="h-4 w-4 shrink-0" />
              Tap the share icon below, then "Add to Home Screen"
            </p>
            <button
              onClick={dismissPrompt}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              Maybe later
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button onClick={installApp} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add to home screen
            </Button>
            <button
              onClick={dismissPrompt}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;
