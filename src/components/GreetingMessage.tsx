import { Link } from "react-router-dom";

interface GreetingMessageProps {
  userName?: string | null;
}

const GreetingMessage = ({ userName }: GreetingMessageProps) => {
  return (
    <div className="space-y-3 text-base leading-relaxed">
      <p>
        Welcome to See Here.{userName ? ` ${userName}, I'm` : " I'm"} a warm, AI-powered space for you to share whatever is on your mind.
      </p>
      <p>
        Before we begin, please know that I am a listening companion, not a therapist, and I don't diagnose, treat, or give medical advice.
      </p>
      <p>
        Your privacy is held safely here. By continuing our chat, you acknowledge that you've read and agree to our{" "}
        <Link
          to="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white/80 hover:text-white transition-colors"
        >
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white/80 hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
        . If you are in immediate danger or distress, please stop here and call 116 123 (Samaritans) or 999.
      </p>
      <p>Take a breath. When you're ready, what's been on your mind?</p>
    </div>
  );
};

export default GreetingMessage;
