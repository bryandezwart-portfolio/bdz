"use client";
import { useEffect, useState } from "react";
import { useCmsAccent } from "@/lib/useCmsAccent";

type User = { email: string; role: "master" | "client"; name?: string };

export default function GebruikersPage() {
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName]   = useState("");
  const [newRole, setNewRole]   = useState<"master" | "client">("client");
  const [newPw, setNewPw]       = useState("");
  const [adding, setAdding]     = useState(false);
  const [showAdd, setShowAdd]   = useState(false);
  const [error, setError]       = useState("");
  const [currentUser, setCurrentUser] = useState<string>("");
  const accent = useCmsAccent();

  useEffect(() => {
    fetch("/api/cms/users").then((r) => r.json()).then((d) => {
      setUsers(d.users ?? []);
      setCurrentUser(d.currentUser ?? "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!newEmail || !newPw) { setError("E-mail en wachtwoord zijn verplicht"); return; }
    setAdding(true);
    setError("");
    const res = await fetch("/api/cms/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newEmail, password: newPw, role: newRole, name: newName }) });
    const json = await res.json();
    if (json.success) {
      setUsers((prev) => [...prev, { email: newEmail, role: newRole, name: newName }]);
      setNewEmail(""); setNewName(""); setNewPw(""); setShowAdd(false);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } else {
      setError(json.error ?? "Fout bij toevoegen");
    }
    setAdding(false);
  }

  async function handleRemove(email: string) {
    if (email === currentUser) { alert("Je kunt jezelf niet verwijderen"); return; }
    if (!confirm(`${email} verwijderen?`)) return;
    setSaving(true);
    await fetch("/api/cms/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setUsers((prev) => prev.filter((u) => u.email !== email));
    setSaving(false);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  }

  const inputStyle = { width: "100%", padding: "0.55rem 0.8rem", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: "0.82rem", boxSizing: "border-box" as const };

  return (
    <div style={{ maxWidth: 650 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Gebruikers</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {saved && <span style={{ fontSize: "0.78rem", color: "#4ade80" }}>✓ Opgeslagen</span>}
          <button onClick={() => { setShowAdd(!showAdd); setError(""); }} style={{ padding: "0.45rem 1rem", background: showAdd ? "transparent" : accent, color: showAdd ? "#555" : "#fff", border: `1px solid ${showAdd ? "#333" : accent}`, borderRadius: 8, fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
            {showAdd ? "Annuleren" : "+ Toevoegen"}
          </button>
        </div>
      </div>

      {showAdd && (
        <div style={{ background: "#111", border: `1px solid ${accent}44`, borderRadius: 12, padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#555", letterSpacing: "0.1em", marginBottom: "1rem" }}>NIEUWE GEBRUIKER</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>E-MAIL *</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="naam@email.nl" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>NAAM</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Volledige naam" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>WACHTWOORD *</label>
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Minimaal 8 tekens" style={inputStyle} />
              </div>
              <div>
                <label style={{ color: "#777", fontSize: "0.68rem", display: "block", marginBottom: 4 }}>ROL</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as "master" | "client")} style={{ ...inputStyle, appearance: "none" as const }}>
                  <option value="client">Client — beperkte toegang</option>
                  <option value="master">Master — volledige toegang</option>
                </select>
              </div>
            </div>
            {error && <div style={{ color: "#f87171", fontSize: "0.78rem" }}>{error}</div>}
            <button onClick={handleAdd} disabled={adding} style={{ padding: "0.6rem 1.4rem", background: accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: adding ? "not-allowed" : "pointer", alignSelf: "flex-start" }}>
              {adding ? "Toevoegen..." : "Gebruiker aanmaken"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "#555", fontSize: "0.85rem" }}>Laden...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {users.map((u) => (
            <div key={u.email} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 36, height: 36, background: u.role === "master" ? accent + "33" : "#1a1a1a", border: `1px solid ${u.role === "master" ? accent + "55" : "#2a2a2a"}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
                {u.role === "master" ? "👑" : "👤"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{u.name || u.email}</div>
                {u.name && <div style={{ color: "#555", fontSize: "0.72rem" }}>{u.email}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: 20, background: u.role === "master" ? accent + "22" : "#1a1a1a", color: u.role === "master" ? accent : "#555", border: `1px solid ${u.role === "master" ? accent + "44" : "#2a2a2a"}` }}>
                  {u.role === "master" ? "Master" : "Client"}
                </span>
                {u.email === currentUser ? (
                  <span style={{ fontSize: "0.68rem", color: "#555" }}>Jij</span>
                ) : (
                  <button onClick={() => handleRemove(u.email)} disabled={saving} style={{ background: "none", border: "1px solid #3a1a1a", color: "#c44", borderRadius: 8, padding: "0.3rem 0.75rem", fontSize: "0.72rem", cursor: saving ? "not-allowed" : "pointer" }}>Verwijder</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
