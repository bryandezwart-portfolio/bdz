"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULT_NAMES = ["Bryan de Zwart", "Radio DJ", "Label Owner", "BDZ Bookings", "Development"];
const DEFAULT_SUBTITLE = "Radio DJ · Label Owner · Bookings · Development";
const DEFAULT_TAGS = ["Radio Muziekstad", "Bryan de Zwart Music", "BDZ Bookings", "BDZScreens", "Development"];
const DEFAULT_VIDEO = "/bdz-nov.mp4";

const SOCIAL_PLATFORMS = [
  { key: "socialYoutube", label: "YouTube", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { key: "socialInstagram", label: "Instagram", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { key: "socialTiktok", label: "TikTok", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg> },
  { key: "socialFacebook", label: "Facebook", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { key: "socialThreads", label: "Threads", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 012.325.111c-.1-.609-.3-1.07-.62-1.372-.399-.376-.985-.568-1.74-.574h-.047c-.64 0-1.68.173-2.3 1.179l-1.755-1.133C8.084 5.65 9.531 5.025 11.3 4.998h.07c1.37.01 2.528.37 3.44 1.07 1.034.79 1.67 1.99 1.887 3.57.063.447.098.908.106 1.378.52.293.993.637 1.406 1.038 1.003.966 1.598 2.18 1.72 3.52.173 1.956-.38 3.918-1.714 5.388-1.47 1.618-3.597 2.44-6.03 2.458z"/></svg> },
  { key: "socialX", label: "X / Twitter", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { key: "socialWhatsapp", label: "WhatsApp", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  { key: "socialSpotify", label: "Spotify", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg> },
  { key: "socialSoundcloud", label: "SoundCloud", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1.175 12.225c-.075 0-.131.063-.131.131l-.469 2.588.469 2.481c0 .075.056.131.131.131s.131-.056.131-.131l.544-2.481-.544-2.588c0-.069-.056-.131-.131-.131zm1.519-.544c-.094 0-.169.075-.169.169L2 14.944l.525 2.363c0 .094.075.169.169.169s.169-.075.169-.169l.6-2.363-.6-2.569c0-.094-.075-.169-.169-.169zm1.631-.131c-.113 0-.206.094-.206.206l-.544 2.669.544 2.4c0 .113.094.206.206.206.113 0 .206-.094.206-.206l.619-2.4-.619-2.669c0-.113-.094-.206-.206-.206zm1.65-.206c-.131 0-.244.113-.244.244l-.506 2.875.506 2.306c0 .131.113.244.244.244s.244-.113.244-.244l.581-2.306-.581-2.875c0-.131-.113-.244-.244-.244zm1.669-.131c-.15 0-.281.131-.281.281l-.469 3.006.469 2.231c0 .15.131.281.281.281s.281-.131.281-.281l.544-2.231-.544-3.006c0-.15-.131-.281-.281-.281zm1.688-.094c-.169 0-.319.15-.319.319l-.431 3.1.431 2.138c0 .169.15.319.319.319s.319-.15.319-.319l.506-2.138-.506-3.1c0-.169-.15-.319-.319-.319zm1.706-.038c-.188 0-.356.169-.356.356l-.394 3.138.394 2.044c0 .188.169.356.356.356s.356-.169.356-.356l.469-2.044-.469-3.138c0-.188-.169-.356-.356-.356zm1.725-.019c-.206 0-.394.188-.394.394l-.356 3.156.356 1.95c0 .206.188.394.394.394s.394-.188.394-.394l.431-1.95-.431-3.156c0-.206-.188-.394-.394-.394zm1.744 0c-.225 0-.431.206-.431.431l-.319 3.156.319 1.856c0 .225.206.431.431.431s.431-.206.431-.431l.394-1.856-.394-3.156c0-.225-.206-.431-.431-.431zm1.763.019c-.244 0-.469.225-.469.469l-.281 3.138.281 1.763c0 .244.225.469.469.469s.469-.225.469-.469l.356-1.763-.356-3.138c0-.244-.225-.469-.469-.469zm4.55-1.388c-.131-.056-.281-.075-.431-.056-.225-2.456-2.269-4.369-4.781-4.369-1.106 0-2.119.394-2.906 1.031-.3.244-.375.619-.375.975v8.531c0 .375.3.675.675.675h7.819c1.013 0 1.838-.825 1.838-1.838 0-1.013-.825-1.838-1.838-1.838z"/></svg> },
  { key: "socialLinkedin", label: "LinkedIn", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

export default function Hero() {
  const elRef = useRef<HTMLHeadingElement>(null);
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
  const [loaded, setLoaded] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [cmsLinks, setCmsLinks] = useState<Record<string, string>>({});
  const [heroVideo, setHeroVideo] = useState(DEFAULT_VIDEO);
  const [heroBgImage, setHeroBgImage] = useState("");

  useEffect(() => {
    fetch("/api/cms/save")
      .then((r) => r.json())
      .then((data) => {
        const content = data?.content || data || {};
        if (content?.heroNames) setNames(content.heroNames.split(",").map((s: string) => s.trim()).filter(Boolean));
        if (content?.heroSubtitle) setSubtitle(content.heroSubtitle);
        if (content?.heroTags) setTags(content.heroTags.split(",").map((s: string) => s.trim()).filter(Boolean));
        if (content?.heroVideo) setHeroVideo(content.heroVideo);
        if (content?.heroBgImage) setHeroBgImage(content.heroBgImage);
        const links: Record<string, string> = {};
        SOCIAL_PLATFORMS.forEach(({ key }) => { if (content[key]) links[key] = content[key]; });
        setCmsLinks(links);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let ni = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    function type() {
      if (!elRef.current) return;
      const current = names[ni];
      if (!deleting) {
        elRef.current.textContent = current.slice(0, ++ci);
        if (ci === current.length) { deleting = true; timer = setTimeout(type, ni === 0 ? 3000 : 1800); return; }
        timer = setTimeout(type, 80);
      } else {
        elRef.current.textContent = current.slice(0, --ci);
        if (ci === 0) { deleting = false; ni = (ni + 1) % names.length; timer = setTimeout(type, 400); return; }
        timer = setTimeout(type, 40);
      }
    }
    timer = setTimeout(type, 800);
    return () => clearTimeout(timer);
  }, [loaded, names]);

  const activeSocials = SOCIAL_PLATFORMS.filter(({ key }) => !!cmsLinks[key]?.trim());

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* VIDEO of AFBEELDING achtergrond */}
      {heroVideo ? (
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
      ) : heroBgImage ? (
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
      ) : null}

      {/* OVERLAY */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(3,5,7,0.75) 0%, rgba(230,57,70,0.08) 50%, rgba(3,5,7,0.85) 100%)" }} />

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px" }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, letterSpacing: 6, color: "var(--neon)", textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ display: "inline-block", width: 40, height: 1, background: "var(--neon)", opacity: 0.5 }} />
          Official
          <span style={{ display: "inline-block", width: 40, height: 1, background: "var(--neon)", opacity: 0.5 }} />
        </div>
        <h1 ref={elRef} style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(24px, 8vw, 110px)", fontWeight: 900, lineHeight: 1, color: "white", textShadow: "0 0 60px rgba(230,57,70,0.3)", letterSpacing: -2, minHeight: "1.2em" }} />
        <p style={{ marginTop: 20, fontSize: "clamp(10px, 3vw, 16px)", color: "rgba(240,240,240,0.5)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 300, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 0" }}>
          {subtitle.split("·").map((s, i, arr) => (
            <span key={i}>{s.trim()}{i < arr.length - 1 ? <>&nbsp;·&nbsp;</> : null}</span>
          ))}
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {tags.map(tag => (
            <span key={tag} style={{ padding: "8px 20px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, fontSize: 12, letterSpacing: 1, color: "rgba(240,240,240,0.5)", backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.04)" }}>{tag}</span>
          ))}
        </div>
        {activeSocials.length > 0 && (
          <div style={{ marginTop: 36, display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
            {activeSocials.map(({ key, label, icon }) => (
              <a key={key} href={cmsLinks[key]} target="_blank" rel="noopener noreferrer" aria-label={label}
                onMouseEnter={() => setHoveredSocial(key)} onMouseLeave={() => setHoveredSocial(null)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: "50%", border: `1px solid ${hoveredSocial === key ? "rgba(230,57,70,0.6)" : "rgba(255,255,255,0.1)"}`, background: hoveredSocial === key ? "rgba(230,57,70,0.12)" : "rgba(255,255,255,0.04)", color: hoveredSocial === key ? "var(--neon)" : "rgba(240,240,240,0.45)", backdropFilter: "blur(10px)", transition: "all 0.25s ease", boxShadow: hoveredSocial === key ? "0 0 16px rgba(230,57,70,0.25)" : "none", textDecoration: "none" }}>
                {icon}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* SCROLL INDICATOR */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(240,240,240,0.4)", fontSize: 11, letterSpacing: 2 }}>
        <span>Scroll</span>
        <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, var(--neon), transparent)", animation: "scrollAnim 2s infinite" }} />
      </div>
      <style>{`
        @keyframes scrollAnim {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}
