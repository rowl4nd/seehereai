import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { useEncryptedMessages } from "@/hooks/useEncryptedMessages";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MAX_GUEST_MESSAGES = 5;

// Helper to render markdown-style links in chat messages
const renderMessageContent = (content: string) => {
  const parts = content.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target={linkMatch[2].startsWith("/") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="underline transition-colors"
          style={{ color: "#4a7a4f" }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const GuestChat = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { createConversation: createEncryptedConversation, saveMessages, loadHistory } = useEncryptedMessages();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const location = useLocation();
  const initialMessageSent = useRef(false);
  const firstUserMessageTracked = useRef(false);

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

  // Retry wrapper for edge function calls
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
  const [guestLimitReached, setGuestLimitReached] = useState(false);
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const [finalChance, setFinalChance] = useState(() => sessionStorage.getItem("sh_final_chance") === "true");

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

  // Centralised save helper
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

  // Opening messages
  const WELCOME_MESSAGES: Message[] = [
    {
      id: "welcome-disclosure",
      role: "assistant",
      content:
        "Welcome to SeeHere. I'm a warm, AI-powered listening companion — not a therapist. By continuing, you acknowledge our [Terms & Conditions](/terms) and [Privacy Policy](/privacy). If you're in immediate distress, please call [116 123](tel:116123) (Samaritans) or [999](tel:999).",
    },
    {
      id: "returning-user",
      role: "assistant",
      content: "Been here before? [Log in](/auth) to pick up where you left off.",
    },
    {
      id: "opening-invitation",
      role: "assistant",
      content: "When you're ready, what's been on your mind?",
    },
  ];

  // Load guest messages or show welcome messages
  useEffect(() => {
    const saved = sessionStorage.getItem("guest_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[];
        setMessages(parsed);
        const userCount = parsed.filter((m) => m.role === "user").length;
        if (userCount >= MAX_GUEST_MESSAGES) {
          setGuestLimitReached(true);
          // Check if we're awaiting email
          const awaitingState = sessionStorage.getItem("sh_awaiting_email");
          if (awaitingState === "true") {
            setAwaitingEmail(true);
          }
        }
      } catch {
        // ignore
      }
    }

    if (!saved) {
      setMessages(WELCOME_MESSAGES);
      sessionStorage.setItem("guest_messages", JSON.stringify(WELCOME_MESSAGES));
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

  // Timer for authenticated session
  useEffect(() => {
    if (!authenticated || !sessionStartedAt) return;

    const sessionDuration = 25 * 60;
    const startTime = new Date(sessionStartedAt).getTime();
    const endTime = startTime + sessionDuration * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);

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

  // After auth state changes (user signs up via email in chat), migrate guest data
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

        const conversations = await loadHistory();
        setPastConversations(conversations as Array<{ messages: Array<{ role: string; content: string }> }>);

        sessionStorage.removeItem("guest_messages");
        sessionStorage.removeItem("guest_onboarding_complete");
        sessionStorage.removeItem("guest_email");
        sessionStorage.removeItem("sh_awaiting_email");
        sessionStorage.removeItem("sh_final_chance");

        // Fire-and-forget welcome email
        if (user.email) {
          supabase.functions.invoke("send-welcome-email", { body: { email: user.email } }).catch(() => {});
        }

        // Trigger password reset email so user can set their password
        if (user.email) {
          supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/reset-password`,
          }).catch(() => {});
        }

        setAuthenticated(true);
        setGuestLimitReached(false);
        setAwaitingEmail(false);

        // Inject confirmation message
        const confirmMsg: Message = {
          id: "account-confirmed-" + Date.now(),
          role: "assistant",
          content: `Your session is saved. I've sent a welcome email to ${user.email} — you can set your password there anytime. Let's keep going.`,
        };
        setMessages((prev) => [...prev, confirmMsg]);

        toast.success("Session secured — you can continue chatting.");
      } catch (err) {
        console.error("Migration error:", err);
        toast.error("Something went wrong. Please try again.");
      }
    };

    migrateGuestData();
  }, [user, guestLimitReached]);

  const handleEndSession = async () => {
    if (sessionEnded) {
      navigate("/cooldown");
      return;
    }

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

  // Handle email signup in chat
  const handleEmailSignup = async (email: string) => {
    setIsLoading(true);
    try {
      const randomPassword = crypto.randomUUID();
      const { error } = await supabase.auth.signUp({
        email,
        password: randomPassword,
        options: { emailRedirectTo: window.location.origin },
      });

      if (error) {
        const errorMsg: Message = {
          id: "email-error-" + Date.now(),
          role: "assistant",
          content: `I wasn't able to save with that email — ${error.message}. Could you try again?`,
        };
        setMessages((prev) => {
          const updated = [...prev, errorMsg];
          sessionStorage.setItem("guest_messages", JSON.stringify(updated));
          return updated;
        });
        setIsLoading(false);
        return;
      }

      trackEvent("account_created", { method: "email_in_chat" });
      // The auth state change listener will trigger migrateGuestData
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle refusal to provide email
  const handleEmailRefusal = () => {
    trackEvent("signup_modal_dismissed");
    const closingMsg: Message = {
      id: "session-close-" + Date.now(),
      role: "assistant",
      content:
        "I understand. Thank you for sharing with me today — what you said matters, even if it isn't saved. Take care of yourself.",
    };
    setMessages((prev) => {
      const updated = [...prev, closingMsg];
      sessionStorage.setItem("guest_messages", JSON.stringify(updated));
      return updated;
    });
    setSessionEnded(true);
    setAwaitingEmail(false);
    setFinalChance(false);
    sessionStorage.removeItem("sh_awaiting_email");
    sessionStorage.removeItem("sh_final_chance");
    // Clean up after a moment
    setTimeout(() => {
      sessionStorage.removeItem("guest_messages");
      sessionStorage.removeItem("guest_onboarding_complete");
      sessionStorage.removeItem("guest_email");
    }, 5000);
  };

  const handleSend = async (overrideMessage?: string) => {
    const text = overrideMessage || input.trim();
    if (!text || isLoading || sessionEnded) return;

    // If we're awaiting email input
    if (awaitingEmail && !authenticated) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const userMsg: Message = { id: "user-" + Date.now(), role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      if (emailRegex.test(text.trim())) {
        sessionStorage.setItem("guest_email", text.trim());
        await handleEmailSignup(text.trim());
      } else if (!finalChance) {
        // First refusal — offer last chance
        setFinalChance(true);
        sessionStorage.setItem("sh_final_chance", "true");
        const lastChanceMsg: Message = {
          id: "last-chance-" + Date.now(),
          role: "assistant",
          content: "No problem at all. If you change your mind, just type your email address below — otherwise feel free to close this tab whenever you're ready.",
        };
        setMessages((prev) => {
          const updated = [...prev, lastChanceMsg];
          sessionStorage.setItem("guest_messages", JSON.stringify(updated));
          return updated;
        });
      } else {
        // Second refusal — end session
        handleEmailRefusal();
      }
      return;
    }

    // Normal guest limit check
    if (guestLimitReached && !authenticated) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
    };

    const updatedWithUser = [...messagesRef.current, userMessage];
    setMessages(updatedWithUser);
    setInput("");
    setIsLoading(true);

    // Track first user message as disclosure_accepted
    if (!firstUserMessageTracked.current && !authenticated) {
      firstUserMessageTracked.current = true;
      trackEvent("disclosure_accepted");
    }

    // Track message event
    if (authenticated) {
      const userMsgCount = updatedWithUser.filter((m) => m.role === "user").length;
      trackEvent("session_message_sent", { session_id: sessionId, message_number: userMsgCount });
    }

    // Save to sessionStorage (guest) or DB (authenticated)
    if (!authenticated) {
      sessionStorage.setItem("guest_messages", JSON.stringify(updatedWithUser));
    } else {
      saveMessagesToDb(updatedWithUser);
    }

    try {
      const messagesForAI = updatedWithUser.map((m) => ({ role: m.role, content: m.content }));

      // Add wrap-up indicator if in final 5 minutes
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

      // Handle name detection from AI (authenticated only)
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

          // Inject email collection message
          const emailPrompt: Message = {
            id: "email-prompt-" + Date.now(),
            role: "assistant",
            content:
              "You've shared some really meaningful things. I'd love for you to be able to come back and continue. If you'd like to save this conversation and unlock your 2nd free session, just type your email address below. If you'd prefer not to, that's completely okay — but I won't be able to save what we've talked about, and our conversation will end here.",
          };
          const withPrompt = [...updatedWithAssistant, emailPrompt];
          setMessages(withPrompt);
          sessionStorage.setItem("guest_messages", JSON.stringify(withPrompt));
          setAwaitingEmail(true);
          sessionStorage.setItem("sh_awaiting_email", "true");
          trackEvent("signup_prompt_shown", { message_count: userCount });
        }
      } else {
        saveMessagesToDb(updatedWithAssistant);

        // Handle END_SESSION flag (crisis detection)
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

  const inputDisabled = isLoading || sessionEnded;

  // Special message IDs that need link rendering
  const LINK_MESSAGE_IDS = ["welcome-disclosure", "returning-user", "email-prompt-"];

  const shouldRenderLinks = (messageId: string) => {
    return LINK_MESSAGE_IDS.some((id) => messageId.startsWith(id));
  };

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
                <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: "#2c2c2c" }}>
                  {shouldRenderLinks(message.id) || message.id.startsWith("account-confirmed-")
                    ? renderMessageContent(message.content)
                    : message.content}
                </p>
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
                    : awaitingEmail
                      ? finalChance
                        ? "Enter your email or close this tab..."
                        : "Type your email address, or anything else to end..."
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

            {/* End session (guest only) */}
            {!authenticated && !sessionEnded && (
              <div className="space-y-1">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem("guest_messages");
                      sessionStorage.removeItem("guest_onboarding_complete");
                      sessionStorage.removeItem("guest_email");
                      sessionStorage.removeItem("sh_awaiting_email");
                      sessionStorage.removeItem("sh_final_chance");
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
    </div>
  );
};

export default GuestChat;
