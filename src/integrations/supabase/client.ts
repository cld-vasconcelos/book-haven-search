
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://umtvloreqixqximzxwcd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdHZsb3JlcWl4cXhpbXp4d2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTA0MjgsImV4cCI6MjA1NTQ2NjQyOH0.gKuKPfO8MS-hZVf73Nv5icgfa464WNaO9cGTb05BLJ0';

export const supabase = createClient(supabaseUrl, supabaseKey);
