interface WelcomeBackMessageProps {
  userName?: string | null;
}

const WelcomeBackMessage = ({ userName }: WelcomeBackMessageProps) => {
  return (
    <div className="space-y-3 text-base leading-relaxed">
      <p>
        Welcome back{userName ? `, ${userName}` : ""}. I'm here whenever you're ready to talk.
      </p>
      <p>Take a breath. When you're ready, what's been on your mind?</p>
    </div>
  );
};

export default WelcomeBackMessage;
