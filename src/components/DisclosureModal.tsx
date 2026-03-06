import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DisclosureModalProps {
  open: boolean;
  onClose: () => void;
}

const DisclosureModal = ({ open, onClose }: DisclosureModalProps) => {
  const navigate = useNavigate();

  if (!open) return null;

  const handleAccept = () => {
    sessionStorage.setItem("sh_disclosure_accepted", "true");
    onClose();
    navigate("/guest-chat");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#f8f6f3] rounded-3xl shadow-2xl max-w-md w-full p-10 space-y-6 border border-white/60">
        <div className="space-y-4 text-[#3d3a35]">
          <p className="text-base leading-relaxed">
            Welcome to SeeHere. I'm a warm, AI-powered space for you to share whatever is on your mind.
          </p>
          <p className="text-base leading-relaxed">
            Before we begin, please know that I am a <strong>listening companion, not a therapist</strong>, and I don't
            diagnose, treat, or give medical advice.
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
          <p className="text-sm leading-relaxed font-medium" style={{ color: "#c0392b" }}>
            If you are in immediate danger or distress, please stop here and call{" "}
            <a href="tel:116123" className="underline">
              116 123
            </a>{" "}
            (Samaritans) or{" "}
            <a href="tel:999" className="underline">
              999
            </a>
            .
          </p>
        </div>
        <Button
          onClick={handleAccept}
          className="w-full bg-[#4a7a4f] hover:bg-[#3d6542] text-white py-6 rounded-2xl text-base font-medium shadow-lg"
        >
          I understand — continue
        </Button>
        <div className="text-center">
          <Link to="/auth" className="text-sm text-[#3d3a35]/70 hover:text-[#4a7a4f] transition-colors">
            Already have an account? <span className="underline font-medium">Log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisclosureModal;
