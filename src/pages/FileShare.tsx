
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileItem, FileShare } from '@/types/fileSystem';
import { getSharedFile } from '@/services/fileService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, File, FileText, Image, Video, Music, FileCode, ExternalLink } from 'lucide-react';

const FileShare = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ file: FileItem; shareInfo: FileShare } | null>(null);

  useEffect(() => {
    const loadSharedFile = async () => {
      if (!token) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const data = await getSharedFile(token);
        if (data) {
          setFileData(data);
        } else {
          setError('This share link is invalid or has expired');
        }
      } catch (error) {
        console.error('Error loading shared file:', error);
        setError('An error occurred while loading the shared file');
      } finally {
        setLoading(false);
      }
    };

    loadSharedFile();
  }, [token]);

  const getFileIcon = () => {
    if (!fileData) return <File className="h-16 w-16 text-gray-400" />;

    const { file } = fileData;
    
    if (file.file_type.startsWith('image/')) return <Image className="h-16 w-16 text-purple-500" />;
    if (file.file_type.startsWith('video/')) return <Video className="h-16 w-16 text-red-500" />;
    if (file.file_type.startsWith('audio/')) return <Music className="h-16 w-16 text-green-500" />;
    
    if (file.file_type.includes('pdf')) return <FileText className="h-16 w-16 text-orange-500" />;
    if (file.file_type.includes('doc') || file.file_type.includes('word')) 
      return <FileText className="h-16 w-16 text-blue-700" />;
    
    if (file.file_type.includes('html') || file.file_type.includes('javascript') || file.file_type.includes('css')) 
      return <FileCode className="h-16 w-16 text-yellow-500" />;
    
    return <File className="h-16 w-16 text-gray-500" />;
  };

  const renderPreview = () => {
    if (!fileData) return null;
    
    const { file } = fileData;
    const isImage = file.file_type.startsWith('image/');
    const isVideo = file.file_type.startsWith('video/');
    const isAudio = file.file_type.startsWith('audio/');
    const isPdf = file.file_type === 'application/pdf';
    
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
    }
    
    if (isVideo) {
      return (
        <video 
          controls 
          className="w-full max-h-[60vh]"
        >
          <source src={file.public_url} type={file.file_type} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    if (isAudio) {
      return (
        <audio 
          controls 
          className="w-full mt-4"
        >
          <source src={file.public_url} type={file.file_type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }
    
    if (isPdf) {
      return (
        <iframe
          src={file.public_url}
          className="w-full h-[60vh]"
          title={file.name}
        />
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground mb-4">This file type cannot be previewed</p>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">Loading shared file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>There was a problem loading the shared file</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Shared File Not Found</CardTitle>
            <CardDescription>The shared file could not be found or the link has expired</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { file, shareInfo } = fileData;

  return (
    <div className="container max-w-5xl py-8 px-4 min-h-screen">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {getFileIcon()}
            <div>
              <CardTitle className="text-2xl">{file.name}</CardTitle>
              <CardDescription>
                {formatFileSize(file.size_bytes)} • Shared {new Date(shareInfo.created_at).toLocaleDateString()}
                {shareInfo.expires_at && ` • Expires ${new Date(shareInfo.expires_at).toLocaleDateString()}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderPreview()}
          
          <div className="flex justify-center mt-6 gap-4">
            <Button variant="outline" asChild>
              <a href={file.public_url} download={file.name}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            
            <Button asChild>
              <a href={file.public_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileShare;
