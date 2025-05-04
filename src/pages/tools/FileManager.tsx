
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { FileItem, FileCategory, ViewMode, SortOption, SortDirection } from '@/types/fileSystem';
import {
  getFiles,
  getStarredFiles,
  getRecentFiles,
  getArchivedFiles,
  createFolder,
  uploadFileItem,
  updateFile,
  deleteFileItem,
  toggleStar,
  moveToArchive,
  searchFiles,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/fileService';

// Components
import FileToolbar from '@/components/file-system/FileToolbar';
import FileSidebar from '@/components/file-system/FileSidebar';
import FileCard from '@/components/file-system/FileCard';
import FileList from '@/components/file-system/FileList';
import FileBreadcrumb from '@/components/file-system/FileBreadcrumb';

// Dialogs
import CreateFolderDialog from '@/components/file-system/dialogs/CreateFolderDialog';
import RenameDialog from '@/components/file-system/dialogs/RenameDialog';
import MoveFolderDialog from '@/components/file-system/dialogs/MoveFolderDialog';
import ShareFileDialog from '@/components/file-system/dialogs/ShareFileDialog';
import CategoryDialog from '@/components/file-system/dialogs/CategoryDialog';
import FilePreviewDialog from '@/components/file-system/dialogs/FilePreviewDialog';

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import {
  CircleOff,
  HardDrive,
  Folder,
  FolderSearch,
  Clock,
  Star,
  Archive,
  Loader2,
  Upload,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BreadcrumbFolder {
  id: string;
  name: string;
}

const FileManager = () => {
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedView, setSelectedView] = useState('all');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbFolder[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [files, setFiles] = useState<FileItem[]>([]);
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [allFolders, setAllFolders] = useState<FileItem[]>([]);
  
  // Dialog State
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedFileForRename, setSelectedFileForRename] = useState<FileItem | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedFileForMove, setSelectedFileForMove] = useState<FileItem | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState<FileItem | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedFileForDelete, setSelectedFileForDelete] = useState<FileItem | null>(null);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<FileItem | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadDataTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Hooks
  const { toast: showToast } = useToast();

  // Cleanup function for all timeouts and async operations
  useEffect(() => {
    return () => {
      if (loadDataTimeoutRef.current) {
        clearTimeout(loadDataTimeoutRef.current);
      }
    };
  }, []);

  // Load initial data with debounce
  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  // Reload data when view changes with debounce
  useEffect(() => {
    // Clear any existing timeout
    if (loadDataTimeoutRef.current) {
      clearTimeout(loadDataTimeoutRef.current);
    }

    // Set a new timeout to debounce the data loading
    loadDataTimeoutRef.current = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        loadData();
      }
    }, 100);

    // Cleanup timeout on component unmount or dependency change
    return () => {
      if (loadDataTimeoutRef.current) {
        clearTimeout(loadDataTimeoutRef.current);
      }
    };
  }, [selectedView, currentFolder]);

  // Memoize sort function to prevent unnecessary re-renders
  const sortFiles = useCallback((filesToSort: FileItem[]) => {
    return [...filesToSort].sort((a, b) => {
      // Always put folders before files
      if (a.is_folder && !b.is_folder) return -1;
      if (!a.is_folder && b.is_folder) return 1;
      
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'size':
          comparison = a.size_bytes - b.size_bytes;
          break;
        case 'type':
          comparison = a.file_type.localeCompare(b.file_type);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortBy, sortDirection]);

  // Apply sorting when dependencies change
  useEffect(() => {
    setFiles(prevFiles => sortFiles([...prevFiles]));
  }, [sortBy, sortDirection, sortFiles]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setSelectedFiles(new Set());

    try {
      let loadedFiles: FileItem[] = [];
      
      if (selectedView === 'all') {
        loadedFiles = await getFiles(currentFolder);
      } else if (selectedView === 'starred') {
        loadedFiles = await getStarredFiles();
      } else if (selectedView === 'recent') {
        loadedFiles = await getRecentFiles(20);
      } else if (selectedView === 'archived') {
        loadedFiles = await getArchivedFiles();
      } else if (selectedView.startsWith('category-')) {
        const categoryId = selectedView.replace('category-', '');
        loadedFiles = await getFiles(null); // Load all files first
        loadedFiles = loadedFiles.filter(file => file.category_id === categoryId);
      }

      // Update breadcrumbs if in a folder
      if (currentFolder && selectedView === 'all') {
        updateBreadcrumbs(currentFolder);
      } else {
        setBreadcrumbs([]);
      }
      
      // Apply sorting to loaded files
      setFiles(sortFiles(loadedFiles));
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder, selectedView, sortFiles]);

  const loadCategories = useCallback(async () => {
    try {
      const loadedCategories = await getCategories();
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);
  
  const loadAllFolders = useCallback(async (parentId: string | null) => {
    try {
      const folders = await getFiles(parentId);
      const onlyFolders = folders.filter(file => file.is_folder);
      
      setAllFolders(prevFolders => {
        const newFolders = [...prevFolders];
        
        // Remove folders with the same parent ID
        const withoutSameParent = newFolders.filter(f => f.parent_folder_id !== parentId);
        
        // Add new folders
        return [...withoutSameParent, ...onlyFolders];
      });
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  }, []);

  const updateBreadcrumbs = useCallback(async (folderId: string) => {
    const breadcrumbPath: BreadcrumbFolder[] = [];
    let currentId = folderId;
    
    while (currentId) {
      try {
        // Get folder details
        const { data: folder } = await supabase
          .from('file_items')
          .select('id, name, parent_folder_id')
          .eq('id', currentId)
          .single();
        
        if (!folder) break;
        
        breadcrumbPath.unshift({
          id: folder.id,
          name: folder.name
        });
        
        currentId = folder.parent_folder_id;
      } catch (error) {
        console.error('Error fetching breadcrumb folder:', error);
        break;
      }
    }
    
    setBreadcrumbs(breadcrumbPath);
  }, []);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setSelectedFiles(new Set());
    
    try {
      if (searchQuery) {
        const results = await searchFiles(searchQuery);
        setFiles(sortFiles(results));
      } else {
        loadData();
      }
    } catch (error) {
      console.error('Error searching files:', error);
      toast.error('Failed to search files');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, loadData, sortFiles]);

  const handleCreateFolder = useCallback(async (name: string) => {
    try {
      const folder = await createFolder(name, currentFolder);
      
      if (folder) {
        toast.success(`Folder '${name}' created successfully`);
        loadData(); // Reload the file list
      } else {
        toast.error('Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('An error occurred while creating the folder');
    }
  }, [currentFolder, loadData]);

  const handleUploadFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        toast.info(`Uploading ${file.name}...`);
        
        const uploadedFile = await uploadFileItem(file, currentFolder);
        
        if (uploadedFile) {
          toast.success(`Uploaded ${file.name} successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      
      // Reload the file list
      loadData();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('An error occurred while uploading files');
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [currentFolder, loadData]);

  const handleRenameFile = useCallback(async (id: string, newName: string) => {
    try {
      const updated = await updateFile(id, { name: newName });
      
      if (updated) {
        toast.success(`Renamed to '${newName}' successfully`);
        loadData(); // Reload the file list
      } else {
        toast.error('Failed to rename');
      }
    } catch (error) {
      console.error('Error renaming:', error);
      toast.error('An error occurred while renaming');
    }
  }, [loadData]);

  const handleMoveFile = useCallback(async (fileId: string, destinationFolderId: string | null) => {
    try {
      const updated = await updateFile(fileId, { parent_folder_id: destinationFolderId });
      
      if (updated) {
        toast.success(`Moved successfully`);
        loadData(); // Reload the file list
      } else {
        toast.error('Failed to move');
      }
    } catch (error) {
      console.error('Error moving file:', error);
      toast.error('An error occurred while moving');
    }
  }, [loadData]);

  const handleToggleStar = useCallback(async (file: FileItem, value: boolean) => {
    try {
      const success = await toggleStar(file.id, value);
      
      if (success) {
        toast.success(value ? 'Added to starred' : 'Removed from starred');
        loadData(); // Reload the file list
      } else {
        toast.error(value ? 'Failed to star' : 'Failed to unstar');
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error('An error occurred');
    }
  }, [loadData]);

  const handleArchive = useCallback(async (file: FileItem, value: boolean) => {
    try {
      const success = await moveToArchive(file.id, value);
      
      if (success) {
        toast.success(value ? 'Moved to archive' : 'Restored from archive');
        loadData(); // Reload the file list
      } else {
        toast.error(value ? 'Failed to archive' : 'Failed to restore');
      }
    } catch (error) {
      console.error('Error archiving/restoring:', error);
      toast.error('An error occurred');
    }
  }, [loadData]);

  const handleDeleteFile = useCallback(async () => {
    if (!selectedFileForDelete) return;
    
    try {
      const success = await deleteFileItem(selectedFileForDelete.id);
      
      if (success) {
        toast.success(`${selectedFileForDelete.is_folder ? 'Folder' : 'File'} deleted successfully`);
        setSelectedFileForDelete(null);
        loadData(); // Reload the file list
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setDeleteConfirmOpen(false);
    }
  }, [selectedFileForDelete, loadData]);

  const handleCategoryCreate = useCallback(async (categoryData: Partial<FileCategory>) => {
    try {
      const category = await createCategory(categoryData);
      
      if (category) {
        toast.success(`Category '${category.name}' created successfully`);
        loadCategories(); // Reload categories
      } else {
        toast.error('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('An error occurred while creating the category');
    }
  }, [loadCategories]);

  const handleCategoryUpdate = useCallback(async (categoryData: Partial<FileCategory>) => {
    if (!categoryData.id) return;
    
    try {
      const category = await updateCategory(categoryData.id, categoryData);
      
      if (category) {
        toast.success(`Category updated successfully`);
        loadCategories(); // Reload categories
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('An error occurred while updating the category');
    }
  }, [loadCategories]);

  const handleCategoryDelete = useCallback(async (category: FileCategory) => {
    try {
      const success = await deleteCategory(category.id);
      
      if (success) {
        toast.success(`Category '${category.name}' deleted successfully`);
        
        // If we're currently viewing this category, go back to all files
        if (selectedView === `category-${category.id}`) {
          setSelectedView('all');
        }
        
        loadCategories(); // Reload categories
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An error occurred while deleting the category');
    }
  }, [selectedView, loadCategories]);

  const handleFileClick = useCallback((file: FileItem) => {
    if (file.is_folder) {
      // Navigate into folder
      setCurrentFolder(file.id);
      setSelectedView('all'); // Reset to all files view
    } else {
      // Preview file
      setSelectedFileForPreview(file);
      setFilePreviewOpen(true);
    }
  }, []);

  const handleBreadcrumbClick = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  const handleSelectFile = useCallback((id: string, selected: boolean) => {
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      
      return newSelected;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      const allIds = files.map(file => file.id);
      setSelectedFiles(new Set(allIds));
    } else {
      setSelectedFiles(new Set());
    }
  }, [files]);

  const handleBulkArchive = useCallback(async () => {
    const selectedFilesList = Array.from(selectedFiles);
    let successCount = 0;
    
    for (const fileId of selectedFilesList) {
      try {
        const success = await moveToArchive(fileId, true);
        if (success) {
          successCount++;
        }
      } catch (error) {
        console.error(`Error archiving file ${fileId}:`, error);
      }
    }
    
    if (successCount > 0) {
      toast.success(`Archived ${successCount} items successfully`);
      loadData(); // Reload the file list
    }
    
    if (successCount < selectedFilesList.length) {
      toast.error(`Failed to archive ${selectedFilesList.length - successCount} items`);
    }
    
    setSelectedFiles(new Set());
  }, [selectedFiles, loadData]);

  const handleBulkStar = useCallback(async () => {
    const selectedFilesList = Array.from(selectedFiles);
    let successCount = 0;
    
    for (const fileId of selectedFilesList) {
      try {
        const success = await toggleStar(fileId, true);
        if (success) {
          successCount++;
        }
      } catch (error) {
        console.error(`Error starring file ${fileId}:`, error);
      }
    }
    
    if (successCount > 0) {
      toast.success(`Starred ${successCount} items successfully`);
      loadData(); // Reload the file list
    }
    
    if (successCount < selectedFilesList.length) {
      toast.error(`Failed to star ${selectedFilesList.length - successCount} items`);
    }
    
    setSelectedFiles(new Set());
  }, [selectedFiles, loadData]);

  const handleBulkDelete = useCallback(async () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.size} items?`)) {
      const selectedFilesList = Array.from(selectedFiles);
      let successCount = 0;
      
      for (const fileId of selectedFilesList) {
        try {
          const success = await deleteFileItem(fileId);
          if (success) {
            successCount++;
          }
        } catch (error) {
          console.error(`Error deleting file ${fileId}:`, error);
        }
      }
      
      if (successCount > 0) {
        toast.success(`Deleted ${successCount} items successfully`);
        loadData(); // Reload the file list
      }
      
      if (successCount < selectedFilesList.length) {
        toast.error(`Failed to delete ${selectedFilesList.length - successCount} items`);
      }
      
      setSelectedFiles(new Set());
    }
  }, [selectedFiles, loadData]);

  // Memoize the empty state rendering to prevent unnecessary re-renders
  const renderEmptyState = useMemo(() => (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        {searchQuery ? (
          <>
            <FolderSearch className="h-16 w-16 text-muted-foreground/60 mb-4" />
            <h3 className="text-xl font-medium mb-2">No files match your search</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </>
        ) : (
          <>
            {selectedView === 'all' ? (
              <>
                <Folder className="h-16 w-16 text-muted-foreground/60 mb-4" />
                <h3 className="text-xl font-medium mb-2">This folder is empty</h3>
                <p className="text-muted-foreground mb-6">Upload files or create a folder to get started</p>
                <div className="flex gap-2">
                  <Button onClick={() => setCreateFolderOpen(true)}>
                    Create Folder
                  </Button>
                  <Button variant="outline" onClick={handleUploadFile}>
                    Upload Files
                  </Button>
                </div>
              </>
            ) : selectedView === 'starred' ? (
              <>
                <Star className="h-16 w-16 text-muted-foreground/60 mb-4" />
                <h3 className="text-xl font-medium mb-2">No starred files</h3>
                <p className="text-muted-foreground">Star files to find them here</p>
              </>
            ) : selectedView === 'recent' ? (
              <>
                <Clock className="h-16 w-16 text-muted-foreground/60 mb-4" />
                <h3 className="text-xl font-medium mb-2">No recent files</h3>
                <p className="text-muted-foreground">Your recently accessed files will appear here</p>
              </>
            ) : selectedView === 'archived' ? (
              <>
                <Archive className="h-16 w-16 text-muted-foreground/60 mb-4" />
                <h3 className="text-xl font-medium mb-2">No archived files</h3>
                <p className="text-muted-foreground">Files you archive will appear here</p>
              </>
            ) : selectedView.startsWith('category-') ? (
              <>
                <CircleOff className="h-16 w-16 text-muted-foreground/60 mb-4" />
                <h3 className="text-xl font-medium mb-2">No files in this category</h3>
                <p className="text-muted-foreground">Add files to this category to see them here</p>
              </>
            ) : (
              <>
                <HardDrive className="h-16 w-16 text-muted-foreground/60 mb-4" />
                <h3 className="text-xl font-medium mb-2">No files found</h3>
                <p className="text-muted-foreground">Upload files to get started</p>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  ), [searchQuery, selectedView, handleUploadFile]);

  // Memoized file cards to prevent unnecessary re-renders
  const fileCards = useMemo(() => {
    return files.map((file) => (
      <FileCard
        key={file.id}
        file={file}
        onClick={handleFileClick}
        onShare={(file) => {
          setSelectedFileForShare(file);
          setShareDialogOpen(true);
        }}
        onRename={(file) => {
          setSelectedFileForRename(file);
          setRenameDialogOpen(true);
        }}
        onToggleStar={handleToggleStar}
        onMove={(file) => {
          setSelectedFileForMove(file);
          setMoveDialogOpen(true);
          loadAllFolders(null);
        }}
        onArchive={handleArchive}
        onDelete={(file) => {
          setSelectedFileForDelete(file);
          setDeleteConfirmOpen(true);
        }}
      />
    ));
  }, [files, handleFileClick, handleToggleStar, handleArchive, loadAllFolders]);

  return (
    <div className="container-fluid px-0 mx-0 max-w-full">
      <div className="flex h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <div className="hidden md:block">
          <FileSidebar
            selectedView={selectedView}
            categories={categories}
            onViewSelect={(view) => {
              setSelectedView(view);
              setCurrentFolder(null);
            }}
            onCategorySelect={(categoryId) => {
              setSelectedView(`category-${categoryId}`);
              setCurrentFolder(null);
            }}
            onCreateCategory={() => {
              setSelectedCategory(undefined);
              setCategoryDialogOpen(true);
            }}
            onEditCategory={(category) => {
              setSelectedCategory(category);
              setCategoryDialogOpen(true);
            }}
            onDeleteCategory={(category) => {
              if (confirm(`Are you sure you want to delete '${category.name}' category?`)) {
                handleCategoryDelete(category);
              }
            }}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">File Manager</h1>
            <p className="text-muted-foreground mb-4">
              Organize and manage your files
            </p>
            
            {/* Mobile nav (show categories & views) */}
            <div className="block md:hidden mb-4">
              {/* ... mobile navigation (omitted for brevity) ... */}
            </div>
            
            {/* Breadcrumbs (only show in "all files" view) */}
            {selectedView === 'all' && (
              <FileBreadcrumb
                folders={breadcrumbs}
                onNavigate={handleBreadcrumbClick}
              />
            )}
            
            {/* File Toolbar */}
            <FileToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={setSortBy}
              onSortDirectionToggle={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              searchQuery={searchQuery}
              onSearchChange={(query) => {
                setSearchQuery(query);
                if (!query) {
                  loadData();
                }
              }}
              selectedCount={selectedFiles.size}
              onCreateFolder={() => setCreateFolderOpen(true)}
              onUploadFile={handleUploadFile}
              onBulkArchive={handleBulkArchive}
              onBulkStar={handleBulkStar}
              onBulkDelete={handleBulkDelete}
            />
          </div>
          
          <ScrollArea className="flex-1 overflow-x-hidden pr-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : files.length === 0 ? (
              renderEmptyState
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {fileCards}
                  </div>
                ) : (
                  <FileList
                    files={files}
                    selectedFiles={selectedFiles}
                    onSelect={handleSelectFile}
                    onSelectAll={handleSelectAll}
                    onFileClick={handleFileClick}
                    onShare={(file) => {
                      setSelectedFileForShare(file);
                      setShareDialogOpen(true);
                    }}
                    onRename={(file) => {
                      setSelectedFileForRename(file);
                      setRenameDialogOpen(true);
                    }}
                    onToggleStar={handleToggleStar}
                    onMove={(file) => {
                      setSelectedFileForMove(file);
                      setMoveDialogOpen(true);
                      loadAllFolders(null);
                    }}
                    onArchive={handleArchive}
                    onDelete={(file) => {
                      setSelectedFileForDelete(file);
                      setDeleteConfirmOpen(true);
                    }}
                  />
                )}
              </>
            )}
          </ScrollArea>
        </div>
      </div>
      
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
        multiple
      />
      
      {/* Dialogs */}
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onConfirm={handleCreateFolder}
      />
      
      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        file={selectedFileForRename}
        onConfirm={handleRenameFile}
      />
      
      <MoveFolderDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        file={selectedFileForMove}
        folders={allFolders}
        onConfirm={handleMoveFile}
        onLoadFolders={loadAllFolders}
      />
      
      <ShareFileDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        file={selectedFileForShare}
      />
      
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={selectedCategory}
        onConfirm={selectedCategory ? handleCategoryUpdate : handleCategoryCreate}
      />
      
      <FilePreviewDialog
        open={filePreviewOpen}
        onOpenChange={setFilePreviewOpen}
        file={selectedFileForPreview}
      />
      
      <AlertDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              {selectedFileForDelete?.is_folder
                ? `the folder "${selectedFileForDelete.name}" and all its contents.`
                : `the file "${selectedFileForDelete?.name}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default React.memo(FileManager);
