"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileCode,
  Plus,
  Minus,
  Rocket,
  TrendingUp,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  usageCount: number;
  lastUsed: string;
  appliedTo: string[];
  code: {
    language: string;
    filename: string;
    before: string;
    after: string;
  };
  diff: {
    added: string[];
    removed: string[];
  };
  impact: string;
  estimatedTime: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedDeployment, setSelectedDeployment] = useState<string>("");
  const [deployments, setDeployments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setFilteredTemplates(data);
      })
      .catch((err) => console.error("Failed to fetch templates:", err));

    fetch("/api/deployments")
      .then((res) => res.json())
      .then((data) => setDeployments(data))
      .catch((err) => console.error("Failed to fetch deployments:", err));
  }, []);

  useEffect(() => {
    let filtered = templates;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  }, [selectedCategory, searchQuery, templates]);

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const applyTemplate = (template: Template) => {
    if (!selectedDeployment) {
      toast.error("Please select a deployment first");
      return;
    }
    toast.success(`Applied "${template.title}" to ${selectedDeployment}`);
    // In a real app, this would trigger the template application
  };

  const impactColors = {
    high: "destructive",
    medium: "secondary",
    low: "outline",
  };

  const categoryColors = {
    "field-mapping": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    configuration: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "code-pattern": "bg-green-500/10 text-green-500 border-green-500/20",
  };

  const renderCodeDiff = (template: Template) => {
    const beforeLines = template.code.before.split("\n");
    const afterLines = template.code.after.split("\n");

    return (
      <div className="space-y-4">
        <Tabs defaultValue="diff" className="w-full">
          <TabsList>
            <TabsTrigger value="diff">Diff View</TabsTrigger>
            <TabsTrigger value="before">Before</TabsTrigger>
            <TabsTrigger value="after">After</TabsTrigger>
          </TabsList>

          <TabsContent value="diff" className="space-y-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
                <span className="text-sm font-mono">{template.code.filename}</span>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="gap-1">
                    <Plus className="h-3 w-3 text-green-500" />
                    {template.diff.added.length} additions
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Minus className="h-3 w-3 text-red-500" />
                    {template.diff.removed.length} removals
                  </Badge>
                </div>
              </div>
              <div className="bg-background max-h-[600px] overflow-y-auto">
                {beforeLines.map((line, idx) => {
                  const afterLine = afterLines[idx];
                  const isChanged = line !== afterLine && afterLine !== undefined;
                  const isRemoved = afterLine === undefined;
                  const isContext = !isChanged && !isRemoved;

                  if (isRemoved) {
                    return (
                      <div
                        key={`removed-${idx}`}
                        className="flex items-start gap-2 px-3 py-1 font-mono text-xs bg-red-500/10 border-l-2 border-red-500"
                      >
                        <span className="text-muted-foreground w-8 text-right select-none">
                          {idx + 1}
                        </span>
                        <span className="w-4 flex items-center justify-center">
                          <Minus className="h-3 w-3 text-red-500" />
                        </span>
                        <span className="flex-1 text-red-400 line-through">{line}</span>
                      </div>
                    );
                  }

                  if (isChanged) {
                    return (
                      <div key={`changed-${idx}`} className="space-y-0">
                        <div className="flex items-start gap-2 px-3 py-1 font-mono text-xs bg-red-500/10 border-l-2 border-red-500">
                          <span className="text-muted-foreground w-8 text-right select-none">
                            {idx + 1}
                          </span>
                          <span className="w-4 flex items-center justify-center">
                            <Minus className="h-3 w-3 text-red-500" />
                          </span>
                          <span className="flex-1 text-red-400 line-through">{line}</span>
                        </div>
                        <div className="flex items-start gap-2 px-3 py-1 font-mono text-xs bg-green-500/10 border-l-2 border-green-500">
                          <span className="text-muted-foreground w-8 text-right select-none">
                            {idx + 1}
                          </span>
                          <span className="w-4 flex items-center justify-center">
                            <Plus className="h-3 w-3 text-green-500" />
                          </span>
                          <span className="flex-1 text-green-400">{afterLine}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`context-${idx}`}
                      className="flex items-start gap-2 px-3 py-1 font-mono text-xs bg-muted/30"
                    >
                      <span className="text-muted-foreground w-8 text-right select-none">
                        {idx + 1}
                      </span>
                      <span className="w-4"></span>
                      <span className="flex-1">{line}</span>
                    </div>
                  );
                })}
                {afterLines.length > beforeLines.length &&
                  afterLines.slice(beforeLines.length).map((line, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="flex items-start gap-2 px-3 py-1 font-mono text-xs bg-green-500/10 border-l-2 border-green-500"
                    >
                      <span className="text-muted-foreground w-8 text-right select-none">
                        {beforeLines.length + idx + 1}
                      </span>
                      <span className="w-4 flex items-center justify-center">
                        <Plus className="h-3 w-3 text-green-500" />
                      </span>
                      <span className="flex-1 text-green-400">{line}</span>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="before">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-3 py-2 border-b">
                <span className="text-sm font-mono">{template.code.filename}</span>
              </div>
              <div className="bg-[#1e1e1e] p-6 overflow-x-auto max-h-[600px] overflow-y-auto">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                  <code>{template.code.before}</code>
                </pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="after">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-3 py-2 border-b">
                <span className="text-sm font-mono">{template.code.filename}</span>
              </div>
              <div className="bg-[#1e1e1e] p-6 overflow-x-auto max-h-[600px] overflow-y-auto">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                  <code>{template.code.after}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Common edits to the core product frequently made across deployments
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </div>
                  <Badge
                    variant={impactColors[template.impact as keyof typeof impactColors] as any}
                  >
                    {template.impact}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge
                    variant="outline"
                    className={categoryColors[template.category as keyof typeof categoryColors]}
                  >
                    {template.category.replace("-", " ")}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{template.usageCount} uses</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">

                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Applied to:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.appliedTo.slice(0, 3).map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                      {template.appliedTo.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.appliedTo.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <FileCode className="h-4 w-4 mr-2" />
                        View Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{template.title}</DialogTitle>
                        <DialogDescription className="text-base">{template.description}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        {renderCodeDiff(template)}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1" onClick={() => setSelectedTemplate(template)}>
                        <Rocket className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply Template</DialogTitle>
                        <DialogDescription>
                          Select a deployment to apply "{template.title}" to
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Select value={selectedDeployment} onValueChange={setSelectedDeployment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deployment" />
                          </SelectTrigger>
                          <SelectContent>
                            {deployments.map((dep) => (
                              <SelectItem key={dep.id} value={dep.id}>
                                {dep.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className="w-full"
                          onClick={() => applyTemplate(template)}
                          disabled={!selectedDeployment}
                        >
                          Apply Template
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No templates found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

