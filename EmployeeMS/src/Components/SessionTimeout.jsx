import React from 'react';
import { Link } from 'react-router-dom';

const SessionTimeout = () => {
    return (
        <div className="session-timeout text-center">
            <h2>Session Expired</h2>
            <p>Your session has timed out due to inactivity.</p>
            <Link to="/" className="login-link">
                Click here to login again
            </Link>
        </div>
    );
};

export default SessionTimeout; 