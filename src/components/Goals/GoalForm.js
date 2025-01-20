import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../Auth/AuthProvider';

export default function GoalForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target_date: '',
        is_recurring: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('goals')
                .insert([
                    {
                        user_id: user.id,
                        ...formData,
                        progress: 0,
                        status: 'in_progress'
                    }
                ])
                .select();

            if (error) throw error;

            // Reset form on success
            setFormData({
                title: '',
                description: '',
                target_date: '',
                is_recurring: false
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="goal-form">
            <h2>Create New Goal</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="title">Goal Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter your goal title"
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your goal"
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label htmlFor="target_date">Target Date</label>
                <input
                    type="date"
                    id="target_date"
                    name="target_date"
                    value={formData.target_date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group checkbox">
                <label>
                    <input
                        type="checkbox"
                        name="is_recurring"
                        checked={formData.is_recurring}
                        onChange={handleChange}
                    />
                    Recurring Goal
                </label>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Goal'}
            </button>
        </form>
    );
}
