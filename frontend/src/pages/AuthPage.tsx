import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (activeTab === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (activeTab === "login") {
        await login(email, password);
      } else {
        await register(email, password);
        setSuccess("Account created successfully! Please log in.");
        setActiveTab("login");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontFamily: "sans-serif",
      backgroundColor: "#f9f9f9"
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "32px",
        width: "100%",
        maxWidth: "400px",
        boxSizing: "border-box"
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>SolarPulse</h1>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Clean energy telemetry portal</p>
        </div>

        <div style={{ display: "flex", marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
          <button
            type="button"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              borderBottom: activeTab === "login" ? "2px solid #000" : "none",
              padding: "10px",
              cursor: "pointer",
              fontWeight: activeTab === "login" ? "bold" : "normal",
              fontSize: "14px"
            }}
            onClick={() => {
              setActiveTab("login");
              setError(null);
              setSuccess(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              borderBottom: activeTab === "register" ? "2px solid #000" : "none",
              padding: "10px",
              cursor: "pointer",
              fontWeight: activeTab === "register" ? "bold" : "normal",
              fontSize: "14px"
            }}
            onClick={() => {
              setActiveTab("register");
              setError(null);
              setSuccess(null);
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#b91c1c",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "14px",
            marginBottom: "16px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "#dcfce7",
            border: "1px solid #86efac",
            color: "#15803d",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "14px",
            marginBottom: "16px"
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px", color: "#333" }}>Email Address</label>
            <input
              type="email"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                boxSizing: "border-box"
              }}
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px", color: "#333" }}>Password</label>
            <input
              type="password"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                boxSizing: "border-box"
              }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          {activeTab === "register" && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "4px", color: "#333" }}>Confirm Password</label>
              <input
                type="password"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box"
                }}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "none",
              background: "#0070f3",
              color: "#fff",
              fontWeight: "bold",
              cursor: submitting ? "not-allowed" : "pointer"
            }}
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : activeTab === "login"
                ? "Sign In"
                : "Register Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
