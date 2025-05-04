
import { useState } from "react";
import { Check, ChevronsUpDown, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterOption = {
  value: string;
  label: string;
};

interface TaskFilterProps {
  priorities?: string[];
  projects?: FilterOption[];
  tags?: string[];
  labels?: string[];
  selectedPriorities: string[];
  selectedProjects: string[];
  selectedTags: string[];
  selectedLabels: string[];
  onFilterChange: (type: string, values: string[]) => void;
}

export default function TaskFilter({
  priorities = ["low", "medium", "high", "urgent"],
  projects = [],
  tags = [],
  labels = [],
  selectedPriorities,
  selectedProjects,
  selectedTags,
  selectedLabels,
  onFilterChange,
}: TaskFilterProps) {
  const [open, setOpen] = useState(false);

  const handlePriorityChange = (value: string) => {
    const newValues = selectedPriorities.includes(value)
      ? selectedPriorities.filter(p => p !== value)
      : [...selectedPriorities, value];
    
    onFilterChange("priority", newValues);
  };

  const handleProjectChange = (value: string) => {
    const newValues = selectedProjects.includes(value)
      ? selectedProjects.filter(p => p !== value)
      : [...selectedProjects, value];
    
    onFilterChange("project", newValues);
  };

  const handleTagChange = (value: string) => {
    const newValues = selectedTags.includes(value)
      ? selectedTags.filter(t => t !== value)
      : [...selectedTags, value];
    
    onFilterChange("tag", newValues);
  };

  const handleLabelChange = (value: string) => {
    const newValues = selectedLabels.includes(value)
      ? selectedLabels.filter(l => l !== value)
      : [...selectedLabels, value];
    
    onFilterChange("label", newValues);
  };

  const totalSelected = 
    selectedPriorities.length + 
    selectedProjects.length + 
    selectedTags.length + 
    selectedLabels.length;

  const clearFilters = () => {
    onFilterChange("priority", []);
    onFilterChange("project", []);
    onFilterChange("tag", []);
    onFilterChange("label", []);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          aria-expanded={open}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter</span>
          {totalSelected > 0 && (
            <Badge variant="secondary" className="rounded-full px-1 text-xs font-normal">
              {totalSelected}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            {/* Priority Filters */}
            <CommandGroup heading="Priority">
              <div className="p-2 space-y-1">
                {priorities.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`priority-${priority}`} 
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => handlePriorityChange(priority)}
                    />
                    <Label htmlFor={`priority-${priority}`} className="flex-1 text-sm capitalize">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            </CommandGroup>
            
            <CommandSeparator />
            
            {/* Project Filters */}
            {projects.length > 0 && (
              <>
                <CommandGroup heading="Projects">
                  <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                    {projects.map((project) => (
                      <div key={project.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`project-${project.value}`} 
                          checked={selectedProjects.includes(project.value)}
                          onCheckedChange={() => handleProjectChange(project.value)}
                        />
                        <Label 
                          htmlFor={`project-${project.value}`} 
                          className="flex-1 text-sm truncate"
                        >
                          {project.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            
            {/* Tag Filters */}
            {tags.length > 0 && (
              <>
                <CommandGroup heading="Tags">
                  <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                    {tags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tag-${tag}`} 
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => handleTagChange(tag)}
                        />
                        <Label 
                          htmlFor={`tag-${tag}`} 
                          className="flex-1 text-sm truncate"
                        >
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            
            {/* Label Filters */}
            {labels.length > 0 && (
              <>
                <CommandGroup heading="Labels">
                  <div className="p-2 space-y-1 max-h-40 overflow-y-auto">
                    {labels.map((label) => (
                      <div key={label} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`label-${label}`} 
                          checked={selectedLabels.includes(label)}
                          onCheckedChange={() => handleLabelChange(label)}
                        />
                        <Label 
                          htmlFor={`label-${label}`} 
                          className="flex-1 text-sm truncate"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            
            {totalSelected > 0 && (
              <div className="p-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
