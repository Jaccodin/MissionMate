import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Auth/AuthProvider';

export default function GoalList() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        // Fetch initial goals
        const fetchGoals = async () => {
            try {
                const { data, error } = await supabase
                    .from('goals')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setGoals(data || []);
            } catch (error) {
                console.error('Error fetching goals:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('goals_channel')
            .on('postgres_changes', 
                {
                    event: '*',
                    schema: 'public',
                    table: 'goals',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setGoals(prev => [payload.new, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setGoals(prev => 
                            prev.map(goal => 
                                goal.id === payload.new.id ? payload.new : goal
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setGoals(prev => 
                            prev.filter(goal => goal.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]);

    if (loading) {
        return <div>Loading goals...</div>;
    }

    return (
        <div className="goals-list">
            <h2>Your Goals</h2>
            {goals.length === 0 ? (
                <p>No goals yet. Create your first goal!</p>
            ) : (
                <div className="goals-grid">
                    {goals.map(goal => (
                        <div key={goal.id} className="goal-card">
                            <h3>{goal.title}</h3>
                            <p>{goal.description}</p>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ width: `${goal.progress}%` }}
                                />
                            </div>
                            <p>Progress: {goal.progress}%</p>
                            <p>Status: {goal.status}</p>
                            {goal.is_recurring && <span className="badge">Recurring</span>}
                            <p className="date">
                                Target: {new Date(goal.target_date).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
