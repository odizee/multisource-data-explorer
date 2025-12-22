import { NextResponse } from "next/server";

const countries = [
  {
    name: { common: "United States", official: "United States of America" },
    cca3: "USA",
    capital: ["Washington, D.C."],
    region: "Americas",
    population: 331000000,
    flags: { png: "https://flagcdn.com/w320/us.png", svg: "", alt: "US flag" },
    languages: { eng: "English" },
    currencies: { USD: { name: "United States dollar", symbol: "$" } },
  },
  {
    name: { common: "Germany", official: "Federal Republic of Germany" },
    cca3: "DEU",
    capital: ["Berlin"],
    region: "Europe",
    population: 83100000,
    flags: { png: "https://flagcdn.com/w320/de.png", svg: "", alt: "Germany flag" },
    languages: { deu: "German" },
    currencies: { EUR: { name: "Euro", symbol: "€" } },
  },
  {
    name: { common: "Japan", official: "Japan" },
    cca3: "JPN",
    capital: ["Tokyo"],
    region: "Asia",
    population: 125800000,
    flags: { png: "https://flagcdn.com/w320/jp.png", svg: "", alt: "Japan flag" },
    languages: { jpn: "Japanese" },
    currencies: { JPY: { name: "Japanese yen", symbol: "¥" } },
  },
];

export async function GET() {
  return NextResponse.json(countries);
}

