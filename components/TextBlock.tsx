"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULT_TEXT = "";

export default function TextBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(DEFAULT_TEXT);

  useEffect(() => {
    fetch("/site-content.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.texts?.textBlock) setText(data.texts.textBlock);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll(".fade-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (!text) return null;

  return (
    <section
      ref={ref}
      style={{
        padding: "6rem 2.5rem",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <p
        className="fade-up"
        style={{
          fontSize: "1.25rem",
          lineHeight: 1.8,
          color: "rgba(240,240,240,0.75)",
          textAlign: "center",
          fontStyle: "italic",
          borderLeft: "3px solid var(--neon)",
          paddingLeft: "2rem",
          textAlign: "left",
        }}
      >
        {text}
      </p>
    </section>
  );
}
