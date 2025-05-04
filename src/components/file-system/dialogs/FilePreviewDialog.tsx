
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileItem } from '@/types/fileSystem';
import { Button } from '@/components/ui/button';
import { ExternalLink, DownloadIcon } from 'lucide-react';

interface FilePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileItem | null;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({
  open,
  onOpenChange,
  file,
}) => {
  if (!file) return null;
  
  const isImage = file.file_type.startsWith('image/');
  const isVideo = file.file_type.startsWith('video/');
  const isAudio = file.file_type.startsWith('audio/');
  const isPdf = file.file_type === 'application/pdf';
  
  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex justify-center">
          <img 
            src={file.public_url} 
            alt={file.name} 
            className="max-h-[60vh] max-w-full object-contain rounded-md"
          />
        </div>
      );
    } else if (isVideo) {
      return (
        <video 
          controls 
          className="w-full max-h-[60vh]"
        >
          <source src={file.public_url} type={file.file_type} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (isAudio) {
      return (
        <audio 
          controls 
          className="w-full mt-4"
        >
          <source src={file.public_url} type={file.file_type} />
          Your browser does not support the audio tag.
        </audio>
      );
    } else if (isPdf) {
      return (
        <iframe
          src={file.public_url}
          className="w-full h-[60vh]"
          title={file.name}
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">This file type cannot be previewed</p>
          <div className="flex gap-2">
            <Button asChild>
              <a href={file.public_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
            
            <Button variant="outline" asChild>
              <a href={file.public_url} download={file.name}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
          <DialogDescription>
            {isImage || isVideo || isAudio || isPdf ? 'Preview:' : 'File details:'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          {renderPreview()}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          {!isImage && !isVideo && !isAudio && !isPdf && (
            <Button asChild>
              <a href={file.public_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </a>
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <a href={file.public_url} download={file.name}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;
