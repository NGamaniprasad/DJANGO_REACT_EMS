function Contact() {
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
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "70px 30px",
        }}
      >
        <h1 style={{ color: "#1e293b" }}>
          Contact Us
        </h1>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.8",
            fontSize: "17px",
          }}
        >
          If you have questions, require assistance, or need support
          with the Employee Work Management System, please contact
          the Gamani Solutions team.
        </p>

        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            marginTop: "30px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ color: "#1e3a8a" }}>
            Support
          </h3>

          <p style={{ color: "#475569" }}>
            Email: support@gamanisolutions.com
          </p>

          <p style={{ color: "#475569" }}>
            Phone: +91 XXXXX XXXXX
          </p>

          <p style={{ color: "#475569" }}>
            Working Hours: Monday - Friday, 9:00 AM - 6:00 PM
          </p>
        </div>
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