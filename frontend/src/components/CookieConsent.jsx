import { useEffect, useState } from "react";

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieChoice = localStorage.getItem("cookieConsent");

    if (!cookieChoice) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        boxShadow: "0 -5px 20px rgba(0, 0, 0, 0.10)",
        padding: "20px 30px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: "0 0 8px",
              color: "#1e293b",
            }}
          >
            We use cookies
          </h3>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              lineHeight: "1.6",
              fontSize: "14px",
            }}
          >
            Gamani Solutions uses cookies to improve your
            experience, remember your preferences, and help
            maintain a secure employee management system.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={handleReject}
            style={{
              padding: "11px 22px",
              border: "1px solid #cbd5e1",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#475569",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Reject
          </button>

          <button
            type="button"
            onClick={handleAccept}
            style={{
              padding: "11px 22px",
              border: "none",
              borderRadius: "7px",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;