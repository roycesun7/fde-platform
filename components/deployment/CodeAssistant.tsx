"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Code2, 
  Send, 
  Check, 
  X, 
  FileCode, 
  Terminal, 
  GitBranch,
  Rocket,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  FileText
} from "lucide-react";

interface FileDiff {
  path: string;
  language: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
  status: 'pending' | 'approved' | 'rejected';
}

interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface CodeChange {
  id: string;
  prompt: string;
  files: FileDiff[];
  timestamp: Date;
  status: 'generating' | 'ready' | 'approved' | 'deployed';
  deploymentBranch?: string;
}

const samplePrompts = [
  "Add delta cursor support for incremental Dropbox sync",
  "Implement file conflict resolution with version tracking",
  "Add OAuth token refresh logic with automatic retry",
];

const thinkingSteps = [
  "Analyzing codebase structure...",
  "Identifying files to modify...",
  "Generating code changes...",
  "Computing diffs...",
];

// Mock function to generate realistic diffs
const generateCodeChanges = (prompt: string): FileDiff[] => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Dropbox file chunking for large files
  if (lowerPrompt.includes("chunk") || lowerPrompt.includes("150mb") || lowerPrompt.includes("large file")) {
    return [
      {
        path: "src/dropbox/upload.ts",
        language: "typescript",
        additions: 35,
        deletions: 8,
        status: 'pending',
        hunks: [
          {
            oldStart: 28,
            oldLines: 12,
            newStart: 28,
            newLines: 39,
            lines: [
              { type: 'context', content: 'export class DropboxUploader {', oldLineNumber: 28, newLineNumber: 28 },
              { type: 'context', content: '  private dbx: Dropbox;', oldLineNumber: 29, newLineNumber: 29 },
              { type: 'context', content: '  private readonly CHUNK_SIZE = 150 * 1024 * 1024; // 150MB', oldLineNumber: 30, newLineNumber: 30 },
              { type: 'context', content: '', oldLineNumber: 31, newLineNumber: 31 },
              { type: 'remove', content: '  async uploadFile(filePath: string, content: Buffer): Promise<void> {', oldLineNumber: 32 },
              { type: 'remove', content: '    await this.dbx.filesUpload({', oldLineNumber: 33 },
              { type: 'remove', content: '      path: filePath,', oldLineNumber: 34 },
              { type: 'remove', content: '      contents: content,', oldLineNumber: 35 },
              { type: 'remove', content: '      mode: { ".tag": "overwrite" }', oldLineNumber: 36 },
              { type: 'remove', content: '    });', oldLineNumber: 37 },
              { type: 'remove', content: '  }', oldLineNumber: 38 },
              { type: 'add', content: '  async uploadFile(filePath: string, content: Buffer): Promise<void> {', newLineNumber: 32 },
              { type: 'add', content: '    // Use chunked upload for files over 150MB', newLineNumber: 33 },
              { type: 'add', content: '    if (content.length > this.CHUNK_SIZE) {', newLineNumber: 34 },
              { type: 'add', content: '      return this.uploadLargeFile(filePath, content);', newLineNumber: 35 },
              { type: 'add', content: '    }', newLineNumber: 36 },
              { type: 'add', content: '', newLineNumber: 37 },
              { type: 'add', content: '    // Standard upload for smaller files', newLineNumber: 38 },
              { type: 'add', content: '    await this.dbx.filesUpload({', newLineNumber: 39 },
              { type: 'add', content: '      path: filePath,', newLineNumber: 40 },
              { type: 'add', content: '      contents: content,', newLineNumber: 41 },
              { type: 'add', content: '      mode: { ".tag": "overwrite" }', newLineNumber: 42 },
              { type: 'add', content: '    });', newLineNumber: 43 },
              { type: 'add', content: '  }', newLineNumber: 44 },
              { type: 'add', content: '', newLineNumber: 45 },
              { type: 'add', content: '  private async uploadLargeFile(filePath: string, content: Buffer): Promise<void> {', newLineNumber: 46 },
              { type: 'add', content: '    const chunks = Math.ceil(content.length / this.CHUNK_SIZE);', newLineNumber: 47 },
              { type: 'add', content: '    let sessionId: string | undefined;', newLineNumber: 48 },
              { type: 'add', content: '', newLineNumber: 49 },
              { type: 'add', content: '    for (let i = 0; i < chunks; i++) {', newLineNumber: 50 },
              { type: 'add', content: '      const start = i * this.CHUNK_SIZE;', newLineNumber: 51 },
              { type: 'add', content: '      const end = Math.min(start + this.CHUNK_SIZE, content.length);', newLineNumber: 52 },
              { type: 'add', content: '      const chunk = content.slice(start, end);', newLineNumber: 53 },
              { type: 'add', content: '', newLineNumber: 54 },
              { type: 'add', content: '      if (i === 0) {', newLineNumber: 55 },
              { type: 'add', content: '        // Start upload session', newLineNumber: 56 },
              { type: 'add', content: '        const response = await this.dbx.filesUploadSessionStart({', newLineNumber: 57 },
              { type: 'add', content: '          contents: chunk,', newLineNumber: 58 },
              { type: 'add', content: '          close: false', newLineNumber: 59 },
              { type: 'add', content: '        });', newLineNumber: 60 },
              { type: 'add', content: '        sessionId = response.result.session_id;', newLineNumber: 61 },
              { type: 'add', content: '      } else if (i === chunks - 1) {', newLineNumber: 62 },
              { type: 'add', content: '        // Finish upload session', newLineNumber: 63 },
              { type: 'add', content: '        await this.dbx.filesUploadSessionFinish({', newLineNumber: 64 },
              { type: 'add', content: '          cursor: { session_id: sessionId!, offset: start },', newLineNumber: 65 },
              { type: 'add', content: '          commit: { path: filePath, mode: { ".tag": "overwrite" } },', newLineNumber: 66 },
              { type: 'add', content: '          contents: chunk', newLineNumber: 67 },
              { type: 'add', content: '        });', newLineNumber: 68 },
              { type: 'add', content: '      } else {', newLineNumber: 69 },
              { type: 'add', content: '        // Append to upload session', newLineNumber: 70 },
              { type: 'add', content: '        await this.dbx.filesUploadSessionAppendV2({', newLineNumber: 71 },
              { type: 'add', content: '          cursor: { session_id: sessionId!, offset: start },', newLineNumber: 72 },
              { type: 'add', content: '          contents: chunk,', newLineNumber: 73 },
              { type: 'add', content: '          close: false', newLineNumber: 74 },
              { type: 'add', content: '        });', newLineNumber: 75 },
              { type: 'add', content: '      }', newLineNumber: 76 },
              { type: 'add', content: '    }', newLineNumber: 77 },
              { type: 'add', content: '  }', newLineNumber: 78 },
              { type: 'context', content: '}', oldLineNumber: 39, newLineNumber: 79 },
            ]
          }
        ]
      }
    ];
  }
  
  // Dropbox delta sync
  if (lowerPrompt.includes("delta") || lowerPrompt.includes("changed files") || lowerPrompt.includes("only fetch")) {
    return [
      {
        path: "src/dropbox/sync.ts",
        language: "typescript",
        additions: 28,
        deletions: 6,
        status: 'pending',
        hunks: [
          {
            oldStart: 15,
            oldLines: 10,
            newStart: 15,
            newLines: 32,
            lines: [
              { type: 'context', content: 'export class DropboxSync {', oldLineNumber: 15, newLineNumber: 15 },
              { type: 'context', content: '  private dbx: Dropbox;', oldLineNumber: 16, newLineNumber: 16 },
              { type: 'remove', content: '  private lastSyncTime?: Date;', oldLineNumber: 17 },
              { type: 'add', content: '  private cursor?: string; // Delta cursor for incremental sync', newLineNumber: 17 },
              { type: 'context', content: '', oldLineNumber: 18, newLineNumber: 18 },
              { type: 'remove', content: '  async syncFiles(folder: string): Promise<FileSyncResult[]> {', oldLineNumber: 19 },
              { type: 'remove', content: '    const response = await this.dbx.filesListFolder({ path: folder });', oldLineNumber: 20 },
              { type: 'remove', content: '    return this.processEntries(response.result.entries);', oldLineNumber: 21 },
              { type: 'remove', content: '  }', oldLineNumber: 22 },
              { type: 'add', content: '  async syncFiles(folder: string): Promise<FileSyncResult[]> {', newLineNumber: 19 },
              { type: 'add', content: '    if (this.cursor) {', newLineNumber: 20 },
              { type: 'add', content: '      // Use delta sync to fetch only changes', newLineNumber: 21 },
              { type: 'add', content: '      return this.deltaSync();', newLineNumber: 22 },
              { type: 'add', content: '    }', newLineNumber: 23 },
              { type: 'add', content: '', newLineNumber: 24 },
              { type: 'add', content: '    // Initial full sync', newLineNumber: 25 },
              { type: 'add', content: '    const response = await this.dbx.filesListFolder({ path: folder });', newLineNumber: 26 },
              { type: 'add', content: '    this.cursor = response.result.cursor;', newLineNumber: 27 },
              { type: 'add', content: '    return this.processEntries(response.result.entries);', newLineNumber: 28 },
              { type: 'add', content: '  }', newLineNumber: 29 },
              { type: 'add', content: '', newLineNumber: 30 },
              { type: 'add', content: '  private async deltaSync(): Promise<FileSyncResult[]> {', newLineNumber: 31 },
              { type: 'add', content: '    const changes: FileSyncResult[] = [];', newLineNumber: 32 },
              { type: 'add', content: '    let hasMore = true;', newLineNumber: 33 },
              { type: 'add', content: '', newLineNumber: 34 },
              { type: 'add', content: '    while (hasMore) {', newLineNumber: 35 },
              { type: 'add', content: '      const response = await this.dbx.filesListFolderContinue({', newLineNumber: 36 },
              { type: 'add', content: '        cursor: this.cursor!', newLineNumber: 37 },
              { type: 'add', content: '      });', newLineNumber: 38 },
              { type: 'add', content: '', newLineNumber: 39 },
              { type: 'add', content: '      const processed = this.processEntries(response.result.entries);', newLineNumber: 40 },
              { type: 'add', content: '      changes.push(...processed);', newLineNumber: 41 },
              { type: 'add', content: '', newLineNumber: 42 },
              { type: 'add', content: '      this.cursor = response.result.cursor;', newLineNumber: 43 },
              { type: 'add', content: '      hasMore = response.result.has_more;', newLineNumber: 44 },
              { type: 'add', content: '    }', newLineNumber: 45 },
              { type: 'add', content: '', newLineNumber: 46 },
              { type: 'add', content: '    return changes;', newLineNumber: 47 },
              { type: 'add', content: '  }', newLineNumber: 48 },
              { type: 'context', content: '', oldLineNumber: 23, newLineNumber: 49 },
            ]
          }
        ]
      },
      {
        path: "src/types/sync.ts",
        language: "typescript",
        additions: 3,
        deletions: 0,
        status: 'pending',
        hunks: [
          {
            oldStart: 8,
            oldLines: 5,
            newStart: 8,
            newLines: 8,
            lines: [
              { type: 'context', content: 'export interface FileSyncResult {', oldLineNumber: 8, newLineNumber: 8 },
              { type: 'context', content: '  path: string;', oldLineNumber: 9, newLineNumber: 9 },
              { type: 'context', content: '  size: number;', oldLineNumber: 10, newLineNumber: 10 },
              { type: 'add', content: '  modified?: Date;', newLineNumber: 11 },
              { type: 'add', content: '  isDeleted?: boolean;', newLineNumber: 12 },
              { type: 'add', content: '  changeType: "added" | "modified" | "deleted";', newLineNumber: 13 },
              { type: 'context', content: '}', oldLineNumber: 11, newLineNumber: 14 },
            ]
          }
        ]
      }
    ];
  }
  
  // Dropbox rate limit handling
  if (lowerPrompt.includes("rate limit") || lowerPrompt.includes("retry") || lowerPrompt.includes("backoff")) {
    return [
      {
        path: "src/dropbox/rateLimiter.ts",
        language: "typescript",
        additions: 32,
        deletions: 0,
        status: 'pending',
        hunks: [
          {
            oldStart: 1,
            oldLines: 0,
            newStart: 1,
            newLines: 32,
            lines: [
              { type: 'add', content: 'import { Dropbox } from "dropbox";', newLineNumber: 1 },
              { type: 'add', content: '', newLineNumber: 2 },
              { type: 'add', content: 'export class RateLimitHandler {', newLineNumber: 3 },
              { type: 'add', content: '  private dbx: Dropbox;', newLineNumber: 4 },
              { type: 'add', content: '  private readonly MAX_RETRIES = 5;', newLineNumber: 5 },
              { type: 'add', content: '  private readonly BASE_DELAY = 1000;', newLineNumber: 6 },
              { type: 'add', content: '', newLineNumber: 7 },
              { type: 'add', content: '  async makeRequest<T>(', newLineNumber: 8 },
              { type: 'add', content: '    fn: () => Promise<T>,', newLineNumber: 9 },
              { type: 'add', content: '    retryCount = 0', newLineNumber: 10 },
              { type: 'add', content: '  ): Promise<T> {', newLineNumber: 11 },
              { type: 'add', content: '    try {', newLineNumber: 12 },
              { type: 'add', content: '      return await fn();', newLineNumber: 13 },
              { type: 'add', content: '    } catch (error: any) {', newLineNumber: 14 },
              { type: 'add', content: '      // Check if rate limited (429)', newLineNumber: 15 },
              { type: 'add', content: '      if (error.status === 429 && retryCount < this.MAX_RETRIES) {', newLineNumber: 16 },
              { type: 'add', content: '        const retryAfter = error.headers?.["retry-after"];', newLineNumber: 17 },
              { type: 'add', content: '        const delay = retryAfter ', newLineNumber: 18 },
              { type: 'add', content: '          ? parseInt(retryAfter) * 1000', newLineNumber: 19 },
              { type: 'add', content: '          : this.BASE_DELAY * Math.pow(2, retryCount);', newLineNumber: 20 },
              { type: 'add', content: '', newLineNumber: 21 },
              { type: 'add', content: '        console.log(`Rate limited. Retrying after ${delay}ms (attempt ${retryCount + 1}/${this.MAX_RETRIES})`);', newLineNumber: 22 },
              { type: 'add', content: '        await new Promise(resolve => setTimeout(resolve, delay));', newLineNumber: 23 },
              { type: 'add', content: '        return this.makeRequest(fn, retryCount + 1);', newLineNumber: 24 },
              { type: 'add', content: '      }', newLineNumber: 25 },
              { type: 'add', content: '', newLineNumber: 26 },
              { type: 'add', content: '      throw error;', newLineNumber: 27 },
              { type: 'add', content: '    }', newLineNumber: 28 },
              { type: 'add', content: '  }', newLineNumber: 29 },
              { type: 'add', content: '}', newLineNumber: 30 },
            ]
          }
        ]
      },
      {
        path: "src/dropbox/client.ts",
        language: "typescript",
        additions: 8,
        deletions: 2,
        status: 'pending',
        hunks: [
          {
            oldStart: 12,
            oldLines: 6,
            newStart: 12,
            newLines: 12,
            lines: [
              { type: 'context', content: 'import { Dropbox } from "dropbox";', oldLineNumber: 12, newLineNumber: 12 },
              { type: 'add', content: 'import { RateLimitHandler } from "./rateLimiter";', newLineNumber: 13 },
              { type: 'context', content: '', oldLineNumber: 13, newLineNumber: 14 },
              { type: 'context', content: 'export class DropboxClient {', oldLineNumber: 14, newLineNumber: 15 },
              { type: 'context', content: '  private dbx: Dropbox;', oldLineNumber: 15, newLineNumber: 16 },
              { type: 'add', content: '  private rateLimiter: RateLimitHandler;', newLineNumber: 17 },
              { type: 'context', content: '', oldLineNumber: 16, newLineNumber: 18 },
              { type: 'remove', content: '  async listFiles(path: string) {', oldLineNumber: 17 },
              { type: 'remove', content: '    return this.dbx.filesListFolder({ path });', oldLineNumber: 18 },
              { type: 'add', content: '  async listFiles(path: string) {', newLineNumber: 19 },
              { type: 'add', content: '    return this.rateLimiter.makeRequest(() => ', newLineNumber: 20 },
              { type: 'add', content: '      this.dbx.filesListFolder({ path })', newLineNumber: 21 },
              { type: 'add', content: '    );', newLineNumber: 22 },
              { type: 'context', content: '  }', oldLineNumber: 19, newLineNumber: 23 },
            ]
          }
        ]
      }
    ];
  }
  
  // Default generic change
  return [
    {
      path: "src/config/dropbox.ts",
      language: "typescript",
      additions: 4,
      deletions: 1,
      status: 'pending',
      hunks: [
        {
          oldStart: 5,
          oldLines: 5,
          newStart: 5,
          newLines: 8,
          lines: [
            { type: 'context', content: 'export const dropboxConfig = {', oldLineNumber: 5, newLineNumber: 5 },
            { type: 'context', content: '  accessToken: process.env.DROPBOX_TOKEN,', oldLineNumber: 6, newLineNumber: 6 },
            { type: 'remove', content: '  timeout: 30000,', oldLineNumber: 7 },
            { type: 'add', content: '  timeout: 60000,', newLineNumber: 7 },
            { type: 'add', content: '  retryAttempts: 3,', newLineNumber: 8 },
            { type: 'add', content: '  chunkSize: 150 * 1024 * 1024, // 150MB', newLineNumber: 9 },
            { type: 'add', content: '  selectiveSync: true,', newLineNumber: 10 },
            { type: 'context', content: '};', oldLineNumber: 8, newLineNumber: 11 },
          ]
        }
      ]
    }
  ];
};

export function CodeAssistant() {
  const [prompt, setPrompt] = useState("");
  const [changes, setChanges] = useState<CodeChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState("gpt-4-turbo");
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [generatingChangeId, setGeneratingChangeId] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState<Map<string, number>>(new Map());
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const generateChanges = async (userPrompt: string) => {
    setPrompt(userPrompt);
    setLoading(true);
    setThinkingStep(0);

    // Simulate thinking process
    for (let i = 0; i < thinkingSteps.length; i++) {
      setThinkingStep(i);
      const baseDelay = 400;
      const randomDelay = Math.random() * 600;
      await new Promise(resolve => setTimeout(resolve, baseDelay + randomDelay));
    }

    // Generate code changes
    const files = generateCodeChanges(userPrompt);
    
    const newChangeId = crypto.randomUUID();
    const newChange: CodeChange = {
      id: newChangeId,
      prompt: userPrompt,
      files,
      timestamp: new Date(),
      status: 'generating',
    };

    setChanges(prev => [newChange, ...prev]);
    setLoading(false);
    setPrompt("");
    setGeneratingChangeId(newChangeId);
    
    // Auto-expand first file
    if (files.length > 0) {
      setExpandedFiles(new Set([files[0].path]));
    }

    // Progressively reveal diff lines
    await progressivelyRevealDiffs(newChangeId, files);
  };

  const progressivelyRevealDiffs = async (changeId: string, files: FileDiff[]) => {
    // Calculate total lines across all files
    const fileLinesMap = new Map<string, number>();
    
    for (const file of files) {
      const totalLines = file.hunks.reduce((sum, hunk) => sum + hunk.lines.length, 0);
      fileLinesMap.set(file.path, totalLines);
      
      // Start with 0 visible lines
      setVisibleLines(prev => new Map(prev).set(file.path, 0));
    }

    // Reveal lines progressively for each file
    for (const file of files) {
      const totalLines = fileLinesMap.get(file.path) || 0;
      
      for (let i = 1; i <= totalLines; i++) {
        // Much slower: 80-180ms per line (realistic AI generation speed)
        // Lines with more content take longer
        const baseDelay = 80;
        const randomDelay = Math.random() * 100; // 0-100ms
        const extraDelay = i % 5 === 0 ? Math.random() * 150 : 0; // Extra pause every 5 lines (thinking)
        
        await new Promise(resolve => setTimeout(resolve, baseDelay + randomDelay + extraDelay));
        setVisibleLines(prev => new Map(prev).set(file.path, i));
      }
      
      // Longer pause between files (AI analyzing next file)
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 800));
    }

    // Final pause before marking as ready (AI finishing up)
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600));

    // Mark as ready
    setChanges(prev => prev.map(change => 
      change.id === changeId ? { ...change, status: 'ready' as const } : change
    ));
    setGeneratingChangeId(null);
    setVisibleLines(new Map()); // Clear visible lines tracking
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateChanges(prompt.trim());
    }
  };

  const toggleFileExpansion = (filePath: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(filePath)) {
        next.delete(filePath);
      } else {
        next.add(filePath);
      }
      return next;
    });
  };

  const approveFile = (changeId: string, filePath: string) => {
    setChanges(prev => prev.map(change => {
      if (change.id === changeId) {
        return {
          ...change,
          files: change.files.map(file => 
            file.path === filePath ? { ...file, status: 'approved' as const } : file
          )
        };
      }
      return change;
    }));
  };

  const rejectFile = (changeId: string, filePath: string) => {
    setChanges(prev => prev.map(change => {
      if (change.id === changeId) {
        return {
          ...change,
          files: change.files.map(file => 
            file.path === filePath ? { ...file, status: 'rejected' as const } : file
          )
        };
      }
      return change;
    }));
  };

  const applyChanges = async (changeId: string) => {
    const change = changes.find(c => c.id === changeId);
    if (!change) return;

    const approvedFiles = change.files.filter(f => f.status === 'approved');
    if (approvedFiles.length === 0) {
      alert('Please approve at least one file before applying changes');
      return;
    }

    // Simulate applying changes
    setChanges(prev => prev.map(c => 
      c.id === changeId ? { ...c, status: 'approved' as const } : c
    ));

    // Simulate a brief delay
    await new Promise(resolve => setTimeout(resolve, 500));

    alert(`Applied changes to ${approvedFiles.length} file(s):\n${approvedFiles.map(f => f.path).join('\n')}`);
  };

  const deployChanges = async (changeId: string) => {
    const change = changes.find(c => c.id === changeId);
    if (!change || change.status !== 'approved') return;

    const branchName = `feature/ai-${Date.now()}`;
    
    setChanges(prev => prev.map(c => 
      c.id === changeId ? { 
        ...c, 
        status: 'deployed' as const,
        deploymentBranch: branchName 
      } : c
    ));

    await new Promise(resolve => setTimeout(resolve, 1000));

    alert(`Changes deployed to branch: ${branchName}\n\nNext steps:\n1. Review changes in your repository\n2. Run tests\n3. Create pull request`);
  };

  const renderDiffLine = (line: DiffLine, index: number, isLastVisible: boolean = false) => {
    const bgColor = 
      line.type === 'add' ? 'bg-green-50 dark:bg-green-950/20' :
      line.type === 'remove' ? 'bg-red-50 dark:bg-red-950/20' :
      'bg-transparent';
    
    const textColor =
      line.type === 'add' ? 'text-green-700 dark:text-green-400' :
      line.type === 'remove' ? 'text-red-700 dark:text-red-400' :
      'text-foreground';
    
    const prefix = 
      line.type === 'add' ? '+' :
      line.type === 'remove' ? '-' :
      ' ';
    
    const lineNumber = line.type === 'remove' ? line.oldLineNumber : line.newLineNumber;

    return (
      <div key={index} className={`flex font-mono text-xs ${bgColor} ${textColor}`}>
        <span className="w-12 text-right pr-3 text-muted-foreground select-none flex-shrink-0">
          {lineNumber}
        </span>
        <span className="w-4 flex-shrink-0 select-none font-bold">
          {prefix}
        </span>
        <span className="flex-1 pr-4">
          {line.content || ' '}
          {isLastVisible && (
            <span className="inline-block w-2 h-3.5 bg-indigo-600 animate-pulse ml-0.5 align-middle" />
          )}
        </span>
      </div>
    );
  };

  return (
    <Card className="border-2 border-indigo-100 dark:border-indigo-900/30 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-cyan-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-lg blur opacity-40 animate-pulse"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Code Assistant
                </span>
                <Badge variant="secondary" className="text-xs font-semibold bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200">
                  <Terminal className="h-3 w-3 mr-1" />
                  AI-Generated
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <p className="text-sm font-normal text-muted-foreground">
                  Modify code with AI-powered diffs and approval workflow
                </p>
                <span className="text-muted-foreground text-sm">·</span>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[160px] h-7 text-xs border-indigo-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-sonnet-4.5">Claude Sonnet 4.5</SelectItem>
                    <SelectItem value="gpt-5">GPT-5</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the code changes you want to make..."
            disabled={loading}
            className="h-12 text-base shadow-sm border-2 focus:border-indigo-400"
          />
          <Button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="h-12 px-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 shadow-md"
          >
            <Send className="h-4 w-4 mr-2" />
            Generate
          </Button>
        </form>

        {/* Thinking Animation */}
        {loading && (
          <div className="p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
            <div className="space-y-3">
              {thinkingSteps.map((step, i) => (
                i <= thinkingStep && (
                  <div 
                    key={i} 
                    className="flex items-center gap-3"
                    style={{ 
                      opacity: 0,
                      animation: 'fadeIn 0.3s ease-out forwards',
                      animationDelay: `${i * 100}ms`
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      {i < thinkingStep ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {step}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Sample Prompts */}
        {!loading && changes.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileCode className="h-4 w-4 text-indigo-600" />
              <span>Try these code modifications</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {samplePrompts.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => generateChanges(q)}
                  className="text-xs justify-start h-auto py-3 px-4 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:shadow-sm transition-all group"
                >
                  <Code2 className="h-3.5 w-3.5 mr-2.5 text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-left font-medium">{q}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Code Changes */}
        {changes.map((change) => (
          <div key={change.id} className="space-y-4 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-lg p-4 bg-gradient-to-br from-slate-50/50 to-indigo-50/30 dark:from-slate-900/30 dark:to-indigo-950/20">
            {/* Change Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span className="font-semibold text-sm">{change.prompt}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {change.timestamp.toLocaleTimeString()}
                  </span>
                  <span>·</span>
                  <span>{change.files.length} file{change.files.length !== 1 ? 's' : ''}</span>
                  <span>·</span>
                  <span className="text-green-600">
                    +{change.files.reduce((sum, f) => sum + f.additions, 0)}
                  </span>
                  <span className="text-red-600">
                    -{change.files.reduce((sum, f) => sum + f.deletions, 0)}
                  </span>
                </div>
              </div>
              
              {/* Status Badge */}
              <Badge 
                variant={
                  change.status === 'deployed' ? 'default' :
                  change.status === 'approved' ? 'default' :
                  change.status === 'generating' ? 'secondary' :
                  'secondary'
                }
                className={
                  change.status === 'deployed' ? 'bg-green-600' :
                  change.status === 'approved' ? 'bg-blue-600' :
                  change.status === 'generating' ? 'bg-indigo-600 text-white' :
                  ''
                }
              >
                {change.status === 'deployed' && <Rocket className="h-3 w-3 mr-1" />}
                {change.status === 'approved' && <Check className="h-3 w-3 mr-1" />}
                {change.status === 'ready' && <AlertCircle className="h-3 w-3 mr-1" />}
                {change.status === 'generating' && (
                  <div className="h-3 w-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {change.status.charAt(0).toUpperCase() + change.status.slice(1)}
              </Badge>
            </div>

            {/* Files */}
            <div className="space-y-2">
              {change.files.map((file) => (
                <div key={file.path} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                  {/* File Header */}
                  <div 
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                    onClick={() => toggleFileExpansion(file.path)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {expandedFiles.has(file.path) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <FileCode className="h-4 w-4 text-indigo-600" />
                      <span className="font-mono text-sm font-medium">{file.path}</span>
                      <Badge variant="outline" className="text-xs">
                        {file.language}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-green-600">
                          <Plus className="h-3 w-3" />
                          {file.additions}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          <Minus className="h-3 w-3" />
                          {file.deletions}
                        </span>
                      </div>
                      
                      {/* File Actions */}
                      {change.status === 'ready' && (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant={file.status === 'approved' ? 'default' : 'outline'}
                            className={`h-7 px-2 ${file.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            onClick={() => approveFile(change.id, file.path)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={file.status === 'rejected' ? 'default' : 'outline'}
                            className={`h-7 px-2 ${file.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                            onClick={() => rejectFile(change.id, file.path)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      {file.status === 'approved' && (
                        <Badge className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      )}
                      {file.status === 'rejected' && (
                        <Badge variant="destructive">
                          <X className="h-3 w-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Diff Content */}
                  {expandedFiles.has(file.path) && (
                    <div className="border-t border-slate-200 dark:border-slate-700">
                      {(() => {
                        const isGenerating = change.id === generatingChangeId;
                        const visibleLineCount = isGenerating ? (visibleLines.get(file.path) || 0) : Infinity;
                        let currentLineIndex = 0;

                        return file.hunks.map((hunk, hunkIndex) => {
                          const visibleHunkLines = hunk.lines.filter((_, lineIndex) => {
                            const globalIndex = currentLineIndex++;
                            return globalIndex < visibleLineCount;
                          });

                          if (visibleHunkLines.length === 0) return null;

                          const totalLinesInFile = file.hunks.reduce((sum, h) => sum + h.lines.length, 0);
                          const isLastHunk = hunkIndex === file.hunks.length - 1;
                          const showCursor = isGenerating && isLastHunk && visibleHunkLines.length === hunk.lines.filter((_, idx) => {
                            const globalIdx = file.hunks.slice(0, hunkIndex).reduce((sum, h) => sum + h.lines.length, 0) + idx;
                            return globalIdx < visibleLineCount;
                          }).length;

                          return (
                            <div key={hunkIndex} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-1 text-xs font-mono text-muted-foreground">
                                @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
                              </div>
                              <div className="overflow-x-auto">
                                {visibleHunkLines.map((line, lineIndex) => {
                                  const isLastVisibleLine = showCursor && lineIndex === visibleHunkLines.length - 1;
                                  return renderDiffLine(line, lineIndex, isLastVisibleLine);
                                })}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {change.status === 'ready' && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={() => applyChanges(change.id)}
                  disabled={!change.files.some(f => f.status === 'approved')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply Changes
                </Button>
                <span className="text-xs text-muted-foreground">
                  {change.files.filter(f => f.status === 'approved').length} of {change.files.length} files approved
                </span>
              </div>
            )}

            {change.status === 'approved' && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={() => deployChanges(change.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  Deploy to Branch
                </Button>
                <span className="text-xs text-muted-foreground">
                  Changes applied and ready to deploy
                </span>
              </div>
            )}

            {change.status === 'deployed' && change.deploymentBranch && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Rocket className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Deployed to branch: <code className="font-mono text-xs bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">{change.deploymentBranch}</code>
                </span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
