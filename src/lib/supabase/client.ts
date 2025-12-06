import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://aucusaxsdyrwmwpxhpgl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Y3VzYXhzZHlyd213cHhocGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMjEwNzQsImV4cCI6MjA3OTY5NzA3NH0.hvRs3zomqzRX2lW5AdzJbZAmjJg_81ODeyf75Vb4WuY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

