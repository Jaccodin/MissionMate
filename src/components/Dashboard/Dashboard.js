import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';
import GoalList from '../Goals/GoalList';
import GoalForm from '../Goals/GoalForm';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>MissionMate</h1>
                    <div className="user-menu">
                        <span className="user-email">{user?.email}</span>
                        <button onClick={handleSignOut} className="sign-out">
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="goals-container">
                    <div className="goals-header">
                        <h2>Your Goals</h2>
                        <GoalForm />
                    </div>
                    <GoalList />
                </div>
            </main>
        </div>
    );
}
