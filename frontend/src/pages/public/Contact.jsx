
import { useState } from "react";

function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mkjnojeg", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          padding: "20px 60px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ margin: 0, color: "#1e3a8a" }}>
          Gamani Solutions
        </h2>

        <p style={{ margin: "5px 0 0", color: "#64748b" }}>
          Employee Work Management System
        </p>
      </header>

      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "70px 30px",
        }}
      >
        <h1 style={{ color: "#1e293b" }}>Contact Us</h1>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.8",
            fontSize: "17px",
          }}
        >
          Have a question or need support? Send us a message and
          our team will get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            marginTop: "30px",
            border: "1px solid #e2e8f0",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontWeight: "bold",
            }}
          >
            Name
          </label>

          <input
            type="text"
            name="name"
            required
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontWeight: "bold",
            }}
          >
            Email
          </label>

          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontWeight: "bold",
            }}
          >
            Message
          </label>

          <textarea
            name="message"
            required
            rows="6"
            placeholder="Enter your message"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            style={{
              background: "#1e3a8a",
              color: "#ffffff",
              border: "none",
              padding: "12px 25px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Send Message
          </button>

          {status === "success" && (
            <p
              style={{
                marginTop: "20px",
                color: "#16a34a",
                fontWeight: "bold",
              }}
            >
              ✓ Message sent successfully!
            </p>
          )}

          {status === "error" && (
            <p
              style={{
                marginTop: "20px",
                color: "#dc2626",
                fontWeight: "bold",
              }}
            >
              ✕ Something went wrong. Please try again.
            </p>
          )}
        </form>
      </main>

      <footer
        style={{
          background: "#0f172a",
          color: "#cbd5e1",
          padding: "25px 60px",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Gamani Solutions. All rights reserved.
      </footer>
    </div>
  );
}

export default Contact;

