
import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

interface Folder {
  id: string;
  name: string;
}

interface FileBreadcrumbProps {
  folders: Folder[];
  onNavigate: (folderId: string | null) => void;
}

const FileBreadcrumb: React.FC<FileBreadcrumbProps> = ({ folders, onNavigate }) => {
  const handleHomeClick = useCallback(() => {
    onNavigate(null);
  }, [onNavigate]);

  const handleFolderClick = useCallback((folderId: string) => {
    onNavigate(folderId);
  }, [onNavigate]);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button 
              variant="ghost" 
              className="p-0 h-auto font-normal hover:bg-transparent" 
              onClick={handleHomeClick}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {folders.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {index === folders.length - 1 ? (
                <BreadcrumbPage>{folder.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-normal hover:bg-transparent" 
                    onClick={() => handleFolderClick(folder.id)}
                  >
                    {folder.name}
                  </Button>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default React.memo(FileBreadcrumb);
