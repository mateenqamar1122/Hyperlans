
export interface FileCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  created_at: string;
  user_id: string;
}

export interface FileItem {
  id: string;
  name: string;
  description: string | null;
  file_type: string;
  size_bytes: number;
  storage_path: string;
  public_url: string;
  thumbnail_url: string | null;
  category_id: string | null;
  parent_folder_id: string | null;
  is_folder: boolean;
  is_starred: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  last_accessed_at: string | null;
  user_id: string;
  shared_with: string[];
}

export interface FileTag {
  id: string;
  name: string;
  color: string | null;
  file_id: string;
  user_id: string;
  created_at: string;
}

export interface FileShare {
  id: string;
  file_id: string;
  shared_by: string;
  shared_with: string;
  access_level: 'view' | 'edit';
  token: string;
  expires_at: string | null;
  created_at: string;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'date' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';
