
import React, { useCallback } from 'react';
import { FileItem } from '@/types/fileSystem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  StarOff,
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FileCardProps {
  file: FileItem;
  onClick: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onToggleStar: (file: FileItem, value: boolean) => void;
  onMove: (file: FileItem) => void;
  onArchive: (file: FileItem, value: boolean) => void;
  onDelete: (file: FileItem) => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onClick,
  onShare,
  onRename,
  onToggleStar,
  onMove,
  onArchive,
  onDelete,
}) => {
  // Memoize the file icon getter to prevent recreating on each render
  const getFileIcon = useCallback(() => {
    if (file.is_folder) return <Folder className="h-12 w-12 text-blue-500" />;
    
    if (file.file_type.startsWith('image/')) return <Image className="h-12 w-12 text-purple-500" />;
    if (file.file_type.startsWith('video/')) return <Film className="h-12 w-12 text-red-500" />;
    if (file.file_type.startsWith('audio/')) return <Music className="h-12 w-12 text-green-500" />;
    
    if (file.file_type.includes('pdf')) return <FileText className="h-12 w-12 text-orange-500" />;
    if (file.file_type.includes('doc') || file.file_type.includes('word')) return <FileText className="h-12 w-12 text-blue-700" />;
    if (file.file_type.includes('sheet') || file.file_type.includes('excel')) return <FileText className="h-12 w-12 text-green-700" />;
    if (file.file_type.includes('presentation') || file.file_type.includes('powerpoint')) return <FileText className="h-12 w-12 text-red-700" />;
    
    if (file.file_type.includes('html') || file.file_type.includes('javascript') || file.file_type.includes('css') || file.file_type.includes('json')) {
      return <FileCode className="h-12 w-12 text-yellow-500" />;
    }
    
    return <File className="h-12 w-12 text-gray-500" />;
  }, [file.is_folder, file.file_type]);
  
  // Memoize the file size formatter to prevent recreating on each render
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Handle dropdown events with useCallback to prevent recreating handlers
  const handleDropdownAction = useCallback((e: React.MouseEvent, action: Function) => {
    e.stopPropagation();
    action();
  }, []);

  return (
    <Card className={`group relative cursor-pointer transition-all hover:shadow-md ${file.is_archived ? 'opacity-60' : ''}`} onClick={() => onClick(file)}>
      <CardContent className="p-4 flex flex-col items-center">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
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
        </div>
        
        {file.is_starred && (
          <div className="absolute top-2 left-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        )}
        
        {/* Thumbnail or Icon */}
        <div className="mb-2">
          {file.thumbnail_url ? (
            <img 
              src={file.thumbnail_url} 
              alt={file.name} 
              className="h-16 w-16 object-cover rounded-md" 
            />
          ) : (
            getFileIcon()
          )}
        </div>
        
        {/* File Name */}
        <h3 className="font-medium text-center line-clamp-2">{file.name}</h3>
        
        {/* File Meta */}
        <div className="mt-2 text-xs text-gray-500 flex flex-col items-center">
          {!file.is_folder && (
            <span>{formatFileSize(file.size_bytes)}</span>
          )}
          <span>
            {formatDistanceToNow(new Date(file.updated_at), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(FileCard);
