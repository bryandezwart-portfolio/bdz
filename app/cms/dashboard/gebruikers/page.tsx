"use client";
import { useEffect, useState } from "react";
import { cmsConfig } from "@/lib/cms-config";

type User = { username: string; role: string; email?: string };

export default function GebruikersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"client" | "master">("client");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/cms/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/cms/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword, email: newEmail, role: newRole }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error || "Aanmaken mislukt");
    } else {
      setSuccess(`Gebruiker "${newUsername}" aangemaakt`);
      setNewUsername("");
      setNewPassword("");
      setNewEmail("");
      setNewRole("client");
      load();
    }
  }

  async function deleteUser(username: string) {
    if (!confirm(`Gebruiker "${username}" verwijderen?`)) return;
    await fetch(`/api/cms/users?username=${encodeURIComponent(username)}`, { method: "DELETE" });
    load();
  }

  const accent = cmsConfig.accentColor;
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.55rem 0.75rem",
    border: "1px solid #333",
    borderRadius: 6,
    fontSize: "0.88rem",
    boxSizing: "border-box",
    outline: "none",
    background: "#1a1a1a",
    color: "#fff",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#999",
    display: "block",
    marginBottom: 4,
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Gebruikers</h1>

      {/* Gebruikerslijst */}
      <div style={{ background: "#111", borderRadius: 10, border: "1px solid #222", marginBottom: "2rem", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "1rem", color: "#666" }}>Laden…</p>
        ) : users.length === 0 ? (
          <p style={{ padding: "1rem", color: "#666" }}>Geen extra gebruikers</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1a1a1a", borderBottom: "1px solid #222" }}>
                <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.78rem", color: "#666" }}>Gebruiker</th>
                <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.78rem", color: "#666" }}>E-mail</th>
                <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.78rem", color: "#666" }}>Rol</th>
                <th style={{ padding: "0.6rem 0.5rem" }} />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.username} style={{ borderBottom: "1px solid #1e1e1e" }}>
                  <td style={{ padding: "0.6rem 1rem", fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>{u.username}</td>
                  <td style={{ padding: "0.6rem 1rem", fontSize: "0.85rem", color: "#888" }}>{u.email || "—"}</td>
                  <td style={{ padding: "0.6rem 1rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: u.role === "master" ? "#fef3c7" : "#e0f2fe",
                      color: u.role === "master" ? "#92400e" : "#0369a1",
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "0.6rem 0.5rem", textAlign: "right" }}>
                    <button
                      onClick={() => deleteUser(u.username)}
                      style={{ background: "none", border: "none", color: "#e63946", cursor: "pointer", fontSize: "0.8rem" }}
                    >
                      Verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Nieuwe gebruiker */}
      <div style={{ background: "#111", borderRadius: 10, border: "1px solid #222", padding: "1.25rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", marginTop: 0, color: "#fff" }}>Nieuwe gebruiker</h2>
        <form onSubmit={createUser} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Gebruikersnaam</label>
              <input
                style={inputStyle}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                placeholder="gebruikersnaam"
              />
            </div>
            <div>
              <label style={labelStyle}>Wachtwoord</label>
              <input
                type="password"
                style={inputStyle}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>E-mailadres (voor wachtwoord vergeten)</label>
              <input
                type="email"
                style={inputStyle}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="email@domein.nl"
              />
            </div>
            <div>
              <label style={labelStyle}>Rol</label>
              <select
                style={inputStyle}
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as "client" | "master")}
              >
                <option value="client">Client</option>
                <option value="master">Master</option>
              </select>
            </div>
          </div>

          {error && <p style={{ color: "#e63946", fontSize: "0.82rem", margin: 0 }}>{error}</p>}
          {success && <p style={{ color: "#16a34a", fontSize: "0.82rem", margin: 0 }}>{success}</p>}

          <button
            type="submit"
            disabled={creating}
            style={{
              alignSelf: "flex-start",
              padding: "0.6rem 1.4rem",
              background: creating ? "#ccc" : accent,
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: creating ? "not-allowed" : "pointer",
            }}
          >
            {creating ? "Aanmaken…" : "Aanmaken"}
          </button>
        </form>
      </div>
    </div>
  );
}
