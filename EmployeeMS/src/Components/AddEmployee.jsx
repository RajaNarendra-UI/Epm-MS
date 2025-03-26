import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { validateEmployee, validateField } from "./utils/validations";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    salary: "",
    image: null,
    category_id: "1",
  });
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee({...employee, image: file});
      const error = validateField('image', file);
      setErrors(prev => ({
        ...prev,
        image: error
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateEmployee(employee);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('password', employee.password);
    formData.append('address', employee.address);
    formData.append('salary', employee.salary);
    formData.append('category_id', employee.category_id);
    
    if (employee.image) {
      formData.append('image', employee.image);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    axios.post('/auth/add_employee', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(result => {
      if (result.data.Status) {
        localStorage.removeItem('employeeData');
        localStorage.setItem('currentPage', '0');
        localStorage.setItem('hasMore', 'true');
        navigate('/dashboard/employee');
      } else {
        alert(result.data.Error);
      }
    })
    .catch(err => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className={`form-control rounded-0 ${errors.name ? 'is-invalid' : ''}`}
              id="inputName"
              name="name"
              placeholder="Enter Name"
              value={employee.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={`form-control rounded-0 ${errors.email ? 'is-invalid' : ''}`}
              id="inputEmail4"
              name="email"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className={`form-control rounded-0 ${errors.salary ? 'is-invalid' : ''}`}
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
            {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className={`form-control rounded-0 ${errors.address ? 'is-invalid' : ''}`}
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={employee.category_id}
              onChange={(e) => setEmployee({...employee, category_id: e.target.value})}
            >
              {category.map((c) => {
                return <option key={c.id} value={c.id}>{c.name}</option>;
              })}
            </select>
          </div>
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Image
            </label>
            <input
              type="file"
              className={`form-control rounded-0 ${errors.image ? 'is-invalid' : ''}`}
              id="inputGroupFile01"
              name="image"
              onChange={handleFileChange}
            />
            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              <b>Add Employee</b>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;