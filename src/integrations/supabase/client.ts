// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bgluttaixkilubbsimow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbHV0dGFpeGtpbHViYnNpbW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODg0NzksImV4cCI6MjA1OTI2NDQ3OX0.Ku31hOWhz7DqZvU_4OebseErHpG0XXSxi_77JcqGXxA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);