import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

export default function GoalList() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGoals();
        
        // Subscribe to real-time changes
        const subscription = supabase
            .channel('goals')
            .on('postgres_changes', 
                {
                    event: '*',
                    schema: 'public',
                    table: 'goals'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setGoals(prev => [...prev, payload.new]);
                    } else if (payload.eventType === 'DELETE') {
                        setGoals(prev => prev.filter(goal => goal.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE') {
                        setGoals(prev => prev.map(goal => 
                            goal.id === payload.new.id ? payload.new : goal
                        ));
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchGoals = async () => {
        try {
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setGoals(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleGoalStatus = async (goalId, currentStatus) => {
        try {
            const { error } = await supabase
                .from('goals')
                .update({ completed: !currentStatus })
                .eq('id', goalId);

            if (error) throw error;
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteGoal = async (goalId) => {
        try {
            const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', goalId);

            if (error) throw error;
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div className="loading">Loading goals...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="goal-list">
            {goals.length === 0 ? (
                <div className="no-goals">
                    <p>No goals yet. Create your first goal to get started!</p>
                </div>
            ) : (
                goals.map(goal => (
                    <div 
                        key={goal.id} 
                        className={`goal-item ${goal.completed ? 'completed' : ''}`}
                    >
                        <div className="goal-content">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={goal.completed}
                                    onChange={() => toggleGoalStatus(goal.id, goal.completed)}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <div className="goal-details">
                                <h3>{goal.title}</h3>
                                <p>{goal.description}</p>
                                <div className="goal-meta">
                                    <span className="due-date">
                                        Due: {format(new Date(goal.due_date), 'MMM d, yyyy')}
                                    </span>
                                    <span className={`priority ${goal.priority.toLowerCase()}`}>
                                        {goal.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button 
                            className="delete-goal" 
                            onClick={() => deleteGoal(goal.id)}
                            aria-label="Delete goal"
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
