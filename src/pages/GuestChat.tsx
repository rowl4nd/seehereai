import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import SecureSessionModal from "@/components/SecureSessionModal";
import { useEncryptedMessages } from "@/hooks/useEncryptedMessages";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MAX_GUEST_MESSAGES = 3;

const GuestChat = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { createConversation: createEncryptedConversation, saveMessages } = useEncryptedMessages();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [guestLimitReached, setGuestLimitReached] = useState(false);

  // Authenticated session state (post-signup)
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showEndWarning, setShowEndWarning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const conversationIdRef = useRef<string | null>(null);
  const migrationDoneRef = useRef(false);

  // Check guest onboarding
  useEffect(() => {
    const onboardingDone = sessionStorage.getItem("guest_onboarding_complete");
    if (!onboardingDone) {
      navigate("/try/guidance");
      return;
    }

    // Load any existing guest messages from sessionStorage
    const saved = sessionStorage.getItem("guest_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
        setMessages(parsed);
        const userCount = parsed.filter((m) => m.role === "user").length;
        if (userCount >= MAX_GUEST_MESSAGES) {
          setGuestLimitReached(true);
          setShowModal(true);
        }
      } catch {
        // ignore
      }
    }

    // Add greeting if no messages
    if (!saved) {
      const greeting: Message = {
        id: "greeting",
        role: "assistant",
        content: "Hello. I'm here to listen. Take your time — there's no rush. What's on your mind?",
      };
      setMessages([greeting]);
      sessionStorage.setItem("guest_messages", JSON.stringify([greeting]));
    }
  }, [navigate]);

  // Keep refs in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer for authenticated session
  useEffect(() => {
    if (!authenticated || !sessionStartedAt) return;

    const sessionDuration = 25 * 60; // free session = 25 min
    const startTime = new Date(sessionStartedAt).getTime();
    const endTime = startTime + sessionDuration * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);

      // 5-minute warning
      if (remaining <= 300 && remaining > 0 && !showEndWarning) {
        setShowEndWarning(true);
      }

      if (remaining <= 0 && !sessionEnded) {
        setSessionEnded(true);
        // Save final messages
        if (conversationIdRef.current) {
          saveMessages(
            conversationIdRef.current,
            messagesRef.current.map((m) => ({ role: m.role, content: m.content, timestamp: m.id }))
          );
        }
        // End session in DB
        if (sessionId) {
          supabase
            .from("sessions")
            .update({ is_active: false, ended_at: new Date().toISOString(), duration_minutes: 25 })
            .eq("id", sessionId)
            .then(() => {});
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [authenticated, sessionStartedAt, sessionEnded, sessionId, showEndWarning]);

  // After auth state changes (user signs up), migrate guest data
  useEffect(() => {
    if (!user || !guestLimitReached || migrationDoneRef.current) return;
    migrationDoneRef.current = true;

    const migrateGuestData = async () => {
      try {
        // Update profile: mark onboarding complete
        await updateProfile({
          has_completed_onboarding: true,
          has_acknowledged_terms: true,
          has_acknowledged_privacy_policy: true,
          has_acknowledged_ai_disclosure: true,
          onboarding_completed_at: new Date().toISOString(),
        });

        // Start a free session
        const { data: rpcResult, error: rpcError } = await supabase.rpc("start_paid_session", {
          _session_type: "free",
        });

        const result = rpcResult?.[0];
        if (rpcError || result?.error_msg || !result?.session_id) {
          toast.error(result?.error_msg || "Failed to start session");
          navigate("/dashboard");
          return;
        }

        const newSessionId = result.session_id;
        const startedAt = new Date().toISOString();
        setSessionId(newSessionId);
        setSessionStartedAt(startedAt);

        // Increment free_sessions_used
        await updateProfile({ free_sessions_used: 1 });

        // Create encrypted conversation with guest messages
        const guestMsgs = messagesRef.current.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.id,
        }));

        const newConvoId = await createEncryptedConversation(newSessionId, guestMsgs);
        if (newConvoId) setConversationId(newConvoId);

        // Clear sessionStorage
        sessionStorage.removeItem("guest_messages");
        sessionStorage.removeItem("guest_onboarding_complete");

        // Transition to authenticated mode
        setAuthenticated(true);
        setShowModal(false);
        setGuestLimitReached(false);

        toast.success("Session secured — you can continue chatting.");
      } catch (err) {
        console.error("Migration error:", err);
        toast.error("Something went wrong. Please try again.");
      }
    };

    migrateGuestData();
  }, [user, guestLimitReached]);

  const handleSignUpSuccess = () => {
    // The auth state listener in useAuth will trigger the migration useEffect above
  };

  const handleEndSession = async () => {
    if (sessionEnded) {
      navigate("/cooldown");
      return;
    }

    // If before 5-minute warning, send early end signal for AI wrap-up
    if (!showEndWarning) {
      const earlyEndMsg: Message = {
        id: "user-earlyend-" + Date.now(),
        role: "user",
        content: "[EARLY_END]",
      };
      const withEarlyEnd = [...messagesRef.current, earlyEndMsg];
      setMessages(withEarlyEnd);
      setIsLoading(true);

      try {
        const response = await supabase.functions.invoke("chat", {
          body: {
            messages: withEarlyEnd.map((m) => ({ role: m.role, content: m.content })),
            timeOfDay: getTimeOfDay(),
          },
        });

        const wrapUp: Message = {
          id: "assistant-wrapup-" + Date.now(),
          role: "assistant",
          content: response.data?.message || "Thank you for sharing. Take care of yourself.",
        };
        const finalMessages = [...withEarlyEnd, wrapUp];
        setMessages(finalMessages);

        if (conversationIdRef.current) {
          await saveMessages(
            conversationIdRef.current,
            finalMessages.map((m) => ({ role: m.role, content: m.content, timestamp: m.id }))
          );
        }
      } catch {
        // Continue with ending even if wrap-up fails
      } finally {
        setIsLoading(false);
      }
    } else {
      // Past 5-minute warning, just save
      if (conversationIdRef.current) {
        await saveMessages(
          conversationIdRef.current,
          messagesRef.current.map((m) => ({ role: m.role, content: m.content, timestamp: m.id }))
        );
      }
    }

    // End session in DB
    if (sessionId) {
      const elapsed = sessionStartedAt
        ? Math.floor((Date.now() - new Date(sessionStartedAt).getTime()) / 60000)
        : 0;
      await supabase
        .from("sessions")
        .update({ is_active: false, ended_at: new Date().toISOString(), duration_minutes: elapsed })
        .eq("id", sessionId);
    }

    setSessionEnded(true);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || (guestLimitReached && !authenticated) || sessionEnded) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: input.trim(),
    };

    const updatedWithUser = [...messagesRef.current, userMessage];
    setMessages(updatedWithUser);
    setInput("");
    setIsLoading(true);

    // Save to sessionStorage (guest) or DB (authenticated)
    if (!authenticated) {
      sessionStorage.setItem("guest_messages", JSON.stringify(updatedWithUser));
    } else if (conversationIdRef.current) {
      saveMessages(
        conversationIdRef.current,
        updatedWithUser.map((m) => ({ role: m.role, content: m.content, timestamp: m.id }))
      );
    }

    try {
      const messagesForAI = updatedWithUser.map((m) => ({ role: m.role, content: m.content }));

      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: messagesForAI,
          timeOfDay: getTimeOfDay(),
        },
      });

      const assistantMessage: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: response.data?.message || "I hear you. Tell me more when you're ready.",
      };

      const updatedWithAssistant = [...updatedWithUser, assistantMessage];
      setMessages(updatedWithAssistant);

      if (!authenticated) {
        sessionStorage.setItem("guest_messages", JSON.stringify(updatedWithAssistant));

        // Check if guest limit reached
        const userCount = updatedWithAssistant.filter((m) => m.role === "user").length;
        if (userCount >= MAX_GUEST_MESSAGES) {
          setGuestLimitReached(true);
          setShowModal(true);
        }
      } else if (conversationIdRef.current) {
        saveMessages(
          conversationIdRef.current,
          updatedWithAssistant.map((m) => ({ role: m.role, content: m.content, timestamp: m.id }))
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: "error-" + Date.now(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      const updatedWithError = [...updatedWithUser, errorMessage];
      setMessages(updatedWithError);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 11) return "morning";
    if (hour >= 12 && hour <= 16) return "afternoon";
    if (hour >= 17 && hour <= 20) return "evening";
    return "night";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const inputDisabled = isLoading || (guestLimitReached && !authenticated) || sessionEnded;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 md:px-8">
        <Logo />
      </header>

      {/* Messages */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col">
        <div className="max-w-2xl mx-auto space-y-6 mt-auto w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                }`}
                style={
                  message.role === "user"
                    ? { backgroundColor: "#8aaf8e", color: "#ffffff" }
                    : { backgroundColor: "#9a86be", color: "#ffffff" }
                }
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
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

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30">
        {/* Timer + End Session (authenticated only) */}
        {authenticated && timeRemaining !== null && (
          <div className="px-4 md:px-6 py-2 bg-card/30 border-b border-border/20">
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/60 transition-all duration-1000"
                  style={{ width: `${(timeRemaining / (25 * 60)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(timeRemaining)}</span>
              <Button
                onClick={handleEndSession}
                disabled={isLoading}
                variant="ghost"
                className="min-h-[44px] text-xs text-muted-foreground hover:text-foreground"
              >
                {sessionEnded ? "Return to Dashboard" : "End session"}
              </Button>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <div className="flex gap-3 items-end">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  sessionEnded
                    ? "Session ended"
                    : inputDisabled
                      ? "Create an account to continue..."
                      : "Share what's on your mind..."
                }
                className="flex-1 min-h-[48px] max-h-32 resize-none bg-card border-border/50 focus:border-primary/50 text-base"
                disabled={inputDisabled}
                autoFocus
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || inputDisabled}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Send
              </Button>
            </div>

            {/* Consent text (guest only) */}
            {!authenticated && (
              <p className="text-[11px] text-muted-foreground/60 text-center">
                By sending a message, you agree to our{" "}
                <Link to="/terms" className="underline hover:text-foreground transition-colors">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* Secure Session Modal */}
      <SecureSessionModal open={showModal} onSuccess={handleSignUpSuccess} />
    </div>
  );
};

export default GuestChat;
