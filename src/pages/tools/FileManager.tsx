
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  AlertCircle,
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  File,
  LayoutGrid,
  LayoutList,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="flex flex-col items-center justify-center py-16">
          {searchQuery ? (
            <>
              <div className="p-4 rounded-full bg-gray-100/80 dark:bg-gray-800/80 mb-6">
                <FolderSearch className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No files match your search</h3>
              <p className="text-gray-500 dark:text-gray-400">Try a different search term</p>
            </>
          ) : (
            <>
              {selectedView === 'all' ? (
                <>
                  <div className="p-4 rounded-full bg-indigo-100/80 dark:bg-indigo-900/20 mb-6">
                    <Folder className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">This folder is empty</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Upload files or create a folder to get started</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setCreateFolderOpen(true)}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Create Folder
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleUploadFile}
                      className="border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300"
                    >
                      Upload Files
                    </Button>
                  </div>
                </>
              ) : selectedView === 'starred' ? (
                <>
                  <div className="p-4 rounded-full bg-amber-100/80 dark:bg-amber-900/20 mb-6">
                    <Star className="h-12 w-12 text-amber-500 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No starred files</h3>
                  <p className="text-gray-500 dark:text-gray-400">Star files to find them here</p>
                </>
              ) : selectedView === 'recent' ? (
                <>
                  <div className="p-4 rounded-full bg-blue-100/80 dark:bg-blue-900/20 mb-6">
                    <Clock className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No recent files</h3>
                  <p className="text-gray-500 dark:text-gray-400">Your recently accessed files will appear here</p>
                </>
              ) : selectedView === 'archived' ? (
                <>
                  <div className="p-4 rounded-full bg-purple-100/80 dark:bg-purple-900/20 mb-6">
                    <Archive className="h-12 w-12 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No archived files</h3>
                  <p className="text-gray-500 dark:text-gray-400">Files you archive will appear here</p>
                </>
              ) : selectedView.startsWith('category-') ? (
                <>
                  <div className="p-4 rounded-full bg-rose-100/80 dark:bg-rose-900/20 mb-6">
                    <CircleOff className="h-12 w-12 text-rose-500 dark:text-rose-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No files in this category</h3>
                  <p className="text-gray-500 dark:text-gray-400">Add files to this category to see them here</p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-emerald-100/80 dark:bg-emerald-900/20 mb-6">
                    <HardDrive className="h-12 w-12 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No files found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Upload files to get started</p>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
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
        <div className="flex-1 flex flex-col overflow-hidden p-6 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                  File Manager
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Organize and manage your files
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setCreateFolderOpen(true)}
                  size="sm"
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 shadow-sm"
                >
                  <Folder className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
                <Button 
                  onClick={handleUploadFile}
                  size="sm"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
            
            {/* Mobile nav (show categories & views) */}
            <div className="block md:hidden mb-4">
              {/* ... mobile navigation (omitted for brevity) ... */}
            </div>
            
            {/* Breadcrumbs (only show in "all files" view) */}
            {selectedView === 'all' && (
              <div className="mb-4">
                <FileBreadcrumb
                  folders={breadcrumbs}
                  onNavigate={handleBreadcrumbClick}
                />
              </div>
            )}
            
            {/* Storage Stats */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Storage Overview</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">You've used 65% of your storage</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">65.4 GB</span> <span className="text-gray-500 dark:text-gray-400">used of 100 GB</span>
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">25.5 GB</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">15.2 GB</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                    <FileVideo className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Videos</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">22.8 GB</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <File className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Others</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1.9 GB</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* File Toolbar */}
            <div className="mb-4">
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
            
            {/* View Mode Toggle */}
            <div className="flex justify-end mb-4">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "rounded-none h-9 w-9",
                    viewMode === "grid" && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "rounded-none h-9 w-9",
                    viewMode === "list" && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 overflow-x-hidden pr-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-full blur-xl animate-pulse"></div>
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400 relative z-10" />
                </div>
              </div>
            ) : files.length === 0 ? (
              renderEmptyState
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {fileCards}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
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
                ? <span className="font-medium text-gray-900 dark:text-gray-100">the folder "{selectedFileForDelete.name}" and all its contents.</span>
                : <span className="font-medium text-gray-900 dark:text-gray-100">the file "{selectedFileForDelete?.name}".</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 dark:border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFile} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default React.memo(FileManager);
