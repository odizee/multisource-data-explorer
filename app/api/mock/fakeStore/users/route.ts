import { NextResponse } from "next/server";

const users = [
  {
    id: 1,
    email: "john@example.com",
    username: "johnd",
    name: { firstname: "John", lastname: "Doe" },
    address: { city: "New York" },
    phone: "123-456-7890",
  },
  {
    id: 2,
    email: "jane@example.com",
    username: "janes",
    name: { firstname: "Jane", lastname: "Smith" },
    address: { city: "Berlin" },
    phone: "555-555-5555",
  },
];

export async function GET() {
  return NextResponse.json(users);
}

