import { githubApi } from "@/lib/api/github";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: { owner: string; name: string };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const repo = await githubApi.getRepo(params.owner, params.name);
    return { title: repo.full_name };
  } catch (e) {
    return { title: "Repository Not Found" };
  }
}

export default async function RepoPage({ params }: PageProps) {
  const { owner, name } = await params;

  let repo;
  let error;

  try {
    repo = await githubApi.getRepo(owner, name);
  } catch {
    error = "Failed to load repository details";
  }

  if (error || !repo) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="mb-4">{error || "Repository not found"}</p>
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
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border">
              <Image
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold break-all">{repo.full_name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {repo.language || "Unknown Language"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Updated on {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Button asChild className="gap-2">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <p className="text-lg text-muted-foreground max-w-3xl">
          {repo.description || "No description provided."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4" />
                Stars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repo.stargazers_count.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GitFork className="h-4 w-4" />
                Forks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repo.forks_count.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Open Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {repo.open_issues_count.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
