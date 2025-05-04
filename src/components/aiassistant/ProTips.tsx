
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronRight } from "lucide-react";

const ProTips: React.FC = () => {
  return (
    <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-lg">
      <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5 text-brand-blue" />
          Pro Tips
        </CardTitle>
        <CardDescription>Make the most of your AI assistant</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2">
            <ChevronRight className="h-4 w-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p>Be specific with your prompts to get better results</p>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-4 w-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p>Save useful responses for future reference</p>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-4 w-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p>Ask follow-up questions to refine the answers</p>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-4 w-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p>Include relevant context in your questions</p>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-4 w-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <p>Use the prompt library for inspiration</p>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProTips;
