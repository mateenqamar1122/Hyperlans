
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (file: File, bucket: string, folder: string = ''): Promise<string | null> => {
  try {
    if (!file) return null;
    
    // Create a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder ? `${folder}/` : ''}${uuidv4()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

export const deleteFile = async (filePath: string, bucket: string): Promise<boolean> => {
  try {
    if (!filePath) return false;
    
    // Extract file name from the URL
    const fileName = filePath.split('/').pop();
    if (!fileName) return false;
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};