import React, { useEffect } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Start = () => {

    const navigate = useNavigate()

    axios.defaults.withCredentials = true;
    useEffect(() => {
      axios.get('/verify')
      .then(result => {
        if(result.data.Status) {
          if(result.data.role === "admin") {
            navigate('/dashboard')
          } else {
            navigate('/employee_detail/'+result.data.id)
          }
        }
      }).catch(err =>console.log(err))
    }, [])

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-50 h-40 border loginForm">
      <h1 className=" text-center text-white">Employee Management System</h1>
        <h2 className="text-center mt-4">Login As</h2>
        <div className="d-flex justify-content-between mt-5 mb-2">
          <button type="button" className="btn btn-primary w-25" onClick={() => {navigate('/employee_login')}}>
            <b>Employee</b>
          </button>
          <button type="button" className="btn btn-success w-25" onClick={() => {navigate('/adminlogin')}}>
            <b>Admin</b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;