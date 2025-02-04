import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const token = sessionStorage.getItem('token'); // Use sessionStorage instead of localStorage

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/user/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data.user);
            } catch (error) {
                console.log(error);
                // Handle error (e.g., redirect to login if token is invalid)
                sessionStorage.removeItem('token');
                window.location.href = '/login';
            }
        };

        if (token) {
            fetchUserData();
        } else {
            // Redirect to login if no token is found
            window.location.href = '/login';
        }
    }, [token]);

    const handleLogout = () => {
        // Clear the token and user data from sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId');
        // Redirect to the login page
        window.location.href = '/login';
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-container">
            <h1>Welcome, {sessionStorage.getItem('username')}!</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => navigate('/gallery')}>Go to Memories</button>
            <button onClick={() => navigate('/upload')}>Upload your Memory</button>
        </div>
    );
};

export default Home;