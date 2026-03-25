import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DisclosureModalProps {
  open: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

const DisclosureModal = ({ open, onAccept, onClose }: DisclosureModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#f8f6f3] rounded-3xl shadow-2xl max-w-md w-full p-10 space-y-6 border border-white/60 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#3d3a35]/60 hover:text-[#3d3a35] transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
        <div className="space-y-4 text-[#3d3a35]">
          <p className="text-base leading-relaxed">
            Welcome to SeeHere. I'm a warm, AI-powered space for you to share whatever is on your mind.
          </p>
          <p className="text-base leading-relaxed">
            Your privacy is held safely here. By continuing our chat, you acknowledge that you've read and agree to our{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#4a7a4f] transition-colors"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#4a7a4f] transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <Button
          onClick={onAccept}
          className="w-full bg-[#4a7a4f] hover:bg-[#3d6542] text-white py-6 rounded-2xl text-base font-medium shadow-lg"
        >
          I understand — continue
        </Button>
        <div className="bg-[#e8e0f0] rounded-2xl px-5 py-4 flex items-center justify-center gap-3">
          <span className="text-sm font-bold text-[#3d3a35]">Two free sessions</span>
          <span className="text-[#3d3a35]/30">|</span>
          <Link to="/auth" className="text-sm text-[#3d3a35] hover:text-[#4a7a4f] transition-colors">
            Have an account? <span className="underline font-semibold">Log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisclosureModal;
