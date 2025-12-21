import { NextResponse } from "next/server";

const repo = {
  id: 100,
  name: "react",
  full_name: "facebook/react",
  owner: {
    login: "facebook",
    avatar_url: "https://example.com/avatar.png",
    html_url: "",
  },
  html_url: "https://github.com/facebook/react",
  description: "A UI library",
  stargazers_count: 123456,
  language: "JavaScript",
  forks_count: 45678,
  open_issues_count: 123,
  updated_at: "2023-01-01T00:00:00Z",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner: string; name: string }> }
) {
  const p = await params;
  if (p.owner === "facebook" && p.name === "react") {
    return NextResponse.json(repo);
  }
  return NextResponse.json({}, { status: 404 });
}
