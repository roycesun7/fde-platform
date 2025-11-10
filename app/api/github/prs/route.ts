import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const repo = searchParams.get("repo");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!token || !repo) {
      return NextResponse.json(
        { error: "Token and repository are required" },
        { status: 400 }
      );
    }

    const [owner, repoName] = repo.split("/");

    const octokit = new Octokit({
      auth: token,
    });

    // Get recent PRs
    const { data } = await octokit.pulls.list({
      owner,
      repo: repoName,
      state: "all", // open, closed, or all
      sort: "updated",
      direction: "desc",
      per_page: limit,
    });

    const prs = data.map((pr) => ({
      number: pr.number,
      title: pr.title,
      status: pr.state === "open" ? "open" : pr.merged_at ? "merged" : "closed",
      branch: pr.head.ref,
      author: pr.user?.login || "Unknown",
      createdAt: pr.created_at,
      url: pr.html_url,
      body: pr.body,
    }));

    return NextResponse.json({ prs });
  } catch (error: any) {
    console.error("GitHub PRs error:", error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch PRs" },
      { status: 500 }
    );
  }
}

