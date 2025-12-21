import { render, screen } from "@testing-library/react";
import RepoPage from "./page";
import { githubApi } from "@/lib/api/github";

// Mock the githubApi
jest.mock("@/lib/api/github", () => ({
  githubApi: {
    getRepo: jest.fn(),
  },
}));

// Mock Next.js Link and Image
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("next/image", () => {
  return ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  );
});

describe("RepoPage", () => {
  const mockRepo = {
    full_name: "facebook/react",
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    stargazers_count: 123456,
    forks_count: 45678,
    open_issues_count: 123,
    language: "JavaScript",
    updated_at: "2023-01-01T00:00:00Z",
    html_url: "https://github.com/facebook/react",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
  };

  const params = Promise.resolve({ owner: "facebook", name: "react" });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders repository details correctly", async () => {
    (githubApi.getRepo as jest.Mock).mockResolvedValue(mockRepo);

    const resolvedParams = await params;
    const jsx = await RepoPage({ params: resolvedParams });
    render(jsx);

    expect(screen.getByText("facebook/react")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A declarative, efficient, and flexible JavaScript library for building user interfaces."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("123,456")).toBeInTheDocument(); // Stars
    expect(screen.getByText("45,678")).toBeInTheDocument(); // Forks
    expect(screen.getByText("123")).toBeInTheDocument(); // Open Issues
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("View on GitHub")).toHaveAttribute(
      "href",
      "https://github.com/facebook/react"
    );
  });

  it("renders error state when repository fetch fails", async () => {
    (githubApi.getRepo as jest.Mock).mockRejectedValue(new Error("API Error"));

    const resolvedParams = await params;
    const jsx = await RepoPage({ params: resolvedParams });
    render(jsx);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(
      screen.getByText("Failed to load repository details")
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Explorer")).toBeInTheDocument();
  });

  it("renders default values for missing optional fields", async () => {
    const incompleteRepo = {
      ...mockRepo,
      description: null,
      language: null,
    };
    (githubApi.getRepo as jest.Mock).mockResolvedValue(incompleteRepo);

    const resolvedParams = await params;
    const jsx = await RepoPage({ params: resolvedParams });
    render(jsx);

    expect(screen.getByText("No description provided.")).toBeInTheDocument();
    expect(screen.getByText("Unknown Language")).toBeInTheDocument();
  });
});
