import { NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_OWNER = "bryandezwart-portfolio";
const GITHUB_REPO = "bdz";
const FILE_PATH = "public/site-content.json";

export async function POST(req: Request) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN niet ingesteld" }, { status: 500 });
  }

  const data = await req.json();
  const content = Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64");

  // Haal de huidige SHA op (nodig voor update)
  const getRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  let sha: string | undefined;
  if (getRes.ok) {
    const getData = await getRes.json();
    sha = getData.sha;
  }

  // Schrijf het bestand naar GitHub
  const putRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update site-content.json via admin",
        content,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
