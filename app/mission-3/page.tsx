"use client";

import Link from "next/link";
import { ArrowLeft, Rocket } from "lucide-react";

export default function MissionThreePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #ecfeff 48%, #fff7ed 100%)",
        color: "#172033",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <section
        style={{
          width: "min(100%, 42rem)",
          padding: "2rem",
          border: "1px solid rgba(148, 163, 184, 0.28)",
          borderRadius: "14px",
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          textAlign: "center",
        }}
      >
        <Rocket size={42} color="#4f46e5" aria-hidden="true" />
        <h1 style={{ margin: "1rem 0 0.6rem", fontSize: "2.4rem" }}>
          AI Engineer Mission
        </h1>
        <p
          style={{
            margin: "0 auto 1.5rem",
            maxWidth: "32rem",
            color: "#64748b",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          Your next mini project is being prepared. Head back to the roadmap to
          continue learning.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.8rem 1rem",
            borderRadius: "10px",
            background: "#4f46e5",
            color: "#ffffff",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to roadmap
        </Link>
      </section>
    </main>
  );
}
