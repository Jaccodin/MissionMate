require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function testWithUser() {
    try {
        // Sign in with the test user
        console.log('1. Attempting to sign in...');
        const authResponse = await supabase.auth.signInWithPassword({
            email: 'testuser@missionmate.com',
            password: 'TestUser123!'
        });

        if (authResponse.error) {
            console.log(' Sign in failed:', authResponse.error.message);
            return;
        }

        const userId = authResponse.data.user?.id;
        console.log(' Successfully signed in');
        console.log('User ID:', userId);

        // Create a test goal
        console.log('\n2. Attempting to create a test goal...');
        const goalResponse = await supabase
            .from('goals')
            .insert([
                {
                    user_id: userId,
                    title: 'Learn React and Next.js',
                    description: 'Master React, Next.js, and related frontend technologies',
                    target_date: '2025-06-30',
                    progress: 0,
                    is_recurring: false
                }
            ])
            .select();

        if (goalResponse.error) {
            console.log(' Goal creation failed:', goalResponse.error.message);
            return;
        }

        console.log(' Successfully created goal:', goalResponse.data[0]?.id);

        // Read back all goals
        console.log('\n3. Attempting to read all goals...');
        const goalsResponse = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (goalsResponse.error) {
            console.log(' Reading goals failed:', goalsResponse.error.message);
            return;
        }

        console.log(' Successfully retrieved goals');
        console.log('Number of goals:', goalsResponse.data.length);
        console.log('Goals:', JSON.stringify(goalsResponse.data, null, 2));

    } catch (error) {
        console.log(' Unexpected error:', error.message);
    }
}

testWithUser();
