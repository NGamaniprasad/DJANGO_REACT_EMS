function About() {
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
          About Gamani Solutions
        </h1>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.8",
            fontSize: "17px",
          }}
        >
          Gamani Solutions is focused on providing reliable and
          modern digital solutions for organizations and their
          employees.
        </p>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.8",
            fontSize: "17px",
          }}
        >
          Our Employee Work Management System helps organizations
          manage employee information, attendance, tasks, and
          workplace activities from one convenient platform.
        </p>

        <h2 style={{ marginTop: "40px", color: "#1e3a8a" }}>
          Our Mission
        </h2>

        <p
          style={{
            color: "#64748b",
            lineHeight: "1.8",
          }}
        >
          Our mission is to simplify workplace management through
          easy-to-use technology and efficient digital solutions.
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

export default About;