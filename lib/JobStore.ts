export type JobStatus = "queued" | "running" | "succeeded" | "failed";
export type JobType = "backfill" | "replay_events" | "create_pr";

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  deploymentId: string;
  startedAt: string;
  finishedAt?: string;
  meta: Record<string, any>;
}

class JobStoreClass {
  private jobs: Map<string, Job> = new Map();
  private nextId = 1;

  constructor() {
    // Seed with 2 past jobs for Dropbox
    this.seed();
  }

  private seed() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    this.jobs.set("job-seed-1", {
      id: "job-seed-1",
      type: "backfill",
      status: "succeeded",
      deploymentId: "dropbox",
      startedAt: twoHoursAgo.toISOString(),
      finishedAt: oneHourAgo.toISOString(),
      meta: { count: 250, processed: 250 },
    });

    this.jobs.set("job-seed-2", {
      id: "job-seed-2",
      type: "replay_events",
      status: "succeeded",
      deploymentId: "dropbox",
      startedAt: oneHourAgo.toISOString(),
      finishedAt: new Date(oneHourAgo.getTime() + 5 * 60 * 1000).toISOString(),
      meta: { count: 15, replayed: 15 },
    });

    this.nextId = 3;
  }

  create(type: JobType, deploymentId: string, meta: Record<string, any> = {}): Job {
    const id = `job-${this.nextId++}`;
    const job: Job = {
      id,
      type,
      status: "queued",
      deploymentId,
      startedAt: new Date().toISOString(),
      meta,
    };
    this.jobs.set(id, job);
    return job;
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  list(deploymentId?: string): Job[] {
    const allJobs = Array.from(this.jobs.values());
    if (deploymentId) {
      return allJobs.filter((j) => j.deploymentId === deploymentId);
    }
    return allJobs;
  }

  update(id: string, updates: Partial<Job>): Job | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const updated = { ...job, ...updates };
    this.jobs.set(id, updated);
    return updated;
  }

  // Advance job states for demo purposes
  tick(): Job[] {
    const updated: Job[] = [];
    
    for (const job of this.jobs.values()) {
      if (job.status === "queued") {
        const updatedJob = this.update(job.id, { status: "running" });
        if (updatedJob) updated.push(updatedJob);
      } else if (job.status === "running") {
        const updatedJob = this.update(job.id, {
          status: "succeeded",
          finishedAt: new Date().toISOString(),
        });
        if (updatedJob) updated.push(updatedJob);
      }
    }

    return updated;
  }
}

// Singleton instance
export const JobStore = new JobStoreClass();

