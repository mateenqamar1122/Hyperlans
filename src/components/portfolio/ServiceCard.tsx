
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortfolioService } from "@/types/portfolio";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Star, Code, PenTool, LayoutGrid, Globe, HeartHandshake } from "lucide-react";

interface ServiceCardProps {
  service: PortfolioService;
  onEdit: (service: PortfolioService) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
  const getIcon = () => {
    switch (service.icon?.toLowerCase()) {
      case "code":
        return <Code className="h-10 w-10 text-primary" />;
      case "design":
        return <PenTool className="h-10 w-10 text-primary" />;
      case "web":
        return <Globe className="h-10 w-10 text-primary" />;
      case "consulting":
        return <HeartHandshake className="h-10 w-10 text-primary" />;
      default:
        return <LayoutGrid className="h-10 w-10 text-primary" />;
    }
  };

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      onDelete(service.id || "");
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {getIcon()}
            <div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              {service.price && (
                <CardDescription>{service.price}</CardDescription>
              )}
            </div>
          </div>
          {service.is_featured && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          {service.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        <div>
          {/* Space for potential additional information */}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(service)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={confirmDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
