import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCredits } from "@/hooks/useCredits";
import { useSessions } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Mirror = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { credits } = useCredits();
  const { activeSession, startSession, endSession, canStartSession, loading: sessionsLoading } = useSessions();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showEndWarning, setShowEndWarning] = useState(false);
  const [pastConversations, setPastConversations] = useState<Array<{ messages: Array<{ role: string; content: string }> }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine session duration (25 min free, 45 min paid)
  const sessionDuration = activeSession?.session_type === "paid" ? 45 * 60 : 25 * 60;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Guard: redirect to onboarding if not completed
  useEffect(() => {
    if (profile && !profile.has_completed_onboarding) {
      navigate("/onboarding");
    }
  }, [profile, navigate]);

  // Fetch past conversations on mount
  useEffect(() => {
    if (!user) return;
    
    const fetchPastConversations = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("messages")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) {
        setPastConversations(data as Array<{ messages: Array<{ role: string; content: string }> }>);
      }
    };
    
    fetchPastConversations();
  }, [user]);

  // Start session on mount if possible
  useEffect(() => {
    // Wait for sessions data to load before checking
    if (!user || sessionStarted || activeSession || sessionsLoading) return;

    const initSession = async () => {
      if (!canStartSession) {
        toast.error("You need to wait before starting another session");
        navigate("/dashboard");
        return;
      }

      // Determine session type
      const freeRemaining = profile ? Math.max(0, 2 - (profile.free_sessions_used || 0)) : 0;
      const sessionType = freeRemaining > 0 ? "free" : "paid";

      if (sessionType === "paid" && (!credits || credits.balance <= 0)) {
        toast.error("You need credits to start a session");
        navigate("/credits");
        return;
      }

      const { error, session } = await startSession(sessionType);
      if (error) {
        toast.error("Failed to start session");
        navigate("/dashboard");
        return;
      }

      // If using a free session, increment counter
      if (sessionType === "free" && profile) {
        await updateProfile({ free_sessions_used: (profile.free_sessions_used || 0) + 1 });
      }

      // If using paid, decrement credits (handled via edge function in production)
      // For now, we'll handle this client-side
      if (sessionType === "paid" && credits) {
        await supabase
          .from("credits")
          .update({ balance: credits.balance - 1 })
          .eq("user_id", user.id);
      }

      setSessionStarted(true);

      // Initial greeting
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: "Hello. I'm here to listen. Take your time — there's no rush. What's on your mind today?",
        },
      ]);
    };

    initSession();
  }, [user, canStartSession, sessionsLoading, profile, credits, activeSession, sessionStarted, startSession, updateProfile, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!activeSession) return;

    const startTime = new Date(activeSession.started_at).getTime();
    const endTime = startTime + sessionDuration * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);

      // Show warning at 5 minutes
      if (remaining <= 300 && remaining > 0 && !showEndWarning) {
        setShowEndWarning(true);
        setMessages((prev) => [
          ...prev,
          {
            id: "warning-" + Date.now(),
            role: "assistant",
            content: "We have about 5 minutes left. Take your time to share anything else on your mind, or we can begin to wrap up.",
          },
        ]);
      }

      // End session when timer hits 0
      if (remaining <= 0) {
        handleEndSession();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession, sessionDuration, showEndWarning]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEndSession = async () => {
    if (activeSession && user) {
      // Save the conversation to the database before ending
      const conversationMessages = messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.id
      }));
      
      await supabase
        .from("conversations")
        .insert({
          session_id: activeSession.id,
          user_id: user.id,
          messages: conversationMessages
        });
      
      await endSession(activeSession.id);
    }
    navigate("/cooldown");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages with wrap-up indicator if in final 5 minutes
      const messagesForAI = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      
      // Add wrap-up indicator to the latest user message if in wrap-up mode
      if (showEndWarning && messagesForAI.length > 0) {
        const lastMsg = messagesForAI[messagesForAI.length - 1];
        lastMsg.content = `[5 MINUTE WARNING] ${lastMsg.content}`;
      }

      // Call the AI chat edge function with past conversations for context
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: messagesForAI,
          pastConversations: pastConversations,
        },
      });

      const assistantMessage: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: response.data.message || "I hear you. Tell me more when you're ready.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: "error-" + Date.now(),
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-fade-in text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 border-b border-border/30">
        <Logo />
      </header>

      {/* Messages */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "rounded-bl-md"
                }`}
                style={message.role === "assistant" ? { backgroundColor: '#806e84', color: '#ffedd5' } : undefined}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse delay-100" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input and Timer */}
      <footer className="relative z-10 border-t border-border/30">
        {/* Timer and End session */}
        <div className="px-4 md:px-6 py-2 bg-card/30 border-b border-border/20">
          <div className="max-w-2xl mx-auto space-y-2">
            {timeRemaining !== null && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/60 transition-all duration-1000"
                    style={{ width: `${(timeRemaining / sessionDuration) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(timeRemaining)}</span>
              </div>
            )}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEndSession}
                className="text-xs text-muted-foreground"
              >
                End session
              </Button>
            </div>
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              className="flex-1 min-h-[48px] max-h-32 resize-none bg-card border-border/50 focus:border-primary/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground self-end"
            >
              Send
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Mirror;
