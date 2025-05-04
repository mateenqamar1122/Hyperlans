
import React, { useCallback } from 'react';
import { FileItem } from '@/types/fileSystem';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreHorizontal,
  Folder,
  File,
  Image,
  FileText,
  FileCode,
  Film,
  Music,
  Star,
  StarOff
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FileListProps {
  files: FileItem[];
  selectedFiles: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onFileClick: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onToggleStar: (file: FileItem, value: boolean) => void;
  onMove: (file: FileItem) => void;
  onArchive: (file: FileItem, value: boolean) => void;
  onDelete: (file: FileItem) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  selectedFiles,
  onSelect,
  onSelectAll,
  onFileClick,
  onShare,
  onRename,
  onToggleStar,
  onMove,
  onArchive,
  onDelete,
}) => {
  const getFileIcon = useCallback((file: FileItem) => {
    if (file.is_folder) return <Folder className="h-4 w-4 text-blue-500" />;
    
    if (file.file_type.startsWith('image/')) return <Image className="h-4 w-4 text-purple-500" />;
    if (file.file_type.startsWith('video/')) return <Film className="h-4 w-4 text-red-500" />;
    if (file.file_type.startsWith('audio/')) return <Music className="h-4 w-4 text-green-500" />;
    
    if (file.file_type.includes('pdf')) return <FileText className="h-4 w-4 text-orange-500" />;
    if (file.file_type.includes('doc') || file.file_type.includes('word')) return <FileText className="h-4 w-4 text-blue-700" />;
    if (file.file_type.includes('sheet') || file.file_type.includes('excel')) return <FileText className="h-4 w-4 text-green-700" />;
    if (file.file_type.includes('presentation') || file.file_type.includes('powerpoint')) return <FileText className="h-4 w-4 text-red-700" />;
    
    if (file.file_type.includes('html') || file.file_type.includes('javascript') || file.file_type.includes('css') || file.file_type.includes('json')) {
      return <FileCode className="h-4 w-4 text-yellow-500" />;
    }
    
    return <File className="h-4 w-4 text-gray-500" />;
  }, []);
  
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Memoize the all files selected state
  const allSelected = files.length > 0 && selectedFiles.size === files.length;
  const someSelected = selectedFiles.size > 0 && selectedFiles.size < files.length;

  const handleRowClick = useCallback((file: FileItem) => {
    onFileClick(file);
  }, [onFileClick]);

  const handleSelect = useCallback((id: string, selected: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id, selected);
  }, [onSelect]);

  const handleSelectAll = useCallback((selected: boolean) => {
    onSelectAll(selected);
  }, [onSelectAll]);

  const handleDropdownAction = useCallback((e: React.MouseEvent, action: Function) => {
    e.stopPropagation();
    action();
  }, []);

  // Improved memo-friendly rendering of file rows
  const renderFileRow = useCallback((file: FileItem) => {
    const isSelected = selectedFiles.has(file.id);
    
    return (
      <TableRow 
        key={file.id}
        onClick={() => handleRowClick(file)}
        className={`cursor-pointer ${file.is_archived ? 'opacity-60' : ''}`}
      >
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(file.id, !!checked)}
            aria-label={`Select ${file.name}`}
          />
        </TableCell>
        <TableCell className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            {getFileIcon(file)}
            {file.name}
            {file.is_starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
          </span>
        </TableCell>
        <TableCell>{formatDistanceToNow(new Date(file.updated_at), { addSuffix: true })}</TableCell>
        <TableCell>{file.is_folder ? '--' : formatFileSize(file.size_bytes)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!file.is_archived && (
                <>
                  <DropdownMenuItem onClick={(e) => handleDropdownAction(e, () => onShare(file))}>
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleDropdownAction(e, () => onRename(file))}>
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleDropdownAction(e, () => onMove(file))}>
                    Move
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleDropdownAction(e, () => onToggleStar(file, !file.is_starred))}>
                    {file.is_starred ? "Unstar" : "Star"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={(e) => handleDropdownAction(e, () => onArchive(file, !file.is_archived))}>
                {file.is_archived ? "Restore" : "Archive"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => handleDropdownAction(e, () => onDelete(file))}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }, [selectedFiles, getFileIcon, formatFileSize, handleRowClick, onSelect, handleDropdownAction, onShare, onRename, onMove, onToggleStar, onArchive, onDelete]);

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={allSelected}
                // Remove indeterminate prop as it doesn't exist in the type
                // Use data attribute for styling if needed
                data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                aria-label="Select all files"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map(renderFileRow)}
        </TableBody>
      </Table>
    </div>
  );
};

export default React.memo(FileList);
