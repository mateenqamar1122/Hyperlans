
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Portfolio } from "@/types/portfolio";
import { publishPortfolio } from "@/services/portfolioService";

interface PortfolioHeaderProps {
  portfolio: Portfolio | null;
  isPreview?: boolean;
  onPreviewClick?: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ 
  portfolio,
  isPreview = false,
  onPreviewClick
}) => {
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!portfolio?.id) return;
    
    const success = await publishPortfolio(portfolio.id);
    
    if (success) {
      toast({
        title: "Portfolio published!",
        description: "Your portfolio is now available to the public.",
      });
    } else {
      toast({
        title: "Publication failed",
        description: "There was an error publishing your portfolio.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between border-b pb-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio Builder</h1>
        <p className="text-muted-foreground">
          Create and customize your professional portfolio
        </p>
      </div>
      <div className="flex gap-2">
        {!isPreview && (
          <Button variant="outline" onClick={onPreviewClick}>
            Preview
          </Button>
        )}
        {isPreview && (
          <Button variant="outline" onClick={onPreviewClick}>
            Back to Editor
          </Button>
        )}
        {portfolio && (
          <Button onClick={handlePublish}>
            {portfolio.is_published ? "Update Published Version" : "Publish"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PortfolioHeader;
