import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://nzrhsossrnsarleacmiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cmhzb3Nzcm5zYXJsZWFjbWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU2MTgyMTIsImV4cCI6MjExMTE5NDIxMn0.KAA3mxroK1xA-KBdSxBurGpLLPVfy1Lk3CuYfQP9vio';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
