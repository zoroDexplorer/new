import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginandSignup/Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/createUser', formData);
            console.log(response.data);
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('username', response.data.user.username);
            sessionStorage.setItem('userId', response.data.user._id);
            navigate('/home');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="signup-container">
            <h1>Signup</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    className="signup-input"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    className="signup-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    className="signup-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="confirm password"
                    className="signup-input"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="signup-button">Signup</button>
            </form>
        </div>
    );
};

export default Signup;