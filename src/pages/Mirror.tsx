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
import { useEncryptedMessages } from "@/hooks/useEncryptedMessages";

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
  const { createConversation: createEncryptedConversation, saveMessages, loadSessionMessages, loadHistory } = useEncryptedMessages();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showEndWarning, setShowEndWarning] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [pastConversations, setPastConversations] = useState<Array<{ messages: Array<{ role: string; content: string }> }>>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initRef = useRef(false);

  // Build personalised greeting based on profile state
  const getGreeting = () => {
    if (profile?.display_name) {
      return `Hello, ${profile.display_name}. Welcome back. I'm here to listen. Take your time — there's no rush. What's on your mind today?`;
    }
    if (profile?.name_declined) {
      return "Hello. Welcome back. I'm here to listen. Take your time — there's no rush. What's on your mind today?";
    }
    return "Hello. I'm here to listen. Take your time — there's no rush. What's on your mind today?";
  };

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
      const conversations = await loadHistory();
      setPastConversations(conversations as Array<{ messages: Array<{ role: string; content: string }> }>);
    };
    
    fetchPastConversations();
  }, [user]);

  // Resume existing active session or start a new one
  useEffect(() => {
    if (!user || sessionStarted || sessionsLoading || initRef.current) return;
    initRef.current = true;

    const initOrResumeSession = async () => {
      // If there's already an active session, try to resume it
      if (activeSession) {
        const startTime = new Date(activeSession.started_at).getTime();
        const duration = activeSession.session_type === "paid" ? 45 * 60 : 25 * 60;
        const endTime = startTime + duration * 1000;

        if (Date.now() >= endTime) {
          // Session expired while away — auto-end and redirect
          await endSession(activeSession.id);
          navigate("/cooldown");
          return;
        }

        // Session still has time — load existing messages
        const existingConvos = await loadSessionMessages(activeSession.id);

        const existingConvo = existingConvos.find((c) => 
          Array.isArray(c.messages) && c.messages.length > 1
        ) || existingConvos[0] || null;

        if (existingConvo && Array.isArray(existingConvo.messages) && existingConvo.messages.length > 0) {
          // Resume with existing messages
          const loadedMessages: Message[] = (existingConvo.messages as Array<{ role: string; content: string; timestamp?: string }>).map((m, i) => ({
            id: m.timestamp || `loaded-${i}`,
            role: m.role as "user" | "assistant",
            content: m.content,
          }));
          setMessages(loadedMessages);
          setConversationId(existingConvo.id);
        } else {
          // Active session but no conversation yet — show greeting
          const greetingText = getGreeting();
          setMessages([
            {
              id: "greeting",
              role: "assistant",
              content: greetingText,
            },
          ]);
          // Create conversation record
          const newConvoId = await createEncryptedConversation(activeSession.id, [
            { role: "assistant", content: greetingText, timestamp: "greeting" },
          ]);
          if (newConvoId) setConversationId(newConvoId);
        }

        setSessionStarted(true);
        return;
      }

      // No active session — start a new one
      if (!canStartSession) {
        toast.error("You need to wait before starting another session");
        navigate("/dashboard");
        return;
      }

      const freeRemaining = profile ? Math.max(0, 2 - (profile.free_sessions_used || 0)) : 0;
      const sessionType = freeRemaining > 0 ? "free" : "paid";

      if (sessionType === "paid" && (!credits || credits.balance <= 0)) {
        toast.error("You need credits to start a session");
        navigate("/credits");
        return;
      }

      const { error, session } = await startSession(sessionType);
      if (error || !session) {
        toast.error("Failed to start session");
        navigate("/dashboard");
        return;
      }

      if (sessionType === "free" && profile) {
        await updateProfile({ free_sessions_used: (profile.free_sessions_used || 0) + 1 });
      }

      if (sessionType === "paid" && credits) {
        await supabase
          .from("credits")
          .update({ balance: credits.balance - 1 })
          .eq("user_id", user.id);
      }

      setSessionStarted(true);

      const greetingText = getGreeting();
      const greetingMessage = {
        id: "greeting",
        role: "assistant" as const,
        content: greetingText,
      };
      setMessages([greetingMessage]);

      // Create conversation record immediately
      const newConvoId = await createEncryptedConversation(session.id, [
        { role: "assistant", content: greetingText, timestamp: greetingMessage.id },
      ]);
      if (newConvoId) setConversationId(newConvoId);
    };

    initOrResumeSession();
  }, [user, sessionsLoading, sessionStarted]);

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

      // End session when timer hits 0 — stay on page
      if (remaining <= 0 && !sessionEnded) {
        setSessionEnded(true);
        if (activeSession) {
          if (conversationId) {
            const conversationMessages = messages.map(m => ({
              role: m.role,
              content: m.content,
              timestamp: m.id
            }));
            saveMessages(conversationId, conversationMessages);
          }
          endSession(activeSession.id);
        }
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
    if (!sessionEnded && activeSession && user) {
      if (conversationId) {
        const conversationMessages = messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.id
        }));
        await saveMessages(conversationId, conversationMessages);
      }
      await endSession(activeSession.id);
    }
    navigate("/cooldown");
  };

  // Helper to save messages to the database incrementally
  const saveMessagesToDb = async (updatedMessages: Message[]) => {
    if (!conversationId) return;
    const conversationMessages = updatedMessages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.id
    }));
    await saveMessages(conversationId, conversationMessages);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: input.trim(),
    };

    const updatedWithUser = [...messages, userMessage];
    setMessages(updatedWithUser);
    setInput("");
    setIsLoading(true);

    // Save user message immediately
    saveMessagesToDb(updatedWithUser);

    try {
      // Prepare messages with wrap-up indicator if in final 5 minutes
      const messagesForAI = updatedWithUser.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      
      // Add wrap-up indicator to the latest user message if in wrap-up mode
      if (showEndWarning && messagesForAI.length > 0) {
        const lastMsg = messagesForAI[messagesForAI.length - 1];
        lastMsg.content = `[5 MINUTE WARNING] ${lastMsg.content}`;
      }

      // Call the AI chat edge function with past conversations and name context
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: messagesForAI,
          pastConversations: pastConversations,
          userName: profile?.display_name || undefined,
          nameDeclined: profile?.name_declined || false,
        },
      });

      // Handle name detection from AI response
      if (response.data?.detectedName && !profile?.display_name) {
        updateProfile({ display_name: response.data.detectedName, name_declined: false });
      }
      if (response.data?.nameDeclined && !profile?.name_declined) {
        updateProfile({ name_declined: true });
      }

      const assistantMessage: Message = {
        id: "assistant-" + Date.now(),
        role: "assistant",
        content: response.data.message || "I hear you. Tell me more when you're ready.",
      };

      const updatedWithAssistant = [...updatedWithUser, assistantMessage];
      setMessages(updatedWithAssistant);

      // Save assistant message
      saveMessagesToDb(updatedWithAssistant);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: "error-" + Date.now(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      const updatedWithError = [...updatedWithUser, errorMessage];
      setMessages(updatedWithError);
      saveMessagesToDb(updatedWithError);
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
      <header className="relative z-10 px-4 md:px-6 py-[10px] border-b border-border/30">
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
                    ? "rounded-br-md"
                    : "rounded-bl-md"
                }`}
                style={
                  message.role === "user"
                    ? { backgroundColor: '#8aaf8e', color: '#ffffff' }
                    : { backgroundColor: '#9a86be', color: '#ffedd5' }
                }
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
                onClick={sessionEnded ? () => navigate("/cooldown") : handleEndSession}
                className="text-xs text-muted-foreground"
              >
                {sessionEnded ? "Return to Dashboard" : "End session"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-4 md:p-6">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              className="flex-1 min-h-[48px] max-h-32 resize-none bg-card border-border/50 focus:border-primary/50"
              disabled={isLoading || sessionEnded}
              autoFocus
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || sessionEnded}
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
