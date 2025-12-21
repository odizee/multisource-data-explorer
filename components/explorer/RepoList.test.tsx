import { render, screen } from "@testing-library/react";
import { RepoList } from "./RepoList";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("@/hooks/useDataFetcher", () => ({
  useDataFetcher: jest.fn(),
}));

const { useDataFetcher } = jest.requireMock("@/hooks/useDataFetcher");

const makeRepo = (overrides: Partial<any> = {}) => ({
  id: Math.floor(Math.random() * 100000),
  name: "repo",
  full_name: "owner/repo",
  owner: { login: "owner", avatar_url: "", html_url: "" },
  html_url: "https://github.com/owner/repo",
  description: "Test repository",
  stargazers_count: 1234,
  language: "TypeScript",
  forks_count: 567,
  open_issues_count: 12,
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides,
});

describe("RepoList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders repositories with formatted counts and language", () => {
    const items = [
      makeRepo({ full_name: "foo/bar", owner: { login: "foo" }, name: "bar" }),
      makeRepo({ full_name: "baz/qux", owner: { login: "baz" }, name: "qux" }),
    ];
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: { items, total_count: items.length },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<RepoList searchQuery="" isEnabled onToggle={jest.fn()} />);

    expect(screen.getByText("foo/bar")).toBeInTheDocument();
    expect(screen.getByText("baz/qux")).toBeInTheDocument();
    expect(screen.getAllByText("1,234").length).toBeGreaterThan(0);
    expect(screen.getAllByText("567").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Test repository").length).toBeGreaterThan(0);
    // Link structure
    expect(screen.getByRole("link", { name: /foo\/bar/i })).toHaveAttribute(
      "href",
      "/repo/foo/bar"
    );
  });

  it("renders default description when missing", () => {
    const items = [makeRepo({ description: null })];
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: { items, total_count: items.length },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<RepoList searchQuery="" isEnabled onToggle={jest.fn()} />);

    expect(screen.getByText("No description available")).toBeInTheDocument();
  });

  it("shows empty state when no repositories found", () => {
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: { items: [], total_count: 0 },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<RepoList searchQuery="zzz" isEnabled onToggle={jest.fn()} />);

    expect(screen.getByText("No repositories found")).toBeInTheDocument();
  });

  it("shows disabled state when dataset is disabled", () => {
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<RepoList searchQuery="" isEnabled={false} onToggle={jest.fn()} />);

    expect(screen.getByText("Dataset disabled")).toBeInTheDocument();
  });
});
