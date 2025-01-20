require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function testConnection() {
    try {
        // Test the connection by getting the current timestamp from Supabase
        const { data, error } = await supabase
            .from('goals')
            .select('count')
            .limit(1);

        if (error) {
            console.error('Connection error:', error.message);
            return;
        }

        console.log('Successfully connected to Supabase!');
        console.log('Test query result:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testConnection();
