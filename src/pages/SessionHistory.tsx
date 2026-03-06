import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEncryptedMessages } from "@/hooks/useEncryptedMessages";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

interface Message {
  role: string;
  content: string;
  timestamp?: string;
}

const SessionHistory = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, loading: authLoading } = useAuth();
  const { loadSessionMessages } = useEncryptedMessages();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // SEO - noindex
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!sessionId || !user) return;

    const fetchMessages = async () => {
      setLoading(true);
      const conversations = await loadSessionMessages(sessionId);
      // Combine all conversation messages in order
      const allMessages = conversations.flatMap((c) => c.messages as Message[]);
      setMessages(allMessages);
      setLoading(false);
    };

    fetchMessages();
  }, [sessionId, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 flex justify-between items-center px-4 py-2 md:px-8">
        <Logo />
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-2xl space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif font-light text-foreground">Session Review</h1>
            <p className="text-sm text-muted-foreground">A look back at your conversation</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">No messages found for this session</p>
            ) : (
              messages.map((msg, i) => {
                const isUser = msg.role === "user";
                return (
                  <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border/50 text-card-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionHistory;
