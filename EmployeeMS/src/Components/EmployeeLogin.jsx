import React, { useState } from 'react'
import './style.css'
import axios from '../axios'
import { useNavigate } from 'react-router-dom'
// import bcrypt from 'bcryptjs'
import { validateField } from './utils/validations'

const EmployeeLogin = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

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

        axios.post('/employee/employee_login', values)
        .then(result => {
            if(result.data.loginStatus) {
                localStorage.setItem('token', result.data.token);
                navigate('/employee_detail/'+result.data.id);
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
        <div className='p-4 rounded w-50 border loginForm'>
            <div className='text-warning'>
                {error && error}
            </div>
            <h2 className='login mb-3'>Employee Login Page</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email:</strong></label>
                    <input 
                        type="email" 
                        name='email' 
                        autoComplete='off' 
                        placeholder='Enter Email'
                        onChange={handleInputChange} 
                        className={`form-control rounded-0 ${errors.email ? 'is-invalid' : ''}`}
                    />
                    {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password:</strong></label>
                    <input 
                        type="password" 
                        name='password' 
                        placeholder='Enter Password'
                        onChange={handleInputChange} 
                        className={`form-control rounded-0 ${errors.password ? 'is-invalid' : ''}`}
                    />
                    {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'><b>Log in</b></button>
            </form>
        </div>
    </div>
  )
}

export default EmployeeLogin