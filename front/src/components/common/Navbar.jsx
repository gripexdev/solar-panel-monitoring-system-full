import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import UserService from '../service/UserService';

function Navbar() {
    const { isAuthenticated, isAdmin, refreshAuthState } = useContext(AuthContext);

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            UserService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            refreshAuthState(); // Refresh state after logout
            window.location.reload();
        }
    };

    return (
        <nav>
            <ul>
                {!isAuthenticated && <li><Link to="/">Kalana De Silva</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
                {isAuthenticated && <li><Link to="/monitoring">Monitoring</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
