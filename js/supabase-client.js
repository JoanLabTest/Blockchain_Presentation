
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://wnwerjuqtrduqkgwdjrg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2VyanVxdHJkdXFrZ3dkanJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mzg3OTEsImV4cCI6MjA4NjMxNDc5MX0.0WqMQs84PFAHuoMQT8xiAZYpWN5b2XGeumtaNzRHcoo'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Console log for debug (will remove in prod)
console.log("Supabase Client Initialized 🚀");
