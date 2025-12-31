const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
