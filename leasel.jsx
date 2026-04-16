import { useState, useEffect, useRef } from "react";

// ─── Constants & Config ───
const COLORS = {
  bg: "#0A0F0D",
  surface: "#121916",
  surfaceHover: "#1A2420",
  border: "#243029",
  borderFocus: "#4A7C5C",
  accent: "#5B9A6E",
  accentLight: "#7BB88A",
  accentMuted: "rgba(91,154,110,0.12)",
  text: "#E8EDE9",
  textMuted: "#8A9B8F",
  textDim: "#5A6B5F",
  white: "#FFFFFF",
  error: "#C45B5B",
  warning: "#C4A35B",
  success: "#5B9A6E",
};

const FONTS = {
  display: "'DM Serif Display', serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── Styles ───
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: ${FONTS.body};
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: ${COLORS.accentMuted};
    color: ${COLORS.accentLight};
  }

  input, textarea, select {
    font-family: ${FONTS.body};
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// ─── Shared Components ───
const Logo = ({ size = "md" }) => {
  const sizes = { sm: 18, md: 24, lg: 36 };
  const fontSize = sizes[size] || sizes.md;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: fontSize * 1.2,
        height: fontSize * 1.2,
        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
        borderRadius: fontSize * 0.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{
          fontFamily: FONTS.display,
          fontSize: fontSize * 0.65,
          color: COLORS.bg,
          fontWeight: 700,
        }}>L</span>
      </div>
      <span style={{
        fontFamily: FONTS.display,
        fontSize,
        color: COLORS.text,
        letterSpacing: "-0.02em",
      }}>Leasel</span>
    </div>
  );
};

const Button = ({ children, variant = "primary", size = "md", onClick, disabled, style = {} }) => {
  const [hovered, setHovered] = useState(false);
  const baseStyles = {
    fontFamily: FONTS.body,
    fontWeight: 600,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 8,
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: disabled ? 0.5 : 1,
  };
  const sizeStyles = {
    sm: { padding: "8px 16px", fontSize: 13 },
    md: { padding: "12px 24px", fontSize: 14 },
    lg: { padding: "16px 32px", fontSize: 16 },
  };
  const variantStyles = {
    primary: {
      background: hovered ? COLORS.accentLight : COLORS.accent,
      color: COLORS.bg,
    },
    secondary: {
      background: hovered ? COLORS.surfaceHover : "transparent",
      color: COLORS.text,
      border: `1px solid ${COLORS.border}`,
    },
    ghost: {
      background: hovered ? COLORS.accentMuted : "transparent",
      color: COLORS.accentLight,
    },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", placeholder, value, onChange, required, error, options, rows }) => {
  const [focused, setFocused] = useState(false);
  const inputStyles = {
    width: "100%",
    padding: rows ? "12px 14px" : "11px 14px",
    background: COLORS.surface,
    border: `1px solid ${error ? COLORS.error : focused ? COLORS.borderFocus : COLORS.border}`,
    borderRadius: 8,
    color: COLORS.text,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s ease",
    resize: rows ? "vertical" : undefined,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 13,
          fontWeight: 500,
          color: COLORS.textMuted,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          {label}
          {required && <span style={{ color: COLORS.accent }}>*</span>}
        </label>
      )}
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inputStyles, appearance: "none" }}
        >
          <option value="" style={{ background: COLORS.surface }}>{placeholder || "Select..."}</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt} style={{ background: COLORS.surface }}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyles}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyles}
        />
      )}
      {error && <span style={{ fontSize: 12, color: COLORS.error }}>{error}</span>}
    </div>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const colors = {
    default: { bg: COLORS.accentMuted, text: COLORS.accentLight },
    warning: { bg: "rgba(196,163,91,0.12)", text: COLORS.warning },
    success: { bg: "rgba(91,154,110,0.15)", text: COLORS.success },
    dim: { bg: "rgba(90,107,95,0.2)", text: COLORS.textMuted },
  };
  const c = colors[variant] || colors.default;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      background: c.bg,
      color: c.text,
      fontSize: 12,
      fontWeight: 500,
      borderRadius: 6,
      letterSpacing: "0.01em",
    }}>
      {children}
    </span>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 24,
    ...style,
  }}>
    {children}
  </div>
);

// ─── Document Upload Component ───
const DOCUMENT_TYPES = [
  { id: "id", label: "Identity Document", desc: "Passport or national ID card", icon: "🪪", required: true },
  { id: "income", label: "Proof of Income", desc: "3 most recent payslips or employment contract", icon: "💰", required: true },
  { id: "employment", label: "Employment Contract", desc: "Current employment contract or letter", icon: "📄", required: true },
  { id: "bank", label: "Bank Statements", desc: "Last 3 months of bank statements", icon: "🏦", required: false },
  { id: "tax", label: "Tax Return", desc: "Most recent tax declaration", icon: "📋", required: false },
  { id: "reference", label: "Previous Landlord Reference", desc: "Letter from a previous landlord", icon: "✉️", required: false },
  { id: "other", label: "Other Documents", desc: "RIB, guarantee letters, etc.", icon: "📎", required: false },
];

const DocumentUpload = ({ documents, setDocuments }) => {
  const handleToggle = (docId) => {
    setDocuments((prev) => {
      const existing = prev.find((d) => d.id === docId);
      if (existing) {
        return prev.filter((d) => d.id !== docId);
      }
      return [...prev, { id: docId, name: `${docId}_document.pdf`, uploadedAt: new Date().toISOString() }];
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {DOCUMENT_TYPES.map((doc) => {
        const isUploaded = documents.some((d) => d.id === doc.id);
        return (
          <div
            key={doc.id}
            onClick={() => handleToggle(doc.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              background: isUploaded ? "rgba(91,154,110,0.06)" : COLORS.surface,
              border: `1px solid ${isUploaded ? COLORS.accent : COLORS.border}`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 22 }}>{doc.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text, display: "flex", alignItems: "center", gap: 8 }}>
                {doc.label}
                {doc.required && <Badge>Required</Badge>}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{doc.desc}</div>
            </div>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: `2px solid ${isUploaded ? COLORS.accent : COLORS.border}`,
              background: isUploaded ? COLORS.accent : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}>
              {isUploaded && <span style={{ color: COLORS.bg, fontSize: 13, fontWeight: 700 }}>✓</span>}
            </div>
          </div>
        );
      })}
      <p style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>
        In the live app, you'll upload actual files here. For this prototype, click to simulate adding documents to your dossier.
      </p>
    </div>
  );
};

// ─── Dossier Completeness ───
const CompletenessBar = ({ documents, profile }) => {
  const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required);
  const uploadedRequired = requiredDocs.filter((d) => documents.some((doc) => doc.id === d.id));
  const hasProfile = profile.firstName && profile.lastName && profile.email;
  const totalSteps = requiredDocs.length + 1; // +1 for profile
  const completedSteps = uploadedRequired.length + (hasProfile ? 1 : 0);
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.textMuted }}>Dossier completeness</span>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: percentage === 100 ? COLORS.success : percentage > 50 ? COLORS.accentLight : COLORS.warning,
        }}>{percentage}%</span>
      </div>
      <div style={{
        width: "100%",
        height: 6,
        background: COLORS.border,
        borderRadius: 3,
        overflow: "hidden",
      }}>
        <div style={{
          width: `${percentage}%`,
          height: "100%",
          background: percentage === 100
            ? `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`
            : COLORS.accent,
          borderRadius: 3,
          transition: "width 0.5s ease",
        }} />
      </div>
    </div>
  );
};

// ─── Dossier Preview (Shareable View) ───
const DossierPreview = ({ profile, documents }) => {
  const uploadedDocs = DOCUMENT_TYPES.filter((d) => documents.some((doc) => doc.id === d.id));
  const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required);
  const uploadedRequired = requiredDocs.filter((d) => documents.some((doc) => doc.id === d.id));
  const allRequiredUploaded = uploadedRequired.length === requiredDocs.length;

  return (
    <div style={{
      background: COLORS.bg,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      overflow: "hidden",
      animation: "fadeUp 0.4s ease",
    }}>
      {/* Header */}
      <div style={{
        padding: "28px 28px 24px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: `linear-gradient(180deg, rgba(91,154,110,0.06) 0%, transparent 100%)`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <Logo size="sm" />
          <Badge variant={allRequiredUploaded ? "success" : "warning"}>
            {allRequiredUploaded ? "● Complete" : "○ Incomplete"}
          </Badge>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontFamily: FONTS.display,
            color: COLORS.bg,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {(profile.firstName?.[0] || "?")}{(profile.lastName?.[0] || "")}
          </div>
          <div>
            <h2 style={{
              fontFamily: FONTS.display,
              fontSize: 22,
              color: COLORS.text,
              marginBottom: 4,
            }}>
              {profile.firstName || "First"} {profile.lastName || "Last"}
            </h2>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>
              {profile.occupation || "Occupation not specified"}{profile.employer ? ` at ${profile.employer}` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 1,
        background: COLORS.border,
      }}>
        {[
          { label: "Email", value: profile.email },
          { label: "Phone", value: profile.phone },
          { label: "Nationality", value: profile.nationality },
          { label: "Move-in date", value: profile.moveInDate || "Flexible" },
          { label: "Monthly budget", value: profile.budget ? `€${profile.budget}` : "—" },
          { label: "Looking for", value: profile.lookingFor || "—" },
        ].map((item, i) => (
          <div key={i} style={{ background: COLORS.bg, padding: "14px 20px" }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 14, color: item.value && item.value !== "—" ? COLORS.text : COLORS.textDim }}>
              {item.value || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      {profile.about && (
        <div style={{ padding: "20px 28px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            About
          </div>
          <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>{profile.about}</p>
        </div>
      )}

      {/* Documents */}
      <div style={{ padding: "20px 28px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          Documents ({uploadedDocs.length}/{DOCUMENT_TYPES.length})
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DOCUMENT_TYPES.map((doc) => {
            const isUploaded = documents.some((d) => d.id === doc.id);
            return (
              <div key={doc.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                background: isUploaded ? COLORS.accentMuted : "rgba(90,107,95,0.1)",
                borderRadius: 6,
                fontSize: 12,
                color: isUploaded ? COLORS.accentLight : COLORS.textDim,
              }}>
                <span>{doc.icon}</span>
                {doc.label}
                {isUploaded && <span style={{ fontWeight: 600 }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 28px",
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: COLORS.textDim }}>
          Dossier generated via Leasel · {new Date().toLocaleDateString("en-GB")}
        </span>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONTS.mono }}>
          ID: {Math.random().toString(36).slice(2, 10).toUpperCase()}
        </span>
      </div>
    </div>
  );
};

// ─── Landing Page ───
const LandingPage = ({ onGetStarted }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = () => {
    if (email.includes("@")) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
        borderBottom: `1px solid ${COLORS.border}`,
        animation: "fadeIn 0.6s ease",
      }}>
        <Logo />
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="ghost" size="sm" onClick={onGetStarted}>Log in</Button>
          <Button size="sm" onClick={onGetStarted}>Get started</Button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px",
        textAlign: "center",
        maxWidth: 720,
        margin: "0 auto",
      }}>
        <Badge variant="dim" style={{ marginBottom: 24, animation: "fadeUp 0.5s ease" }}>
          Luxembourg · Now in beta
        </Badge>

        <h1 style={{
          fontFamily: FONTS.display,
          fontSize: "clamp(36px, 5vw, 56px)",
          lineHeight: 1.1,
          color: COLORS.text,
          marginBottom: 20,
          animation: "fadeUp 0.6s ease",
          letterSpacing: "-0.02em",
        }}>
          Your rental dossier,<br />
          <span style={{ color: COLORS.accentLight }}>ready before you are</span>
        </h1>

        <p style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: COLORS.textMuted,
          maxWidth: 520,
          marginBottom: 40,
          animation: "fadeUp 0.7s ease",
        }}>
          Build a complete, professional tenant profile once. Share it with any landlord or agency in Luxembourg instantly. No more scrambling for documents at every viewing.
        </p>

        {/* Waitlist or CTA */}
        <div style={{ animation: "fadeUp 0.8s ease", width: "100%", maxWidth: 440 }}>
          {!submitted ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  color: COLORS.text,
                  fontSize: 15,
                  outline: "none",
                  fontFamily: FONTS.body,
                }}
              />
              <Button size="lg" onClick={handleWaitlist}>Join waitlist</Button>
            </div>
          ) : (
            <div style={{
              padding: "16px 20px",
              background: "rgba(91,154,110,0.08)",
              border: `1px solid ${COLORS.accent}`,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <span style={{ fontSize: 14, color: COLORS.accentLight }}>
                You're on the list. We'll reach out soon.
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onGetStarted}
          style={{
            marginTop: 16,
            background: "none",
            border: "none",
            color: COLORS.textMuted,
            fontSize: 13,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 3,
            fontFamily: FONTS.body,
          }}
        >
          Or try building your dossier now →
        </button>

        {/* Value Props */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          marginTop: 80,
          width: "100%",
          animation: "fadeUp 1s ease",
        }}>
          {[
            { icon: "📁", title: "One dossier", desc: "Upload your documents once. Reuse for every application." },
            { icon: "⚡", title: "Instant sharing", desc: "Send your complete profile to agencies in one click." },
            { icon: "🔒", title: "Your data, your control", desc: "GDPR compliant. You decide who sees what." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: "20px 32px",
        borderTop: `1px solid ${COLORS.border}`,
        textAlign: "center",
        fontSize: 12,
        color: COLORS.textDim,
      }}>
        © 2026 Leasel · Luxembourg · Built for tenants, trusted by agencies
      </footer>
    </div>
  );
};

// ─── Onboarding Flow ───
const STEPS = ["Profile", "Documents", "Preview"];

const OnboardingPage = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    occupation: "",
    employer: "",
    budget: "",
    moveInDate: "",
    lookingFor: "",
    about: "",
  });
  const [documents, setDocuments] = useState([]);

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 0) return profile.firstName && profile.lastName && profile.email;
    if (step === 1) return documents.length > 0;
    return true;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo size="sm" />
          <span style={{ color: COLORS.textDim, fontSize: 13 }}>/ Build your dossier</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>← Back to home</Button>
      </nav>

      <div style={{
        flex: 1,
        display: "flex",
        maxWidth: 960,
        width: "100%",
        margin: "0 auto",
        padding: "40px 32px",
        gap: 48,
      }}>
        {/* Sidebar Steps */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 40, display: "flex", flexDirection: "column", gap: 4 }}>
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: step === i ? COLORS.accentMuted : "transparent",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: FONTS.body,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: step === i ? COLORS.accent : i < step ? "rgba(91,154,110,0.2)" : COLORS.border,
                  color: step === i ? COLORS.bg : i < step ? COLORS.accentLight : COLORS.textDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: 14,
                  fontWeight: step === i ? 600 : 400,
                  color: step === i ? COLORS.text : COLORS.textMuted,
                }}>{s}</span>
              </button>
            ))}

            <div style={{ marginTop: 24, padding: "0 14px" }}>
              <CompletenessBar documents={documents} profile={profile} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {step === 0 && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 26, marginBottom: 6, color: COLORS.text }}>
                Your profile
              </h2>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 32 }}>
                Basic information that landlords and agencies need to know.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Input label="First name" required value={profile.firstName} onChange={(v) => updateProfile("firstName", v)} placeholder="Pierre" />
                <Input label="Last name" required value={profile.lastName} onChange={(v) => updateProfile("lastName", v)} placeholder="Dupont" />
                <Input label="Email" required type="email" value={profile.email} onChange={(v) => updateProfile("email", v)} placeholder="you@email.com" />
                <Input label="Phone" value={profile.phone} onChange={(v) => updateProfile("phone", v)} placeholder="+352 ..." />
                <Input label="Nationality" value={profile.nationality} onChange={(v) => updateProfile("nationality", v)} placeholder="French" />
                <Input label="Occupation" value={profile.occupation} onChange={(v) => updateProfile("occupation", v)} placeholder="Software Engineer" />
                <Input label="Employer" value={profile.employer} onChange={(v) => updateProfile("employer", v)} placeholder="Company name" />
                <Input label="Monthly budget" value={profile.budget} onChange={(v) => updateProfile("budget", v)} placeholder="2000" />
                <Input
                  label="Looking for"
                  value={profile.lookingFor}
                  onChange={(v) => updateProfile("lookingFor", v)}
                  options={["Studio", "1-bedroom", "2-bedroom", "3+ bedroom", "Shared flat / room"]}
                />
                <Input label="Earliest move-in" type="date" value={profile.moveInDate} onChange={(v) => updateProfile("moveInDate", v)} />
              </div>
              <div style={{ marginTop: 20 }}>
                <Input
                  label="About you"
                  rows={3}
                  value={profile.about}
                  onChange={(v) => updateProfile("about", v)}
                  placeholder="Brief intro — who you are, why you're moving to Luxembourg, etc."
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 26, marginBottom: 6, color: COLORS.text }}>
                Your documents
              </h2>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 32 }}>
                Upload the documents that agencies typically request. Required documents are marked.
              </p>
              <DocumentUpload documents={documents} setDocuments={setDocuments} />
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <h2 style={{ fontFamily: FONTS.display, fontSize: 26, marginBottom: 6, color: COLORS.text }}>
                Your dossier
              </h2>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 32 }}>
                This is what a landlord or agency sees when you share your profile.
              </p>
              <DossierPreview profile={profile} documents={documents} />
              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <Button size="lg" onClick={() => alert("In the live app, this generates a unique shareable link to your dossier.")}>
                  Share dossier link
                </Button>
                <Button variant="secondary" size="lg" onClick={() => alert("In the live app, this exports your dossier as a clean PDF.")}>
                  Export as PDF
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex",
            justifyContent: "space-between",
          }}>
            <Button
              variant="secondary"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              ← Back
            </Button>
            <Button
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              disabled={step === STEPS.length - 1 || !canProceed()}
            >
              {step === STEPS.length - 2 ? "Preview dossier →" : "Continue →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── App Root ───
export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
        {page === "landing" && <LandingPage onGetStarted={() => setPage("onboarding")} />}
        {page === "onboarding" && <OnboardingPage onBack={() => setPage("landing")} />}
      </div>
    </>
  );
}