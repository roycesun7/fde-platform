"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GitPullRequest, Play, Repeat, Rocket } from "lucide-react";
import { toast } from "sonner";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runAction = async (action: string) => {
    setOpen(false);

    switch (action) {
      case "open-acme":
        router.push("/d/dropbox");
        break;

      case "generate-pr":
        toast.info("Generating PR...");
        try {
          const res = await fetch("/api/actions/create-pr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deploymentId: "dropbox",
              diff: "Sample diff",
            }),
          });
          const data = await res.json();
          toast.success(`PR #${data.prNumber} created!`);
        } catch (error) {
          toast.error("Failed to create PR");
        }
        break;

      case "run-backfill":
        toast.info("Starting backfill...");
        try {
          const res = await fetch("/api/actions/run-backfill", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deploymentId: "dropbox",
              count: 123,
            }),
          });
          const data = await res.json();
          toast.success(`Backfill job ${data.jobId} queued`);
        } catch (error) {
          toast.error("Failed to start backfill");
        }
        break;

      case "replay-events":
        toast.info("Replaying events...");
        try {
          const res = await fetch("/api/actions/replay-events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deploymentId: "dropbox",
              count: 20,
            }),
          });
          const data = await res.json();
          toast.success(`Replay job ${data.jobId} queued`);
        } catch (error) {
          toast.error("Failed to replay events");
        }
        break;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runAction("open-acme")}>
            <Rocket className="mr-2 h-4 w-4" />
            <span>Open Dropbox Deployment</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runAction("generate-pr")}>
            <GitPullRequest className="mr-2 h-4 w-4" />
            <span>Generate PR</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction("run-backfill")}>
            <Play className="mr-2 h-4 w-4" />
            <span>Run Backfill (123 records)</span>
          </CommandItem>
          <CommandItem onSelect={() => runAction("replay-events")}>
            <Repeat className="mr-2 h-4 w-4" />
            <span>Replay 20 Events</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

