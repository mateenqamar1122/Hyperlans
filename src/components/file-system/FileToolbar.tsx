
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List,
  SortAsc,
  Upload,
  FolderPlus,
  Trash,
  Archive,
  Star
} from 'lucide-react';
import { ViewMode, SortOption, SortDirection } from '@/types/fileSystem';

interface FileToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (option: SortOption) => void;
  onSortDirectionToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onCreateFolder: () => void;
  onUploadFile: () => void;
  onBulkArchive: () => void;
  onBulkStar: () => void;
  onBulkDelete: () => void;
}

const FileToolbar: React.FC<FileToolbarProps> = ({
  viewMode,
  onViewModeChange,
  sortBy,
  sortDirection,
  onSortChange,
  onSortDirectionToggle,
  searchQuery,
  onSearchChange,
  selectedCount,
  onCreateFolder,
  onUploadFile,
  onBulkArchive,
  onBulkStar,
  onBulkDelete,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          
          <div className="border-l h-6 mx-2 border-gray-300 dark:border-gray-600" />
          
          <Select 
            value={sortBy} 
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onSortDirectionToggle}
            aria-label={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
          >
            <SortAsc className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-[200px] md:w-[300px]"
            />
          </div>
          
          <Button onClick={onCreateFolder} variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>
          
          <Button onClick={onUploadFile} variant="default" className="gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </div>
      </div>
      
      {selectedCount > 0 && (
        <div className="flex items-center bg-secondary/50 p-2 rounded-md gap-2">
          <span className="text-sm ml-2">{selectedCount} item(s) selected</span>
          <div className="flex-1"></div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBulkStar}
            className="flex items-center gap-1"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Star</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBulkArchive}
            className="flex items-center gap-1"
          >
            <Archive className="h-4 w-4" />
            <span className="hidden sm:inline">Archive</span>
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onBulkDelete}
            className="flex items-center gap-1"
          >
            <Trash className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileToolbar;
