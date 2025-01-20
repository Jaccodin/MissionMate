-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress tracking table
CREATE TABLE IF NOT EXISTS public.progress_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    progress_value INTEGER NOT NULL CHECK (progress_value >= 0 AND progress_value <= 100),
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own goals"
    ON public.goals
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals"
    ON public.goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON public.goals
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON public.goals
    FOR DELETE
    USING (auth.uid() = user_id);

-- Progress logs policies
CREATE POLICY "Users can view progress of their own goals"
    ON public.progress_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.goals
            WHERE goals.id = progress_logs.goal_id
            AND goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add progress to their own goals"
    ON public.progress_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.goals
            WHERE goals.id = progress_logs.goal_id
            AND goals.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS progress_logs_goal_id_idx ON public.progress_logs(goal_id);
CREATE INDEX IF NOT EXISTS goals_status_idx ON public.goals(status);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
