import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, signUp, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const switchMode = (target: "login" | "signup") => {
    if (isAnimating || mode === target) return;
    setIsAnimating(true);
    setEmail("");
    setPassword("");
    setForgotMode(false);
    setTimeout(() => {
      setMode(target);
      setTimeout(() => setIsAnimating(false), 500);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (forgotMode) {
        const { error } = await resetPassword(email);
        if (error) toast.error(error.message);
        else {
          toast.success("Check your email for a reset link");
          setForgotMode(false);
        }
      } else if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) toast.error(error.message);
        else {
          toast.success("Welcome back");
          navigate("/dashboard");
        }
      } else {
        const { data: isAllowed } = await supabase.rpc("is_email_allowed", { _email: email });
        if (!isAllowed) {
          toast.error("Registration is currently invite-only. Please contact us for access.");
          return;
        }
        const { error } = await signUp(email, password);
        if (error) toast.error(error.message);
        else {
          toast.success("Welcome to See Here");
          supabase.functions.invoke("send-welcome-email", { body: { email } }).catch(() => {});
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLogin = mode === "login";

  // ── SHARED FORM FIELDS ──────────────────────────────
  const LoginForm = () => (
    <form onSubmit={handleSubmit} style={s.form}>
      <div style={s.formHeader}>
        <h2 style={s.formTitle}>{forgotMode ? "Reset password" : "Welcome back"}</h2>
        <p style={s.formSubtitle}>{forgotMode ? "We'll send you a reset link" : "Take your time"}</p>
      </div>
      <div style={s.fieldGroup}>
        <label style={s.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          style={s.input}
          onFocus={(e) => (e.target.style.borderColor = "#709474")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
        />
      </div>
      {!forgotMode && (
        <div style={s.fieldGroup}>
          <label style={s.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
            style={s.input}
            onFocus={(e) => (e.target.style.borderColor = "#709474")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
          />
        </div>
      )}
      <div style={{ textAlign: "right" as const }}>
        {!forgotMode ? (
          <button type="button" onClick={() => setForgotMode(true)} style={s.textBtn}>
            Forgot password?
          </button>
        ) : (
          <button type="button" onClick={() => setForgotMode(false)} style={s.textBtn}>
            ← Back to sign in
          </button>
        )}
      </div>
      <button type="submit" disabled={isSubmitting} style={s.submitBtn("#709474")}>
        {isSubmitting ? "Please wait..." : forgotMode ? "Send reset link" : "Sign in"}
      </button>
    </form>
  );

  const SignupForm = () => (
    <form onSubmit={handleSubmit} style={s.form}>
      <div style={s.formHeader}>
        <h2 style={s.formTitle}>Begin your journey</h2>
        <p style={s.formSubtitle}>Create a space for yourself</p>
      </div>
      <div style={s.fieldGroup}>
        <label style={s.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          style={s.input}
          onFocus={(e) => (e.target.style.borderColor = "#8775aa")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
        />
      </div>
      <div style={s.fieldGroup}>
        <label style={s.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="••••••••"
          style={s.input}
          onFocus={(e) => (e.target.style.borderColor = "#8775aa")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
        />
      </div>
      <button type="submit" disabled={isSubmitting} style={{ ...s.submitBtn("#8775aa"), marginTop: "4px" }}>
        {isSubmitting ? "Please wait..." : "Create account"}
      </button>
    </form>
  );

  // ── MOBILE LAYOUT ────────────────────────────────────
  const MobileLayout = () => (
    <main style={s.mobileMain}>
      <div style={s.mobileCard}>
        {/* Tab switcher */}
        <div style={s.tabRow}>
          <button
            onClick={() => switchMode("login")}
            style={{
              ...s.tab,
              borderBottom: isLogin ? "2px solid #709474" : "2px solid transparent",
              color: isLogin ? "#709474" : "#aaa",
            }}
          >
            <span style={{ fontSize: "14px", display: "block" }}>
              Nice to <span style={{ color: "#709474", fontWeight: 700 }}>See</span> you again
            </span>
            <span style={{ fontSize: "11px", color: "#bbb" }}>Sign in</span>
          </button>
          <button
            onClick={() => switchMode("signup")}
            style={{
              ...s.tab,
              borderBottom: !isLogin ? "2px solid #8775aa" : "2px solid transparent",
              color: !isLogin ? "#8775aa" : "#aaa",
            }}
          >
            <span style={{ fontSize: "14px", display: "block" }}>
              First time <span style={{ color: "#8775aa", fontWeight: 700 }}>Here</span>?
            </span>
            <span style={{ fontSize: "11px", color: "#bbb" }}>Create account</span>
          </button>
        </div>

        {/* Form area */}
        <div style={s.mobileFormArea}>
          <div
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? "translateY(6px)" : "translateY(0)",
              transition: "all 0.3s ease",
            }}
          >
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
      </div>
    </main>
  );

  // ── DESKTOP LAYOUT ───────────────────────────────────
  const DesktopLayout = () => (
    <main style={s.main}>
      <div style={s.rectangle}>
        {/* Left panel */}
        <div style={{ ...s.panel }}>
          <div style={s.formPanel}>
            <LoginForm />
          </div>
        </div>

        {/* Right panel */}
        <div style={{ ...s.panel }}>
          <div style={s.formPanel}>
            <SignupForm />
          </div>
        </div>

        {/* Sliding card */}
        <div
          style={
            {
              ...s.slidingCard,
              left: isLogin ? "50%" : "0%",
              background: isLogin
                ? "linear-gradient(135deg, #cbb7ef 0%, #b9a3e0 100%)"
                : "linear-gradient(135deg, #8daa90 0%, #709474 100%)",
              borderRadius: isLogin ? "0 16px 16px 0" : "16px 0 0 16px",
              transition: "left 0.65s cubic-bezier(0.77, 0, 0.175, 1), background 0.65s ease, border-radius 0.4s ease",
            } as React.CSSProperties
          }
        >
          <div style={s.deco1} />
          <div style={s.deco2} />

          <div style={s.cardContent}>
            {/* Card shown when on right (login mode) */}
            <div
              style={{
                ...s.cardInner,
                opacity: isLogin ? 1 : 0,
                transform: isLogin ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease 0.2s",
                pointerEvents: isLogin ? ("auto" as const) : ("none" as const),
                position: "absolute" as const,
              }}
            >
              <p style={s.cardEyebrow}>New here?</p>
              <h3 style={s.cardHeading}>Join SeeHere</h3>
              <p style={s.cardBody}>A quiet space to think out loud, with a companion that listens.</p>
              <button
                onClick={() => switchMode("signup")}
                style={s.cardBtn}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.25)";
                  (e.target as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                  (e.target as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Create account
              </button>
            </div>

            {/* Card shown when on left (signup mode) */}
            <div
              style={{
                ...s.cardInner,
                opacity: !isLogin ? 1 : 0,
                transform: !isLogin ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease 0.2s",
                pointerEvents: !isLogin ? ("auto" as const) : ("none" as const),
                position: "absolute" as const,
              }}
            >
              <p style={s.cardEyebrow}>Already have an account?</p>
              <h3 style={s.cardHeading}>Welcome back</h3>
              <p style={s.cardBody}>Good to see you again. Your space is waiting.</p>
              <button
                onClick={() => switchMode("login")}
                style={s.cardBtn}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.25)";
                  (e.target as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                  (e.target as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <div style={s.page}>
      <header style={s.header}>
        <Logo />
      </header>

      <div style={s.banner}>
        <p style={s.bannerText}>
          <span style={{ fontWeight: 600 }}>Beta Testing Phase</span> — We're limiting early access to ensure quality.{" "}
          <a href="/#beta-signup" style={s.bannerLink}>
            Join our first 50 testers
          </a>
          .
        </p>
      </div>

      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};

// ── Styles ──────────────────────────────────────────────

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    background: "#f8f6f3",
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  header: {
    padding: "10px 32px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    background: "rgba(248,246,243,0.95)",
    backdropFilter: "blur(8px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
  },
  banner: {
    background: "linear-gradient(to right, rgba(203,183,239,0.2), rgba(177,207,172,0.2))",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    padding: "6px 24px",
    textAlign: "center" as const,
  },
  bannerText: {
    fontSize: "13px",
    color: "#555",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  },
  bannerLink: {
    color: "#4a7a4f",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },

  // ── Desktop ──
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  rectangle: {
    position: "relative" as const,
    width: "min(860px, 100%)",
    height: "520px",
    background: "rgba(255,253,250,0.9)",
    borderRadius: "16px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    overflow: "hidden" as const,
    display: "flex",
  },
  panel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 52px",
    position: "relative" as const,
  },
  formPanel: {
    width: "100%",
    maxWidth: "320px",
  },
  slidingCard: {
    position: "absolute" as const,
    top: 0,
    width: "50%",
    height: "100%",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden" as const,
  },
  deco1: {
    position: "absolute" as const,
    top: "-60px",
    right: "-60px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    pointerEvents: "none" as const,
  },
  deco2: {
    position: "absolute" as const,
    bottom: "-40px",
    left: "-40px",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    pointerEvents: "none" as const,
  },
  cardContent: {
    position: "relative" as const,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInner: {
    textAlign: "center" as const,
    padding: "0 40px",
    width: "100%",
  },
  cardEyebrow: {
    fontSize: "11px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "10px",
    fontFamily: "system-ui, sans-serif",
    fontWeight: 500,
  },
  cardHeading: {
    fontSize: "30px",
    fontWeight: 300,
    color: "white",
    margin: "0 0 14px",
    fontFamily: "'Georgia', serif",
    letterSpacing: "-0.3px",
  },
  cardBody: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 1.6,
    marginBottom: "28px",
    fontFamily: "system-ui, sans-serif",
  },
  cardBtn: {
    display: "inline-block",
    padding: "10px 28px",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "1.5px solid rgba(255,255,255,0.5)",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.04em",
    transition: "background 0.2s, transform 0.15s",
  },

  // ── Mobile ──
  mobileMain: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "24px 16px 40px",
  },
  mobileCard: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,253,250,0.95)",
    borderRadius: "16px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    overflow: "hidden" as const,
  },
  tabRow: {
    display: "flex",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    background: "rgba(248,246,243,0.6)",
  },
  tab: {
    flex: 1,
    padding: "14px 12px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    textAlign: "center" as const,
    transition: "color 0.2s, border-color 0.2s",
    lineHeight: 1.4,
  },
  mobileFormArea: {
    padding: "28px 28px 32px",
  },

  // ── Shared form styles ──
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  formHeader: {
    marginBottom: "4px",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: 300,
    color: "#2c2c2c",
    margin: "0 0 4px",
    fontFamily: "'Georgia', serif",
    letterSpacing: "-0.3px",
  },
  formSubtitle: {
    fontSize: "13px",
    color: "#999",
    margin: "0 0 12px",
    fontFamily: "system-ui, sans-serif",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  label: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    fontFamily: "system-ui, sans-serif",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "16px", // 16px prevents iOS zoom on focus
    fontFamily: "system-ui, sans-serif",
    border: "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: "8px",
    background: "rgba(248,246,243,0.8)",
    color: "#333",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box" as const,
  },
  textBtn: {
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#aaa",
    cursor: "pointer",
    padding: 0,
    fontFamily: "system-ui, sans-serif",
  },
  submitBtn: (color: string) => ({
    width: "100%",
    padding: "12px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.02em",
    transition: "opacity 0.2s",
    marginTop: "2px",
  }),
} as const;

export default AuthPage;
