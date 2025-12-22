import { fakeStoreApi } from "@/lib/api/fakeStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const p = await params;
    const user = await fakeStoreApi.getUser(parseInt(p.id));
    return { title: `${user.name.firstname} ${user.name.lastname}` };
  } catch (e) {
    return { title: "User Not Found" };
  }
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;
  let user;
  let error;

  try {
    user = await fakeStoreApi.getUser(parseInt(id));
  } catch (e) {
    error = "Failed to load user details";
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="mb-4">{error || "User not found"}</p>
        <Button asChild>
          <Link href="/">Back to Explorer</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Explorer
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {user.name.firstname} {user.name.lastname}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">{user.username}</Badge>
          <span className="text-sm text-muted-foreground">{user.email}</span>
          {user.address?.city && (
            <span className="text-sm text-muted-foreground">City {user.address.city}</span>
          )}
          {user.phone && (
            <span className="text-sm text-muted-foreground">Phone {user.phone}</span>
          )}
        </div>
      </div>
    </div>
  );
}

