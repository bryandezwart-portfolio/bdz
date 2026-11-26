"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { username: string; role: string };

export default function GebruikersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "client" });
  const [changePass, setChangePass] = useState<{ [key: string]: string }>({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const load = async () => {
    const r = await fetch("/api/cms/users");
    if (r.status === 403) { router.push("/cms/dashboard"); return; }
    const d = await r.json();
    setUsers(d.users || []);
    setReady(true);
  };

  useEffect(() => { load(); }, []);

  if (!ready) return <div style={{ color: "#555", padding: "2rem" }}>Laden...</div>;

  const addUser = async () => {
    if (!newUser.username || !newUser.password) return setMsg("Vul gebruikersnaam en wachtwoord in");
    setLoading(true);
    const r = await fetch("/api/cms/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
    const d = await r.json();
    setLoading(false);
    if (d.ok) { setMsg("Gebruiker aangemaakt ✓"); setNewUser({ username: "", password: "", role: "client" }); load(); }
    else setMsg(d.error);
  };

  const deleteUser = async (username: string) => {
    if (!confirm("Gebruiker verwijderen?")) return;
    await fetch("/api/cms/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) });
    load();
  };

  const updatePass = async (username: string) => {
    const password = changePass[username];
    if (!password) return setMsg("Vul een nieuw wachtwoord in");
    const r = await fetch("/api/cms/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const d = await r.json();
    if (d.ok) { setMsg("Wachtwoord bijgewerkt ✓"); setChangePass((p) => ({ ...p, [username]: "" })); }
    else setMsg(d.error);
  };

  const inp = { background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, color: "#fff", padding: "0.45rem 0.75rem", fontSize: "0.85rem" } as React.CSSProperties;

  return (
    <div>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>Gebruikers</h1>
      <p style={{ color: "#666", fontSize: "0.82rem", marginBottom: "2rem" }}>Beheer wie er kan inloggen in dit CMS</p>
      {msg && <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8, padding: "0.6rem 1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#6f6" }}>{msg}</div>}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#aaa", marginBottom: "1rem" }}>Actieve gebruikers</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>master</span>
              <span style={{ marginLeft: "0.75rem", fontSize: "0.72rem", background: "#9ca3af22", color: "#9ca3af", borderRadius: 4, padding: "0.15rem 0.5rem" }}>master</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#555" }}></span>
          </div>
          {users.map((u) => (
            <div key={u.username} style={{ background: "#111", border: "1px solid #222", borderRadius: 10, padding: "1rem 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.username}</span>
                  <span style={{ marginLeft: "0.75rem", fontSize: "0.72rem", background: "#33333388", color: "#aaa", borderRadius: 4, padding: "0.15rem 0.5rem" }}>{u.role}</span>
                </div>
                <button onClick={() => deleteUser(u.username)} style={{ background: "none", border: "1px solid #442222", color: "#9ca3af", borderRadius: 6, padding: "0.3rem 0.7rem", fontSize: "0.75rem", cursor: "pointer" }}>Verwijderen</button>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="password" placeholder="Nieuw wachtwoord" value={changePass[u.username] || ""} onChange={(e) => setChangePass((p) => ({ ...p, [u.username]: e.target.value }))} style={{ ...inp, flex: 1 }} />
                <button onClick={() => updatePass(u.username)} style={{ background: "#1a1a1a", border: "1px solid #333", color: "#aaa", borderRadius: 6, padding: "0.3rem 0.9rem", fontSize: "0.78rem", cursor: "pointer" }}>Bijwerken</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "1.5rem" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#aaa", marginBottom: "1.25rem" }}>Nieuwe gebruiker aanmaken</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input type="text" placeholder="Gebruikersnaam" value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} style={inp} />
          <input type="password" placeholder="Wachtwoord" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} style={inp} />
          <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value }))} style={inp}>
            <option value="client">Klant (teksten, media, SEO)</option>
            <option value="master">Master (alles)</option>
          </select>
          <button onClick={addUser} disabled={loading} style={{ background: "#9ca3af", border: "none", color: "#fff", borderRadius: 8, padding: "0.6rem 1.25rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}>
            {loading ? "Aanmaken..." : "Gebruiker aanmaken"}
          </button>
        </div>
      </div>
    </div>
  );
}
