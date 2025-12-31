const { createClient } = require('@supabase/supabase-js');

// Netlify panelinden veya .env dosyasından gelen değerler
const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;