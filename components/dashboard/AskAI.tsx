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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Ask AI
          </div>
          <Badge variant={mode === "llm" ? "default" : "secondary"} className="text-xs">
            {mode === "llm" ? "LLM Mode" : "Stub Mode"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your deployments..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {answer && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{answer}</p>
          </div>
        )}

        {!answer && !loading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try asking:</p>
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
          <p className="text-xs text-muted-foreground">
            💡 Enable LLM Mode in Settings for AI-powered answers
          </p>
        )}
      </CardContent>
    </Card>
  );
}

