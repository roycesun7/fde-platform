import { NextResponse } from "next/server";
import { JobStore } from "@/lib/JobStore";
import { Octokit } from "@octokit/rest";

export async function POST(request: Request) {
  const body = await request.json();
  const { deploymentId, diff, title, files, githubToken, githubRepo, branch } = body;

  // If GitHub credentials are provided, create a real PR
  if (githubToken && githubRepo && title) {
    try {
      const [owner, repoName] = githubRepo.split("/");
      const octokit = new Octokit({ auth: githubToken });
      
      // Generate branch name if not provided
      const branchName = branch || `fde/${deploymentId}-${Date.now()}`;
      const baseBranch = "main";

      // Get default branch SHA
      const { data: defaultBranch } = await octokit.repos.getBranch({
        owner,
        repo: repoName,
        branch: baseBranch,
      });

      // Create new branch
      try {
        await octokit.git.createRef({
          owner,
          repo: repoName,
          ref: `refs/heads/${branchName}`,
          sha: defaultBranch.commit.sha,
        });
      } catch (error: any) {
        // Branch might already exist, that's okay
        if (error.status !== 422) {
          throw error;
        }
      }

      // Create/update files if provided
      if (files && Array.isArray(files)) {
        for (const file of files) {
          try {
            let sha: string | undefined;
            try {
              const { data: existingFile } = await octokit.repos.getContent({
                owner,
                repo: repoName,
                path: file.path,
                ref: branchName,
              });
              if (!Array.isArray(existingFile)) {
                sha = existingFile.sha;
              }
            } catch (error: any) {
              if (error.status !== 404) {
                throw error;
              }
            }

            await octokit.repos.createOrUpdateFileContents({
              owner,
              repo: repoName,
              path: file.path,
              message: file.message || `Update ${file.path}`,
              content: Buffer.from(file.content).toString("base64"),
              branch: branchName,
              sha,
            });
          } catch (error: any) {
            console.error(`Error updating file ${file.path}:`, error);
          }
        }
      }

      // Create the PR
      const { data: pr } = await octokit.pulls.create({
        owner,
        repo: repoName,
        title: title || `Fix: ${deploymentId} deployment`,
        body: diff || "Auto-generated PR from Foundry FDE",
        head: branchName,
        base: baseBranch,
      });

      // Create a job for tracking
      const job = JobStore.create("create_pr", deploymentId, {
        diff,
        prNumber: pr.number,
        url: pr.html_url,
      });

      return NextResponse.json({
        jobId: job.id,
        prNumber: pr.number,
        url: pr.html_url,
        status: pr.state,
        success: true,
      });
    } catch (error: any) {
      console.error("GitHub PR creation error:", error);
      
      // Fall back to mock if GitHub fails
      if (error.status === 401 || error.status === 403) {
        return NextResponse.json(
          { error: "GitHub authentication failed. Please check your token." },
          { status: 401 }
        );
      }
      
      // Continue with mock for other errors
    }
  }

  // Fallback to mock PR creation
  const job = JobStore.create("create_pr", deploymentId, {
    diff,
    prNumber: Math.floor(Math.random() * 1000) + 100,
  });

  const prNumber = job.meta.prNumber;
  const prUrl = `https://github.com/foundry/deployments/pull/${prNumber}`;

  return NextResponse.json({
    jobId: job.id,
    prNumber,
    url: prUrl,
    status: "created",
    mock: true, // Indicate this is a mock PR
  });
}

