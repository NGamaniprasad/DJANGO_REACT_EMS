function TermsOfUse() {
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
          Terms of Use
        </h1>

        <h3 style={{ color: "#1e3a8a" }}>
          Authorized Access
        </h3>

        <p style={{ color: "#64748b", lineHeight: "1.8" }}>
          This system is intended only for authorized employees and
          administrators of Gamani Solutions.
        </p>

        <h3 style={{ color: "#1e3a8a" }}>
          Account Security
        </h3>

        <p style={{ color: "#64748b", lineHeight: "1.8" }}>
          Users are responsible for keeping their usernames,
          passwords, and other account information secure.
        </p>

        <h3 style={{ color: "#1e3a8a" }}>
          Acceptable Use
        </h3>

        <p style={{ color: "#64748b", lineHeight: "1.8" }}>
          The system must be used only for legitimate workplace
          activities and according to company policies.
        </p>

        <h3 style={{ color: "#1e3a8a" }}>
          Privacy
        </h3>

        <p style={{ color: "#64748b", lineHeight: "1.8" }}>
          Users should not share confidential employee or company
          information with unauthorized persons.
        </p>
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

export default TermsOfUse;