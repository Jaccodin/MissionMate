import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState('Verifying your email...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Get the token from the URL
                const token = new URLSearchParams(location.hash.substring(1)).get('access_token');
                
                if (!token) {
                    setError('No verification token found');
                    return;
                }

                const { error } = await supabase.auth.verifyOtp({
                    token_hash: token,
                    type: 'email'
                });

                if (error) throw error;

                setMessage('Email verified successfully! Redirecting...');
                setTimeout(() => navigate('/'), 2000);
            } catch (error) {
                setError(error.message);
            }
        };

        verifyEmail();
    }, [location, navigate]);

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Email Verification</h2>
                
                {error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : (
                    <div className="success-message">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
