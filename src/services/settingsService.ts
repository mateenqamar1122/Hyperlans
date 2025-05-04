import { supabase } from '@/integrations/supabase/client';

export interface UserSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  two_factor_auth: boolean;
  session_timeout: string;
  language: string;
  timezone: string;
  theme: string;
  created_at?: string;
  updated_at?: string;
}

export const settingsService = {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }

    return data;
  },

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' }); // ✅ Fix applied here

    if (error) {
      console.error('Error updating user settings:', error);
      return false;
    }

    return true;
  },

  async initializeUserSettings(userId: string): Promise<boolean> {
    const defaultSettings: Partial<UserSettings> = {
      user_id: userId,
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      two_factor_auth: false,
      session_timeout: '30',
      language: 'en',
      timezone: 'UTC',
      theme: 'light',
      updated_at: new Date().toISOString(),
    };

    // First check if the user already has settings
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single();

    const { error } = existingSettings
      ? await supabase
          .from('user_settings')
          .update(defaultSettings)
          .eq('user_id', userId)
      : await supabase
          .from('user_settings')
          .insert([defaultSettings]);

    if (error) {
      console.error('Error initializing user settings:', error);
      return false;
    }

    return true;
  },
};
