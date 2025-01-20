require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function createTestData() {
    try {
        // Create a test goal
        const { data: goal, error: goalError } = await supabase
            .from('goals')
            .insert([
                {
                    title: 'Learn React',
                    description: 'Master React and its ecosystem',
                    target_date: '2025-12-31',
                    progress: 0,
                    is_recurring: false
                }
            ])
            .select();

        if (goalError) {
            console.error('Error creating goal:', goalError.message);
            if (goalError.message.includes('auth.uid()')) {
                console.log('Note: You need to be signed in to create goals due to RLS policies.');
                console.log('Please sign in through the application first.');
            }
            return;
        }

        console.log('Successfully created test goal:', goal);

        // Try to read back the goals to verify RLS
        const { data: goals, error: readError } = await supabase
            .from('goals')
            .select('*');

        if (readError) {
            console.error('Error reading goals:', readError.message);
            return;
        }

        console.log('Current goals in database:', goals);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

createTestData();
