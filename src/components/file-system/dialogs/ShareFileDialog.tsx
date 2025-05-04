
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';
import { createShareLink } from '@/services/fileService';

interface ShareFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileItem | null;
}

const ShareFileDialog: React.FC<ShareFileDialogProps> = ({
  open,
  onOpenChange,
  file,
}) => {
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view');
  const [expiresEnabled, setExpiresEnabled] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    if (!file) return;
    
    try {
      const expiresAt = expiresEnabled && expiryDate ? new Date(expiryDate) : undefined;
      
      const result = await createShareLink(
        file.id,
        accessLevel,
        expiresAt
      );
      
      if (result) {
        setShareLink(result.shareLink);
        toast.success('Share link generated successfully');
      } else {
        toast.error('Failed to generate share link');
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('An error occurred while generating the share link');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {file?.name}</DialogTitle>
          <DialogDescription>
            Create a shareable link to give others access to this {file?.is_folder ? 'folder' : 'file'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="access-level">Access Level</Label>
            <Select
              value={accessLevel}
              onValueChange={(value) => setAccessLevel(value as 'view' | 'edit')}
            >
              <SelectTrigger id="access-level">
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View only</SelectItem>
                <SelectItem value="edit">Edit access</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="expiry"
              checked={expiresEnabled}
              onCheckedChange={setExpiresEnabled}
            />
            <Label htmlFor="expiry">Set expiry date</Label>
          </div>
          
          {expiresEnabled && (
            <div className="grid gap-2">
              <Label htmlFor="expiry-date">Expires On</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
          
          <Button onClick={generateLink}>Generate Share Link</Button>
          
          {shareLink && (
            <div className="mt-2 grid gap-2">
              <Label htmlFor="share-link">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-link"
                  value={shareLink}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareFileDialog;
