"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "sonner";

interface PRPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deploymentId: string;
  mappings: any[];
}

export function PRPreviewDrawer({
  open,
  onOpenChange,
  deploymentId,
  mappings,
}: PRPreviewDrawerProps) {
  const missingMapping = mappings.find((m) => m.status === "missing");

  const handleCreatePR = async () => {
    try {
      const res = await fetch("/api/actions/create-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deploymentId,
          diff: `Add mapping for ${missingMapping?.source}`,
        }),
      });

      const data = await res.json();
      toast.success(`PR #${data.prNumber} created successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create PR");
    }
  };

  const diffContent = `--- a/mappings/${deploymentId}.ts
+++ b/mappings/${deploymentId}.ts
@@ -10,6 +10,13 @@ export function mapEvent(event: any) {
     'subscription.id': event.subscription_id,
   };
 
+  // Add missing plan_tier mapping
+  if (event.plan_tier) {
+    mapped['subscription.planTier'] = event.plan_tier.toLowerCase();
+  }
+
   return mapped;
 }`;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Preview PR: Add Missing Field Mappings</DrawerTitle>
          <DrawerDescription>
            Review the changes before creating a pull request
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 overflow-auto">
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap">{diffContent}</pre>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">Changes Summary:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Add mapping for plan_tier → subscription.planTier</li>
              <li>Normalize value to lowercase</li>
              <li>Handle missing values gracefully</li>
            </ul>
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleCreatePR}>Create PR</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

