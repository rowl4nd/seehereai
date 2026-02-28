import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff } from "lucide-react";

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-light/20 border-b border-amber-light/30 px-4 py-2 text-center">
      <p className="text-sm text-foreground/70 flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        You're offline. Connect to start a session.
      </p>
    </div>
  );
};

export default OfflineBanner;
