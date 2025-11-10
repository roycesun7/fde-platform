import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, repo } = body;

    if (!token || !repo) {
      return NextResponse.json(
        { error: "Token and repository are required" },
        { status: 400 }
      );
    }

    // Validate repo format
    const repoMatch = repo.match(/^([^\/]+)\/([^\/]+)$/);
    if (!repoMatch) {
      return NextResponse.json(
        { error: "Invalid repository format. Use owner/repo" },
        { status: 400 }
      );
    }

    const [owner, repoName] = repo.split("/");

    // Initialize Octokit
    const octokit = new Octokit({
      auth: token,
    });

    // Test connection by getting repository info
    const { data } = await octokit.repos.get({
      owner,
      repo: repoName,
    });

    return NextResponse.json({
      success: true,
      repository: {
        name: data.name,
        fullName: data.full_name,
        private: data.private,
        defaultBranch: data.default_branch,
        description: data.description,
      },
    });
  } catch (error: any) {
    console.error("GitHub test error:", error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid token. Please check your Personal Access Token." },
        { status: 401 }
      );
    }
    
    if (error.status === 404) {
      return NextResponse.json(
        { error: "Repository not found. Please check the repository name." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to connect to GitHub" },
      { status: 500 }
    );
  }
}

