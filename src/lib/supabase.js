import { createClient } from '@supabase/supabase-js';

console.log('Environment variables:', {
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY
});

if (!process.env.REACT_APP_SUPABASE_URL) {
    throw new Error('REACT_APP_SUPABASE_URL is not defined');
}

if (!process.env.REACT_APP_SUPABASE_ANON_KEY) {
    throw new Error('REACT_APP_SUPABASE_ANON_KEY is not defined');
}

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const db = {
    // User operations
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Goals operations
    async getGoals() {
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    async createGoal(goalData) {
        const { data, error } = await supabase
            .from('goals')
            .insert([goalData])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async updateGoal(goalId, updates) {
        const { data, error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', goalId)
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async deleteGoal(goalId) {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalId);
        
        if (error) throw error;
        return true;
    }
};
