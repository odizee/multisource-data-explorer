import { render, screen } from "@testing-library/react";
import { CountryList } from "./CountryList";

jest.mock("@/hooks/useDataFetcher", () => ({
  useDataFetcher: jest.fn(),
}));

const { useDataFetcher } = jest.requireMock("@/hooks/useDataFetcher");

const countries = [
  {
    name: { common: "United States", official: "United States of America" },
    cca3: "USA",
    capital: ["Washington, D.C."],
    region: "Americas",
    population: 331000000,
    flags: { png: "https://flagcdn.com/w320/us.png", svg: "", alt: "US flag" },
  },
  {
    name: { common: "Germany", official: "Federal Republic of Germany" },
    cca3: "DEU",
    capital: ["Berlin"],
    region: "Europe",
    population: 83100000,
    flags: { png: "https://flagcdn.com/w320/de.png", svg: "", alt: "Germany flag" },
  },
];

describe("CountryList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders countries and shows region and population", () => {
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: countries,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<CountryList searchQuery="" isEnabled onToggle={jest.fn()} />);

    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.getAllByText(/Pop\./).length).toBeGreaterThan(0);
  });

  it("filters by region and capital", () => {
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: countries,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<CountryList searchQuery="europe" isEnabled onToggle={jest.fn()} />);
    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.queryByText("United States")).not.toBeInTheDocument();
  });

  it("shows disabled state", () => {
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<CountryList searchQuery="" isEnabled={false} onToggle={jest.fn()} />);
    expect(screen.getByText("Dataset disabled")).toBeInTheDocument();
  });
});

