import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import SecureSessionModal from "@/components/SecureSessionModal";
import GreetingMessage from "@/components/GreetingMessage";
import { useEncryptedMessages } from "@/hooks/useEncryptedMessages";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MAX_GUEST_MESSAGES = 5;

const GuestChat = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { createConversation: createEncryptedConversation, saveMessages, loadHistory } = useEncryptedMessages();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const location = useLocation();
  const initialMessageSent = useRef(false);

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

  // Retry wrapper for edge function calls — handles mobile connection drops
  const invokeWithRetry = async (functionName: string, body: any, retries = 1) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await supabase.functions.invoke(functionName, { body });
        if (response.error) throw response.error;
        return response;
      } catch (error) {
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        throw error;
      }
    }
  };
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
  const [pastConversations, setPastConversations] = useState<
    Array<{ messages: Array<{ role: string; content: string }> }>
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const conversationIdRef = useRef<string | null>(null);
  const pendingSaveRef = useRef<Message[] | null>(null);
  const migrationDoneRef = useRef(false);

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

  // Centralised save helper with pending queue (mirrors Mirror.tsx)
  const saveMessagesToDb = async (updatedMessages: Message[]) => {
    const cId = conversationIdRef.current;
    if (!cId) {
      pendingSaveRef.current = updatedMessages;
      return;
    }
    const conversationMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.id,
    }));
    await saveMessages(cId, conversationMessages);
  };

  // Load guest messages or show greeting
  useEffect(() => {
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

    if (!saved) {
      const greeting: Message = {
        id: "greeting",
        role: "assistant",
        content: "greeting_placeholder",
      };
      setMessages([greeting]);
      sessionStorage.setItem("guest_messages", JSON.stringify([greeting]));
    }
  }, []);

  // Keep refs in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Flush pending saves when conversationId becomes available
  useEffect(() => {
    conversationIdRef.current = conversationId;
    if (conversationId && pendingSaveRef.current) {
      const pending = pendingSaveRef.current;
      pendingSaveRef.current = null;
      saveMessagesToDb(pending);
    }
  }, [conversationId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Timer for authenticated session (mirrors Mirror.tsx)
  useEffect(() => {
    if (!authenticated || !sessionStartedAt) return;

    const sessionDuration = 25 * 60;
    const startTime = new Date(sessionStartedAt).getTime();
    const endTime = startTime + sessionDuration * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);

      // 5-minute warning with assistant message injection
      if (remaining <= 300 && remaining > 0 && !showEndWarning) {
        setShowEndWarning(true);
        const warningMsg: Message = {
          id: "warning-" + Date.now(),
          role: "assistant",
          content:
            "We have about 5 minutes left. Take your time to share anything else on your mind, or we can begin to wrap up.",
        };
        setMessages((prev) => {
          const updated = [...prev, warningMsg];
          saveMessagesToDb(updated);
          return updated;
        });
      }

      if (remaining <= 0 && !sessionEnded) {
        setSessionEnded(true);
        saveMessagesToDb(messagesRef.current);
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
        await updateProfile({
          has_completed_onboarding: true,
          has_acknowledged_terms: true,
          has_acknowledged_privacy_policy: true,
          has_acknowledged_ai_disclosure: true,
          onboarding_completed_at: new Date().toISOString(),
        });

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

        await updateProfile({ free_sessions_used: 1 });

        const guestMsgs = messagesRef.current.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.id,
        }));

        const newConvoId = await createEncryptedConversation(newSessionId, guestMsgs);
        if (newConvoId) setConversationId(newConvoId);

        // Load past conversations for AI context
        const conversations = await loadHistory();
        setPastConversations(conversations as Array<{ messages: Array<{ role: string; content: string }> }>);

        sessionStorage.removeItem("guest_messages");
        sessionStorage.removeItem("guest_onboarding_complete");
        sessionStorage.removeItem("guest_email");

        // Fire-and-forget welcome email
        if (user.email) {
          supabase.functions.invoke("send-welcome-email", { body: { email: user.email } }).catch(() => {});
        }

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
      setSessionEnded(true);
      setIsLoading(true);

      try {
        const messagesForAI = messagesRef.current.map((m) => ({ role: m.role, content: m.content }));
        messagesForAI.push({
          role: "user",
          content: "[EARLY_END] The user has chosen to end the session early. Please provide a warm wrap-up.",
        });

        const response = await invokeWithRetry("chat", {
          messages: messagesForAI,
          pastConversations: pastConversations,
          userName: profile?.display_name || undefined,
          nameDeclined: profile?.name_declined || false,
          timeOfDay: getTimeOfDay(),
        });

        const wrapUp: Message = {
          id: "wrapup-" + Date.now(),
          role: "assistant",
          content: response.data?.message || "Thank you for sharing. Take care of yourself.",
        };
        const finalMessages = [...messagesRef.current, wrapUp];
        setMessages(finalMessages);
        await saveMessagesToDb(finalMessages);
      } catch {
        // Continue with ending even if wrap-up fails
      } finally {
        setIsLoading(false);
      }
    } else {
      setSessionEnded(true);
      await saveMessagesToDb(messagesRef.current);
    }

    // End session in DB
    if (sessionId) {
      const elapsed = sessionStartedAt ? Math.floor((Date.now() - new Date(sessionStartedAt).getTime()) / 60000) : 0;
      await supabase
        .from("sessions")
        .update({ is_active: false, ended_at: new Date().toISOString(), duration_minutes: elapsed })
        .eq("id", sessionId);
    }
  };

  // Auto-send initial message from homepage chat input
  useEffect(() => {
    const initialMessage = (location.state as any)?.initialMessage;
    if (initialMessage && !initialMessageSent.current && !authLoading) {
      initialMessageSent.current = true;
      window.history.replaceState({}, document.title);
      setTimeout(() => handleSend(initialMessage), 300);
    }
  }, [authLoading, location.state]);

  const handleSend = async (overrideMessage?: string) => {
    const text = overrideMessage || input.trim();
    if (!text || isLoading || (guestLimitReached && !authenticated) || sessionEnded) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
    };

    const updatedWithUser = [...messagesRef.current, userMessage];
    setMessages(updatedWithUser);
    setInput("");
    setIsLoading(true);

    // Save to sessionStorage (guest) or DB (authenticated)
    if (!authenticated) {
      sessionStorage.setItem("guest_messages", JSON.stringify(updatedWithUser));
    } else {
      saveMessagesToDb(updatedWithUser);
    }

    try {
      const messagesForAI = updatedWithUser.map((m) => ({ role: m.role, content: m.content }));

      // Add wrap-up indicator if in final 5 minutes (mirrors Mirror.tsx)
      if (authenticated && showEndWarning && messagesForAI.length > 0) {
        const lastMsg = messagesForAI[messagesForAI.length - 1];
        lastMsg.content = `[5 MINUTE WARNING] ${lastMsg.content}`;
      }

      const response = await invokeWithRetry("chat", {
        messages: messagesForAI,
        pastConversations: pastConversations,
        userName: profile?.display_name || undefined,
        nameDeclined: profile?.name_declined || false,
        timeOfDay: getTimeOfDay(),
      });

      // Handle name detection from AI (authenticated only, mirrors Mirror.tsx)
      if (authenticated) {
        if (response.data?.detectedName && !profile?.display_name) {
          updateProfile({ display_name: response.data.detectedName, name_declined: false });
        }
        if (response.data?.nameDeclined && !profile?.name_declined) {
          updateProfile({ name_declined: true });
        }
      }

      const assistantMessage: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: response.data?.message || "I hear you. Tell me more when you're ready.",
      };

      const updatedWithAssistant = [...updatedWithUser, assistantMessage];
      setMessages(updatedWithAssistant);

      if (!authenticated) {
        sessionStorage.setItem("guest_messages", JSON.stringify(updatedWithAssistant));
        const userCount = updatedWithAssistant.filter((m) => m.role === "user").length;
        if (userCount >= MAX_GUEST_MESSAGES) {
          setGuestLimitReached(true);
          setShowModal(true);
          trackEvent("signup_modal_shown", { message_count: userCount });
        }
      } else {
        saveMessagesToDb(updatedWithAssistant);

        // Handle END_SESSION flag (crisis detection, mirrors Mirror.tsx)
        if (response.data?.endSession && sessionId) {
          setSessionEnded(true);
          await saveMessagesToDb(updatedWithAssistant);
          await supabase
            .from("sessions")
            .update({ is_active: false, ended_at: new Date().toISOString() })
            .eq("id", sessionId);
        }
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

  const inputDisabled = isLoading || (guestLimitReached && !authenticated) || sessionEnded;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f3" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b px-4 py-2 md:px-8"
        style={{ backgroundColor: "#f8f6f3", borderColor: "#e8e1d9" }}
      >
        <Logo />
      </header>

      {/* Messages */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 py-8 flex flex-col">
        <div className="max-w-2xl mx-auto space-y-5 mt-auto w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl ${
                  message.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                }`}
                style={
                  message.role === "user"
                    ? {
                        backgroundColor: "#d6e8d7",
                        color: "#2c2c2c",
                      }
                    : {
                        backgroundColor: "#ede8f5",
                        color: "#2c2c2c",
                        border: "1px solid rgba(203, 183, 175, 0.3)",
                      }
                }
              >
                {message.id === "greeting" ? (
                  <GreetingMessage />
                ) : (
                  <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: "#2c2c2c" }}>
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{
                  backgroundColor: "#ede8f5",
                  border: "1px solid rgba(203, 183, 175, 0.3)",
                }}
              >
                <div className="flex gap-1.5 items-center">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "#9a86be", opacity: 0.5 }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-pulse delay-100"
                    style={{ backgroundColor: "#9a86be", opacity: 0.5 }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-pulse delay-200"
                    style={{ backgroundColor: "#9a86be", opacity: 0.5 }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10" style={{ borderTop: "1px solid #e8e1d9" }}>
        {/* Timer + End Session (authenticated only) */}
        {authenticated && timeRemaining !== null && (
          <div className="px-4 md:px-6 py-2" style={{ backgroundColor: "#f8f6f3", borderBottom: "1px solid #f0ece6" }}>
            <div className="max-w-2xl mx-auto space-y-2">
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#e8e1d9" }}>
                  <div
                    className="h-full transition-all duration-1000 rounded-full"
                    style={{
                      width: `${(timeRemaining / (25 * 60)) * 100}%`,
                      backgroundColor: timeRemaining <= 300 ? "#c4a882" : "#7aab80",
                    }}
                  />
                </div>
                <span className="text-xs whitespace-nowrap" style={{ color: "#8a8278" }}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={sessionEnded ? () => navigate("/cooldown") : handleEndSession}
                  disabled={isLoading}
                  className="text-sm px-3 py-2 rounded-lg transition-colors min-h-[40px]"
                  style={{ color: "#8a8278" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#2c2c2c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}
                >
                  {sessionEnded ? "Return to Dashboard" : "End session"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-4 md:p-5" style={{ backgroundColor: "#f8f6f3" }}>
          <div className="max-w-2xl mx-auto space-y-2">
            <div className="flex gap-3 items-end">
              <textarea
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
                className="flex-1 min-h-[48px] max-h-32 resize-none rounded-xl px-4 py-3 text-base outline-none transition-colors"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e1d9",
                  color: "#2c2c2c",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7aab80")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e8e1d9")}
                disabled={inputDisabled}
                autoFocus
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || inputDisabled}
                className="shrink-0 px-5 h-11 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: !input.trim() || inputDisabled ? "#c8deca" : "#4a7a4f",
                  color: !input.trim() || inputDisabled ? "#8aaf8e" : "#ffffff",
                  cursor: !input.trim() || inputDisabled ? "not-allowed" : "pointer",
                  border: "none",
                }}
                onMouseEnter={(e) => {
                  if (!(!input.trim() || inputDisabled)) {
                    e.currentTarget.style.backgroundColor = "#3d6642";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(!input.trim() || inputDisabled)) {
                    e.currentTarget.style.backgroundColor = "#4a7a4f";
                  }
                }}
              >
                Send
              </button>
            </div>

            {/* Consent text + End session (guest only) */}
            {!authenticated && (
              <div className="space-y-1">
                <p className="text-[11px] text-center" style={{ color: "rgba(138, 130, 120, 0.7)" }}>
                  By sending a message, you agree to our{" "}
                  <Link
                    to="/terms"
                    className="underline transition-colors"
                    style={{ color: "rgba(138, 130, 120, 0.7)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2c2c2c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(138, 130, 120, 0.7)")}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="underline transition-colors"
                    style={{ color: "rgba(138, 130, 120, 0.7)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2c2c2c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(138, 130, 120, 0.7)")}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem("guest_messages");
                      sessionStorage.removeItem("guest_onboarding_complete");
                      sessionStorage.removeItem("guest_email");
                      sessionStorage.removeItem("sh_disclosure_accepted");
                      navigate("/");
                    }}
                    className="text-xs transition-colors py-1 min-h-[44px] flex items-center"
                    style={{ color: "#8a8278" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#2c2c2c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8278")}
                  >
                    End session
                  </button>
                </div>
              </div>
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
