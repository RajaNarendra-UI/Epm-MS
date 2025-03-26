import React, { useEffect, useState } from 'react'
import axios from '../axios'
import { useNavigate, useParams } from 'react-router-dom'


const EmployeeDetail = () => {
    const [employee, setEmployee] = useState([])
    const {id} = useParams()
    const navigate = useNavigate()
    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get('/employee/detail/'+id)
        .then(result => {
            setEmployee(result.data[0])
        })
        .catch(err => console.log(err))
    }, [])
    
    const handleLogout = () => {
        axios.get('/employee/logout')
        .then(result => {
          if(result.data.Status) {
            localStorage.removeItem('token');
            navigate('/');
          }
        }).catch(err => console.log(err))
      }

      const imageStyles = {
        image : {
            width: '200px',
            height: '250px',
        }
      }

  return (
    <div>
        <div className="p-2 d-flex justify-content-center shadow">
            <h1>Emoployee Management System</h1>
        </div>
        
        <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
            <h3>Employee Details</h3>
            <img src={`http://localhost:3000/Images/`+employee.image} className='emp_det_image mt-5' style={imageStyles.image}/>
            <div className='d-flex align-items-center flex-column mt-5'>
                <h3>Name: {employee.name}</h3>
                <h3>Email: {employee.email}</h3>
                <h3>Salary: ${employee.salary}</h3>
            </div>
            <div>
                <button className='btn btn-danger' onClick={handleLogout}><b>Logout</b></button>
            </div>
        </div>
    </div>
  )
}

export default EmployeeDetail