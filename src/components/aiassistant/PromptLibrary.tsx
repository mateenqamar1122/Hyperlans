
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import PromptCategory from "./PromptCategory";
import { promptCategoriesData } from "@/data/promptCategoriesData";

interface PromptLibraryProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  handlePromptClick: (prompt: string) => void;
}

const PromptLibrary: React.FC<PromptLibraryProps> = ({
  selectedCategory,
  setSelectedCategory,
  handlePromptClick,
}) => {
  return (
    <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-brand-blue" />
          Prompt Library
        </CardTitle>
        <CardDescription>
          Select a category or browse all business prompts
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 p-2 bg-gray-100 dark:bg-gray-800/50 border-b dark:border-gray-700">
          {promptCategoriesData.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "ghost"}
              size="sm"
              className="h-auto py-1 justify-start text-xs"
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            >
              <category.icon className="h-3 w-3 mr-1" />
              {category.name}
            </Button>
          ))}
        </div>

        <div className="p-3 max-h-[450px] overflow-y-auto">
          {(selectedCategory
            ? promptCategoriesData.filter(c => c.name === selectedCategory)
            : promptCategoriesData
          ).map((category) => (
            <PromptCategory
              key={category.name}
              category={category}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handlePromptClick={handlePromptClick}
              showHeader={!selectedCategory}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptLibrary;
