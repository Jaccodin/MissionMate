import React from 'react';
import GoalList from '../Goals/GoalList';
import GoalForm from '../Goals/GoalForm';
import { useAuth } from '../Auth/AuthProvider';

export default function Dashboard() {
    const { user, signOut } = useAuth();

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>MissionMate Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user.email}</span>
                    <button onClick={signOut} className="logout-button">
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="goals-section">
                    <GoalList />
                </div>
                
                <div className="form-section">
                    <GoalForm />
                </div>
            </div>
        </div>
    );
}
