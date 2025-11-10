import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, repo, title, body: prBody, branch, baseBranch = "main", files } = body;

    if (!token || !repo || !title || !branch) {
      return NextResponse.json(
        { error: "Token, repository, title, and branch are required" },
        { status: 400 }
      );
    }

    const [owner, repoName] = repo.split("/");

    const octokit = new Octokit({
      auth: token,
    });

    // Check if branch exists, if not create it
    let branchExists = false;
    try {
      await octokit.repos.getBranch({
        owner,
        repo: repoName,
        branch,
      });
      branchExists = true;
    } catch (error: any) {
      if (error.status === 404) {
        // Branch doesn't exist, we'll need to create it
        // First get the default branch SHA
        const { data: defaultBranch } = await octokit.repos.getBranch({
          owner,
          repo: repoName,
          branch: baseBranch,
        });

        // Create the new branch
        await octokit.git.createRef({
          owner,
          repo: repoName,
          ref: `refs/heads/${branch}`,
          sha: defaultBranch.commit.sha,
        });
      } else {
        throw error;
      }
    }

    // If files are provided, create/update them
    if (files && Array.isArray(files)) {
      for (const file of files) {
        try {
          // Get file SHA if it exists
          let sha: string | undefined;
          try {
            const { data: existingFile } = await octokit.repos.getContent({
              owner,
              repo: repoName,
              path: file.path,
              ref: branch,
            });
            if (Array.isArray(existingFile)) {
              throw new Error("Path is a directory");
            }
            sha = existingFile.sha;
          } catch (error: any) {
            if (error.status !== 404) {
              throw error;
            }
          }

          // Create or update file
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo: repoName,
            path: file.path,
            message: file.message || `Update ${file.path}`,
            content: Buffer.from(file.content).toString("base64"),
            branch,
            sha,
          });
        } catch (error: any) {
          console.error(`Error updating file ${file.path}:`, error);
          // Continue with other files
        }
      }
    }

    // Create the pull request
    const { data: pr } = await octokit.pulls.create({
      owner,
      repo: repoName,
      title,
      body: prBody || "",
      head: branch,
      base: baseBranch,
    });

    return NextResponse.json({
      success: true,
      prNumber: pr.number,
      url: pr.html_url,
      status: pr.state,
      title: pr.title,
    });
  } catch (error: any) {
    console.error("GitHub create PR error:", error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid token. Please check your Personal Access Token." },
        { status: 401 }
      );
    }

    if (error.status === 422) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Unable to create PR. Branch may already have an open PR." },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create pull request" },
      { status: 500 }
    );
  }
}

