
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  HardDrive,
  Star,
  Clock,
  Archive,
  Folder,
  Plus,
  Search,
  Edit,
  Trash
} from 'lucide-react';
import { FileCategory } from "@/types/fileSystem";

interface FileSidebarProps {
  selectedView: string;
  categories: FileCategory[];
  onViewSelect: (view: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onCreateCategory: () => void;
  onEditCategory: (category: FileCategory) => void;
  onDeleteCategory: (category: FileCategory) => void;
}

const FileSidebar: React.FC<FileSidebarProps> = ({
  selectedView,
  categories,
  onViewSelect,
  onCategorySelect,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative mb-4">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Search categories..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button onClick={onCreateCategory} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-1">
        <div className="p-3">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">VIEWS</h3>
            <div className="space-y-1">
              <Button
                variant={selectedView === 'all' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewSelect('all')}
              >
                <HardDrive className="mr-2 h-4 w-4" />
                All Files
              </Button>
              
              <Button
                variant={selectedView === 'starred' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewSelect('starred')}
              >
                <Star className="mr-2 h-4 w-4" />
                Starred
              </Button>
              
              <Button
                variant={selectedView === 'recent' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewSelect('recent')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Recent
              </Button>
              
              <Button
                variant={selectedView === 'archived' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onViewSelect('archived')}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archived
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">CATEGORIES</h3>
            <div className="space-y-1">
              {filteredCategories.map(category => (
                <div key={category.id} className="flex items-center group">
                  <Button
                    variant={selectedView === `category-${category.id}` ? "secondary" : "ghost"}
                    className="flex-1 justify-start"
                    onClick={() => onCategorySelect(category.id)}
                  >
                    <Folder 
                      className={`mr-2 h-4 w-4 ${category.color ? `text-${category.color}-500` : ''}`} 
                    />
                    {category.name}
                  </Button>
                  
                  <div className="opacity-0 group-hover:opacity-100 flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(category);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(category);
                      }}
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredCategories.length === 0 && (
                <p className="text-sm text-muted-foreground py-2 px-3">
                  No categories found
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileSidebar;
