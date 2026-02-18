import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { user, signUp, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const switchMode = (target) => {
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

  const handleSubmit = async (e) => {
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

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <Logo />
      </header>

      {/* Beta banner */}
      <div style={styles.banner}>
        <p style={styles.bannerText}>
          <span style={{ fontWeight: 600 }}>Beta Testing Phase</span> — We're limiting early access to ensure quality.{" "}
          <a href="/#beta-signup" style={styles.bannerLink}>
            Join our first 50 testers
          </a>
          .
        </p>
      </div>

      {/* Main container */}
      <main style={styles.main}>
        <div style={styles.rectangle}>
          {/* ── LEFT PANEL ── */}
          <div
            style={{
              ...styles.panel,
              opacity: isLogin && !isAnimating ? 1 : !isLogin && !isAnimating ? 1 : 0.3,
              transition: "opacity 0.3s ease",
            }}
          >
            {/* Login form */}
            <div
              style={{
                ...styles.formPanel,
                opacity: isLogin ? 1 : 0,
                transform: isLogin ? "translateX(0)" : "translateX(-20px)",
                transition: "all 0.4s ease",
                pointerEvents: isLogin ? "auto" : "none",
                position: isLogin ? "relative" : "absolute",
              }}
            >
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>{forgotMode ? "Reset password" : "Welcome back"}</h2>
                <p style={styles.formSubtitle}>{forgotMode ? "We'll send you a reset link" : "Take your time"}</p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#709474")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                  />
                </div>

                {!forgotMode && (
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = "#709474")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                    />
                  </div>
                )}

                <div style={{ textAlign: "right", marginTop: "-4px" }}>
                  {!forgotMode ? (
                    <button type="button" onClick={() => setForgotMode(true)} style={styles.textBtn}>
                      Forgot password?
                    </button>
                  ) : (
                    <button type="button" onClick={() => setForgotMode(false)} style={styles.textBtn}>
                      ← Back to sign in
                    </button>
                  )}
                </div>

                <button type="submit" disabled={isSubmitting} style={styles.submitBtn("#709474")}>
                  {isSubmitting ? "Please wait..." : forgotMode ? "Send reset link" : "Sign in"}
                </button>
              </form>
            </div>

            {/* Signup form — shown on left when in signup mode */}
            <div
              style={{
                ...styles.formPanel,
                opacity: !isLogin ? 1 : 0,
                transform: !isLogin ? "translateX(0)" : "translateX(20px)",
                transition: "all 0.4s ease",
                pointerEvents: !isLogin ? "auto" : "none",
                position: !isLogin ? "relative" : "absolute",
                top: !isLogin ? "auto" : 0,
                width: "100%",
              }}
            >
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>Begin your journey</h2>
                <p style={styles.formSubtitle}>Create a space for yourself</p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#8775aa")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = "#8775aa")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ ...styles.submitBtn("#8775aa"), marginTop: "8px" }}
                >
                  {isSubmitting ? "Please wait..." : "Create account"}
                </button>
              </form>
            </div>
          </div>

          {/* ── SLIDING CARD ── */}
          <div
            style={{
              ...styles.slidingCard,
              left: isLogin ? "50%" : "0%",
              background: isLogin
                ? "linear-gradient(135deg, #cbb7ef 0%, #b9a3e0 100%)"
                : "linear-gradient(135deg, #8daa90 0%, #709474 100%)",
              borderRadius: isLogin ? "0 16px 16px 0" : "16px 0 0 16px",
              transition: "left 0.65s cubic-bezier(0.77, 0, 0.175, 1), background 0.65s ease, border-radius 0.4s ease",
            }}
          >
            {/* Decorative circles */}
            <div style={styles.deco1} />
            <div style={styles.deco2} />

            <div style={styles.cardContent}>
              {/* Login-side card (shown when card is on right = login mode) */}
              <div
                style={{
                  ...styles.cardInner,
                  opacity: isLogin ? 1 : 0,
                  transform: isLogin ? "translateY(0)" : "translateY(10px)",
                  transition: "all 0.4s ease 0.2s",
                  pointerEvents: isLogin ? "auto" : "none",
                  position: "absolute",
                }}
              >
                <p style={styles.cardEyebrow}>New here?</p>
                <h3 style={styles.cardHeading}>Join SeeHere</h3>
                <p style={styles.cardBody}>A quiet space to think out loud, with a companion that listens.</p>
                <button
                  onClick={() => switchMode("signup")}
                  style={styles.cardBtn}
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

              {/* Signup-side card (shown when card is on left = signup mode) */}
              <div
                style={{
                  ...styles.cardInner,
                  opacity: !isLogin ? 1 : 0,
                  transform: !isLogin ? "translateY(0)" : "translateY(10px)",
                  transition: "all 0.4s ease 0.2s",
                  pointerEvents: !isLogin ? "auto" : "none",
                  position: "absolute",
                }}
              >
                <p style={styles.cardEyebrow}>Already have an account?</p>
                <h3 style={styles.cardHeading}>Welcome back</h3>
                <p style={styles.cardBody}>Good to see you again. Your space is waiting.</p>
                <button
                  onClick={() => switchMode("login")}
                  style={styles.cardBtn}
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
    </div>
  );
};

// ── Styles ──────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f8f6f3",
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  header: {
    padding: "10px 32px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    background: "rgba(248,246,243,0.95)",
    backdropFilter: "blur(8px)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  banner: {
    background: "linear-gradient(to right, rgba(203,183,239,0.2), rgba(177,207,172,0.2))",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    padding: "6px 24px",
    textAlign: "center",
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
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  rectangle: {
    position: "relative",
    width: "min(860px, 100%)",
    height: "520px",
    background: "rgba(255,253,250,0.9)",
    borderRadius: "16px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
    overflow: "hidden",
    display: "flex",
  },
  panel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 52px",
    position: "relative",
    overflow: "hidden",
  },
  formPanel: {
    width: "100%",
    maxWidth: "340px",
  },
  formHeader: {
    marginBottom: "28px",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: 300,
    color: "#2c2c2c",
    margin: "0 0 6px",
    fontFamily: "'Georgia', serif",
    letterSpacing: "-0.3px",
  },
  formSubtitle: {
    fontSize: "13px",
    color: "#999",
    margin: 0,
    fontFamily: "system-ui, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontFamily: "system-ui, sans-serif",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
    border: "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: "8px",
    background: "rgba(248,246,243,0.8)",
    color: "#333",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  },
  textBtn: {
    background: "none",
    border: "none",
    fontSize: "12px",
    color: "#aaa",
    cursor: "pointer",
    padding: 0,
    fontFamily: "system-ui, sans-serif",
    transition: "color 0.2s",
  },
  submitBtn: (color) => ({
    width: "100%",
    padding: "11px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.02em",
    transition: "opacity 0.2s, transform 0.15s",
    marginTop: "4px",
  }),
  slidingCard: {
    position: "absolute",
    top: 0,
    width: "50%",
    height: "100%",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  deco1: {
    position: "absolute",
    top: "-60px",
    right: "-60px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    pointerEvents: "none",
  },
  deco2: {
    position: "absolute",
    bottom: "-40px",
    left: "-40px",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    pointerEvents: "none",
  },
  cardContent: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInner: {
    textAlign: "center",
    padding: "0 40px",
    width: "100%",
  },
  cardEyebrow: {
    fontSize: "11px",
    textTransform: "uppercase",
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
} as const;

export default AuthPage;
