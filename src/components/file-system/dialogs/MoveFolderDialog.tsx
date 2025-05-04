
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileItem } from '@/types/fileSystem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Folder, FolderOpen, HardDrive } from 'lucide-react';

interface MoveFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileItem | null;
  folders: FileItem[];
  onConfirm: (fileId: string, destinationFolderId: string | null) => void;
  onLoadFolders: (parentId: string | null) => void;
}

interface FolderTreeItem {
  id: string | null;
  name: string;
  parentId: string | null;
  level: number;
  children: FolderTreeItem[];
  isExpanded: boolean;
}

const MoveFolderDialog: React.FC<MoveFolderDialogProps> = ({
  open,
  onOpenChange,
  file,
  folders,
  onConfirm,
  onLoadFolders,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folderTree, setFolderTree] = useState<FolderTreeItem[]>([]);
  
  // Build a flat folder tree
  useEffect(() => {
    if (open) {
      onLoadFolders(null); // Load top-level folders
      
      // Set root folder
      setFolderTree([
        {
          id: null,
          name: 'Home',
          parentId: null,
          level: 0,
          children: [],
          isExpanded: true
        }
      ]);
      
      setSelectedFolderId(null);
    }
  }, [open, onLoadFolders]);
  
  // Update tree when folders change
  useEffect(() => {
    if (!open) return;
    
    const folderMap = new Map<string | null, FolderTreeItem[]>();
    
    // Group folders by parent
    folders.forEach(folder => {
      if (folder.is_folder && (!file || folder.id !== file.id)) {
        if (!folderMap.has(folder.parent_folder_id)) {
          folderMap.set(folder.parent_folder_id, []);
        }
        folderMap.get(folder.parent_folder_id)?.push({
          id: folder.id,
          name: folder.name,
          parentId: folder.parent_folder_id,
          level: 0, // Will be calculated later
          children: [],
          isExpanded: false
        });
      }
    });
    
    // Update the tree
    const buildTree = (tree: FolderTreeItem[]) => {
      tree.forEach(node => {
        const children = folderMap.get(node.id) || [];
        children.forEach(child => {
          child.level = node.level + 1;
        });
        node.children = children;
        buildTree(node.children);
      });
    };
    
    // Clone the tree to avoid directly modifying state
    const newTree = [...folderTree];
    buildTree(newTree);
    
    setFolderTree(newTree);
  }, [folders, open, file]);
  
  const toggleFolder = (id: string | null) => {
    const updateNode = (tree: FolderTreeItem[]): FolderTreeItem[] => {
      return tree.map(node => {
        if (node.id === id) {
          if (!node.isExpanded) {
            // Load child folders if expanding
            onLoadFolders(node.id);
          }
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    
    setFolderTree(updateNode(folderTree));
  };

  const handleConfirm = () => {
    if (file) {
      onConfirm(file.id, selectedFolderId);
    }
  };
  
  const renderFolderTree = (tree: FolderTreeItem[]) => {
    return tree.map(node => (
      <React.Fragment key={node.id || 'root'}>
        <div 
          className={`flex items-center py-1 px-2 rounded-md my-1 cursor-pointer ${
            selectedFolderId === node.id ? 'bg-secondary' : 'hover:bg-secondary/50'
          }`}
          style={{ paddingLeft: `${node.level * 16 + 8}px` }}
          onClick={() => setSelectedFolderId(node.id)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 mr-1 p-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleFolder(node.id);
            }}
          >
            {node.children.length > 0 ? (
              <ChevronRight
                className={`h-4 w-4 transition-transform ${node.isExpanded ? 'rotate-90' : ''}`}
              />
            ) : (
              <span className="w-4" />
            )}
          </Button>
          
          {node.id === null ? (
            <HardDrive className="h-4 w-4 mr-2" />
          ) : (
            node.isExpanded ? (
              <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 mr-2 text-blue-500" />
            )
          )}
          
          <span className="text-sm">{node.name}</span>
        </div>
        
        {node.isExpanded && node.children.length > 0 && renderFolderTree(node.children)}
      </React.Fragment>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move {file?.is_folder ? 'Folder' : 'File'}</DialogTitle>
          <DialogDescription>
            Select a destination folder for "{file?.name}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-56 border rounded-md p-2">
            {renderFolderTree(folderTree)}
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveFolderDialog;
