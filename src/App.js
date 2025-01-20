import React from 'react';
import { AuthProvider } from './components/Auth/AuthProvider';
import Dashboard from './components/Dashboard/Dashboard';
import './styles/main.css';

function App() {
    return (
        <AuthProvider>
            <Dashboard />
        </AuthProvider>
    );
}

export default App;
