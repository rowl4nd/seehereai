import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DisclosureModalProps {
  open: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

const DisclosureModal = ({ open, onAccept, onClose }: DisclosureModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose?.(); }}>
      <DialogContent className="bg-[#f8f6f3] rounded-3xl shadow-2xl max-w-md w-full p-10 space-y-6 border border-white/60">
        <DialogHeader className="sr-only">
          <DialogTitle>Before we begin</DialogTitle>
        </DialogHeader>
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
        <div className="bg-[#e8e0f0] rounded-2xl px-5 py-4 text-center">
          <Link to="/auth" className="text-sm text-[#3d3a35] hover:text-[#4a7a4f] transition-colors">
            Already have an account? <span className="underline font-semibold">Log in</span>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclosureModal;
