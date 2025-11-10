"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
}

export function SearchFilter({ onSearch, onFilterChange }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");
  const [envFilter, setEnvFilter] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleHealthFilter = (value: string) => {
    setHealthFilter(value);
    updateActiveFilters("health", value);
    onFilterChange({ health: value, env: envFilter });
  };

  const handleEnvFilter = (value: string) => {
    setEnvFilter(value);
    updateActiveFilters("env", value);
    onFilterChange({ health: healthFilter, env: value });
  };

  const updateActiveFilters = (type: string, value: string) => {
    const filters = [...activeFilters];
    const index = filters.findIndex((f) => f.startsWith(type));
    
    if (value !== "all") {
      const newFilter = `${type}:${value}`;
      if (index >= 0) {
        filters[index] = newFilter;
      } else {
        filters.push(newFilter);
      }
    } else if (index >= 0) {
      filters.splice(index, 1);
    }
    
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setHealthFilter("all");
    setEnvFilter("all");
    setActiveFilters([]);
    onSearch("");
    onFilterChange({ health: "all", env: "all" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search deployments by name or ID..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 text-base bg-background shadow-sm"
          />
        </div>

        <div className="flex gap-3">
          <Select value={healthFilter} onValueChange={handleHealthFilter}>
            <SelectTrigger className="w-[180px] h-12 shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Health</SelectItem>
              <SelectItem value="healthy">✅ Healthy</SelectItem>
              <SelectItem value="noisy">⚠️ Noisy</SelectItem>
              <SelectItem value="degraded">🚨 Degraded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={envFilter} onValueChange={handleEnvFilter}>
            <SelectTrigger className="w-[180px] h-12 shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="production">🚀 Production</SelectItem>
              <SelectItem value="staging">🔧 Staging</SelectItem>
              <SelectItem value="development">💻 Development</SelectItem>
            </SelectContent>
          </Select>

          {activeFilters.length > 0 && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={clearFilters}
              className="h-12 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border animate-fade-in">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="font-semibold px-3 py-1"
              >
                {filter.replace(":", ": ")}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

