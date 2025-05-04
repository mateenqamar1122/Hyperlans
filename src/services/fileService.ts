
import { supabase } from "@/integrations/supabase/client";
import { FileItem, FileCategory, FileTag, FileShare } from "@/types/fileSystem";
import { uploadFile, deleteFile } from "@/services/fileUploadService";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = "file_storage";

// Files CRUD
export const getFiles = async (folderId: string | null = null): Promise<FileItem[]> => {
  try {
    let query = supabase
      .from("file_items")
      .select("*")
      .order("is_folder", { ascending: false })
      .order("name");
      
    if (folderId) {
      query = query.eq("parent_folder_id", folderId);
    } else {
      query = query.is("parent_folder_id", null);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching files:", error);
      return [];
    }
    
    return data as FileItem[];
  } catch (error) {
    console.error("Error in getFiles:", error);
    return [];
  }
};

export const getStarredFiles = async (): Promise<FileItem[]> => {
  try {
    const { data, error } = await supabase
      .from("file_items")
      .select("*")
      .eq("is_starred", true)
      .order("name");
      
    if (error) {
      console.error("Error fetching starred files:", error);
      return [];
    }
    
    return data as FileItem[];
  } catch (error) {
    console.error("Error in getStarredFiles:", error);
    return [];
  }
};

export const getRecentFiles = async (limit: number = 10): Promise<FileItem[]> => {
  try {
    const { data, error } = await supabase
      .from("file_items")
      .select("*")
      .eq("is_folder", false)
      .order("updated_at", { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching recent files:", error);
      return [];
    }
    
    return data as FileItem[];
  } catch (error) {
    console.error("Error in getRecentFiles:", error);
    return [];
  }
};

export const getArchivedFiles = async (): Promise<FileItem[]> => {
  try {
    const { data, error } = await supabase
      .from("file_items")
      .select("*")
      .eq("is_archived", true)
      .order("name");
      
    if (error) {
      console.error("Error fetching archived files:", error);
      return [];
    }
    
    return data as FileItem[];
  } catch (error) {
    console.error("Error in getArchivedFiles:", error);
    return [];
  }
};

export const createFolder = async (name: string, parentId: string | null = null): Promise<FileItem | null> => {
  try {
    const newFolder = {
      name,
      description: null,
      file_type: "folder",
      size_bytes: 0,
      storage_path: "",
      public_url: "",
      parent_folder_id: parentId,
      is_folder: true,
      user_id: (await supabase.auth.getUser()).data.user?.id
    };
    
    const { data, error } = await supabase
      .from("file_items")
      .insert(newFolder)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating folder:", error);
      return null;
    }
    
    return data as FileItem;
  } catch (error) {
    console.error("Error in createFolder:", error);
    return null;
  }
};

export const uploadFileItem = async (
  file: File, 
  parentId: string | null = null,
  progressCallback?: (progress: number) => void
): Promise<FileItem | null> => {
  try {
    // Upload file to storage
    const folderPath = parentId ? `folder_${parentId}` : "root";
    const fileUrl = await uploadFile(file, BUCKET_NAME, folderPath);
    
    if (!fileUrl) return null;
    
    // Create file record in database
    const fileData = {
      name: file.name,
      description: null,
      file_type: file.type,
      size_bytes: file.size,
      storage_path: `${folderPath}/${uuidv4()}_${file.name}`,
      public_url: fileUrl,
      parent_folder_id: parentId,
      is_folder: false,
      user_id: (await supabase.auth.getUser()).data.user?.id
    };
    
    const { data, error } = await supabase
      .from("file_items")
      .insert(fileData)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating file record:", error);
      return null;
    }
    
    return data as FileItem;
  } catch (error) {
    console.error("Error in uploadFileItem:", error);
    return null;
  }
};

export const updateFile = async (id: string, updates: Partial<FileItem>): Promise<FileItem | null> => {
  try {
    // Remove properties that shouldn't be updated directly
    const { id: _, created_at, user_id, storage_path, public_url, ...validUpdates } = updates as any;
    
    const { data, error } = await supabase
      .from("file_items")
      .update({ ...validUpdates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating file:", error);
      return null;
    }
    
    return data as FileItem;
  } catch (error) {
    console.error("Error in updateFile:", error);
    return null;
  }
};

export const toggleStar = async (id: string, isStarred: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("file_items")
      .update({ is_starred: isStarred })
      .eq("id", id);
      
    if (error) {
      console.error("Error toggling star:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in toggleStar:", error);
    return false;
  }
};

export const moveToArchive = async (id: string, isArchived: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("file_items")
      .update({ is_archived: isArchived })
      .eq("id", id);
      
    if (error) {
      console.error("Error archiving file:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in moveToArchive:", error);
    return false;
  }
};

export const deleteFileItem = async (id: string): Promise<boolean> => {
  try {
    // Get file info first
    const { data: fileData } = await supabase
      .from("file_items")
      .select("*")
      .eq("id", id)
      .single();
      
    if (!fileData) return false;
    
    // Check if it's a folder
    if (fileData.is_folder) {
      // Delete all child files and folders recursively
      await deleteFolder(id);
    } else {
      // Delete actual file from storage if it's a file
      await deleteFile(fileData.public_url, BUCKET_NAME);
    }
    
    // Delete the database record
    const { error } = await supabase
      .from("file_items")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting file record:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteFileItem:", error);
    return false;
  }
};

const deleteFolder = async (folderId: string): Promise<void> => {
  // Get all items in this folder
  const { data: folderContents } = await supabase
    .from("file_items")
    .select("*")
    .eq("parent_folder_id", folderId);
    
  if (folderContents) {
    // Delete each item recursively
    for (const item of folderContents) {
      await deleteFileItem(item.id);
    }
  }
};

export const searchFiles = async (query: string): Promise<FileItem[]> => {
  try {
    const { data, error } = await supabase
      .from("file_items")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("is_folder", { ascending: false })
      .order("name");
      
    if (error) {
      console.error("Error searching files:", error);
      return [];
    }
    
    return data as FileItem[];
  } catch (error) {
    console.error("Error in searchFiles:", error);
    return [];
  }
};

// Categories CRUD
export const getCategories = async (): Promise<FileCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("file_categories")
      .select("*")
      .order("name");
      
    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
    
    return data as FileCategory[];
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
};

export const createCategory = async (category: Partial<FileCategory>): Promise<FileCategory | null> => {
  try {
    const { data, error } = await supabase
      .from("file_categories")
      .insert({
        ...category,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating category:", error);
      return null;
    }
    
    return data as FileCategory;
  } catch (error) {
    console.error("Error in createCategory:", error);
    return null;
  }
};

export const updateCategory = async (id: string, updates: Partial<FileCategory>): Promise<FileCategory | null> => {
  try {
    const { data, error } = await supabase
      .from("file_categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating category:", error);
      return null;
    }
    
    return data as FileCategory;
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    // Update files to remove this category
    await supabase
      .from("file_items")
      .update({ category_id: null })
      .eq("category_id", id);
      
    // Delete the category
    const { error } = await supabase
      .from("file_categories")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting category:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return false;
  }
};

// File sharing
export const createShareLink = async (
  fileId: string, 
  accessLevel: 'view' | 'edit' = 'view',
  expiresAt?: Date
): Promise<{ shareLink: string; shareToken: string } | null> => {
  try {
    const token = uuidv4();
    const currentUser = await supabase.auth.getUser();
    
    const shareData = {
      file_id: fileId,
      shared_by: currentUser.data.user?.id,
      shared_with: '',
      access_level: accessLevel,
      token: token,
      expires_at: expiresAt ? expiresAt.toISOString() : null
    };
    
    const { error } = await supabase
      .from("file_shares")
      .insert(shareData);
      
    if (error) {
      console.error("Error creating share link:", error);
      return null;
    }
    
    // Generate share link
    const shareLink = `${window.location.origin}/file-share/${token}`;
    
    return { shareLink, shareToken: token };
  } catch (error) {
    console.error("Error in createShareLink:", error);
    return null;
  }
};

export const getSharedFile = async (token: string): Promise<{file: FileItem; shareInfo: FileShare} | null> => {
  try {
    const { data: shareData, error: shareError } = await supabase
      .from("file_shares")
      .select("*")
      .eq("token", token)
      .single();
      
    if (shareError || !shareData) {
      console.error("Error fetching share info:", shareError);
      return null;
    }
    
    // Check if share link has expired
    if (shareData.expires_at && new Date(shareData.expires_at) < new Date()) {
      console.error("Share link has expired");
      return null;
    }
    
    const { data: fileData, error: fileError } = await supabase
      .from("file_items")
      .select("*")
      .eq("id", shareData.file_id)
      .single();
      
    if (fileError || !fileData) {
      console.error("Error fetching shared file:", fileError);
      return null;
    }
    
    return { 
      file: fileData as FileItem, 
      shareInfo: shareData as FileShare 
    };
  } catch (error) {
    console.error("Error in getSharedFile:", error);
    return null;
  }
};
