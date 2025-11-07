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
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deployments..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={healthFilter} onValueChange={handleHealthFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Health</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="noisy">Noisy</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={envFilter} onValueChange={handleEnvFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary">
              {filter.replace(":", ": ")}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

