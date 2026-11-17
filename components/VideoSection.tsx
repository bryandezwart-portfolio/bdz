"use client";

export default function VideoSection() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "60vh",
        maxHeight: 520,
        overflow: "hidden",
        marginTop: -2,
        marginBottom: -320,
        zIndex: 0,
      }}
    >
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.55,
        }}
      >
        <source src="/developer-video.mp4" type="video/mp4" />
      </video>

      {/* Bovenste fade: Hero → Video */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "25%",
          background:
            "linear-gradient(to bottom, rgba(3,5,7,1) 0%, rgba(3,5,7,0.5) 70%, transparent 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Onderste fade: begint al bij 20% van boven — video verdwijnt snel */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: 0,
          right: 0,
          bottom: -200,
          background:
            "linear-gradient(to top, rgba(3,5,7,1) 0%, rgba(3,5,7,1) 60%, rgba(3,5,7,0.95) 75%, rgba(3,5,7,0.6) 88%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Zijkant vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(3,5,7,0.65) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
