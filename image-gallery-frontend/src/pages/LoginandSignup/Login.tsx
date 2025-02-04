import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formdata, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const apiUrl = 'http://localhost:5000/api/v1/user/login';
        
        try {
            const response = await axios.post(apiUrl, formdata);
            console.log(response.data);
    
            // Store token and user data in sessionStorage
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('username', response.data.user.username);
            sessionStorage.setItem('userId', response.data.user._id); // Store user ID if needed
    
            console.log(sessionStorage.getItem('username'));
            navigate('/home'); // Redirect to the home page
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username or Email</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="username"
                    value={formdata.username}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    value={formdata.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="/signup">Signup</a></p>
            </form>
        </div>
    );
};

export default Login;