"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2 } from "lucide-react";

const sampleQuestions = [
  "Which deployment has the most errors?",
  "Show me healthy deployments",
  "Compare Acme and Beta",
  "What's the error rate trend?",
];

export function AskAI() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"stub" | "llm">("stub");

  const askQuestion = async (question: string) => {
    setQuery(question);
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/llm/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      const data = await response.json();
      setAnswer(data.answer);
      setMode(data.mode);
    } catch (error) {
      setAnswer("Sorry, I couldn't process your question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      askQuestion(query);
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Query Assistant
          </div>
          <Badge 
            variant={mode === "llm" ? "default" : "secondary"} 
            className="text-xs font-semibold"
          >
            {mode === "llm" ? "LLM" : "Demo"}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Natural language queries for deployment data
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about deployments, errors, or metrics..."
              disabled={loading}
              className="pr-10"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={loading || !query.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {answer && (
          <div className="p-4 bg-muted/50 rounded border animate-fade-in">
            <p className="text-sm leading-relaxed">{answer}</p>
          </div>
        )}

        {!answer && !loading && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Common queries:</p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => askQuestion(q)}
                  className="text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        {mode === "stub" && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded border text-xs text-muted-foreground">
            Enable LLM Mode in Settings for AI-powered analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
}

