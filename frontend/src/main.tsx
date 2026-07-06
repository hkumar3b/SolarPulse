import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./pages/Dashboard";
import { AuthPage } from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        color: "#666",
        fontFamily: "sans-serif",
        backgroundColor: "#fff"
      }}>
        <div style={{ fontSize: "1.1rem", letterSpacing: "0.05em" }}>Loading Portal...</div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
