import React, { useEffect, useState } from 'react';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if the user is logged in by checking the session or a token
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('/api/check-session');
                const result = await response.json();
                setIsLoggedIn(result.isLoggedIn);
                if (result.isLoggedIn) {
                    setUser(result.user);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        };
        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getProfileImage = () => {
        if (user) {
            return user.profilePicture || user.username.charAt(0).toUpperCase();
        }
        return 'assets/icons/profile-icon.png';
    };

    return (
        <nav>
            <a href="index.html" id="home-link">Home</a>
            <button onClick={() => window.location.href = 'index.html'} id="home-button">Home</button>
            {isLoggedIn ? (
                <>
                    <button onClick={handleLogout} id="logout-button">Logout</button>
                    <a href="profile.html" id="profile-link">
                        <div className="profile-icon">
                            {typeof getProfileImage() === 'string' ? (
                                <img src={getProfileImage()} alt="Profile" />
                            ) : (
                                <div className="profile-initial">{getProfileImage()}</div>
                            )}
                        </div>
                    </a>
                </>
            ) : (
                <a href="login.html" id="login-link">Login</a>
            )}
            <input type="text" id="search-bar" placeholder="Search..." />
        </nav>
    );
}

export default Navbar;