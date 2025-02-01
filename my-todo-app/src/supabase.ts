import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cehnvalvwphbmjvjejjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaG52YWx2d3BoYm1qdmplampwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMzA0OTEsImV4cCI6MjA1MzkwNjQ5MX0.LiBCff091Nyeg3fWMkwwRJr5h3qpIWL1kfzbNwUC_VM';

export const supabase = createClient(supabaseUrl, supabaseKey);