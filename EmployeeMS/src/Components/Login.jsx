import React, { useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { validateField } from './utils/validations';

import './style.css';

const Login = () => {

    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({...values, [name]: value});
        
        if (name === 'email') {
            const emailError = validateField('email', value);
            setErrors(prev => ({...prev, email: emailError}));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const emailError = validateField('email', values.email);
        setErrors({
            ...errors,
            email: emailError
        });

        if (emailError) {
            return;
        }

        axios.post('/auth/adminlogin', values)
        .then(result => {
            if (result.data.loginStatus) {
                const token = result.data.token;
                localStorage.setItem('token', token);
                navigate('/dashboard');
            } else {
                setError(result.data.Error);
            }
        })
        .catch(err => {
            console.error(err);
            setError('An error occurred during login');
        });
    }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded w-50 border loginform'>
            <h2 className='login mb-3'>Admin Login Page</h2>
            <div className='text-danger'>
                <b>{error && error}</b>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label htmlFor='email' className='email'><strong>Email:</strong></label>
                    <input 
                        type='email' 
                        name='email' 
                        autoComplete='off' 
                        placeholder='Enter Email' 
                        onChange={handleInputChange}
                        className={`form-control rounded-0 ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                </div>
                <div className='mb-4'>
                    <label htmlFor='password' className='password'><strong>Password:</strong></label>
                    <input 
                        type='password' 
                        name='password' 
                        placeholder='Enter Password' 
                        onChange={handleInputChange}
                        className={`form-control rounded-0 ${errors.password ? 'is-invalid' : ''}`}
                    />
                    {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'><b>Log In</b></button>
            </form>
        </div>
    </div>
  )
}

export default Login;