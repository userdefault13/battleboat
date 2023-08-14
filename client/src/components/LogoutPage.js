import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/')
    }

    useEffect(() => {
        logout()
    }, [navigate]);

    return (
        <div>
            <h2>Logging Out...</h2>
            {/* You can show a loading spinner or a message here */}
        </div>
    );
};

export default Logout;
