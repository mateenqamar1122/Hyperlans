
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface PromptItem {
  title: string;
  prompt: string;
  tags?: string[];
}

interface PromptCategoryProps {
  category: {
    icon: LucideIcon;
    name: string;
    color: string;
    prompts: PromptItem[];
  };
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  handlePromptClick: (prompt: string) => void;
  showHeader?: boolean;
}

const PromptCategory: React.FC<PromptCategoryProps> = ({
  category,
  selectedCategory,
  setSelectedCategory,
  handlePromptClick,
  showHeader = true,
}) => {
  const Icon = category.icon;
  
  return (
    <div className="mb-4 last:mb-0">
      {showHeader && (
        <h3 className={`text-sm font-semibold mb-2 px-2 py-1 rounded-md text-white ${category.color}`}>
          <Icon className="h-4 w-4 inline mr-1" />
          {category.name}
        </h3>
      )}
      <div className="space-y-2">
        {category.prompts.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800"
            onClick={() => handlePromptClick(item.prompt)}
          >
            <div className="p-3">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {item.prompt}
              </p>
              {item.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptCategory;
