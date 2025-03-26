import axios from '../axios'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { validateEmployee, validateField } from "./utils/validations";

const EditEmployee = () => {
    const {id} = useParams()
    const fileInputRef = useRef(null);
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        salary: "",
        address: "",
        category_id: "",
        image: null,
        existing_image: ""
    });
    const [errors, setErrors] = useState({});
    const [category, setCategory] = useState([])
    const navigate = useNavigate()

    useEffect(()=> {
        axios.get('/auth/category')
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))

        axios.get('/auth/employee/'+id)
        .then(result => {
            setEmployee({
                ...employee,
                name: result.data.Result[0].name,
                email: result.data.Result[0].email,
                address: result.data.Result[0].address,
                salary: result.data.Result[0].salary,
                category_id: result.data.Result[0].category_id,
                existing_image: result.data.Result[0].image
            });

            const dataTransfer = new DataTransfer();
            const file = new File([""], result.data.Result[0].image, {
                type: "image/*"
            });
            dataTransfer.items.add(file);
            
            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
            }
        }).catch(err => console.log(err))
    }, [])

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
            const error = validateField('image', file, employee);
            setErrors(prev => ({
                ...prev,
                image: error
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        const validationErrors = validateEmployee(employee);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        formData.append('name', employee.name);
        formData.append('email', employee.email);
        formData.append('address', employee.address);
        formData.append('salary', employee.salary);
        formData.append('category_id', employee.category_id);
        formData.append('existing_image', employee.existing_image);
        
        if (employee.image) {
            formData.append('image', employee.image);
        }

        axios.put('/auth/edit_employee/'+id, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(result => {
            if(result.data.Status) {
                localStorage.removeItem('employeeData');
                localStorage.setItem('currentPage', '0');
                localStorage.setItem('hasMore', 'true');
                navigate('/dashboard/employee');
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }
    
    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Edit Employee</h3>
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
                        <label htmlFor="inputSalary" className="form-label">
                            Salary
                        </label>
                        <input
                            type="text"
                            className={`form-control rounded-0 ${errors.salary ? 'is-invalid' : ''}`}
                            id="inputSalary"
                            name="salary"
                            placeholder="Enter Salary"
                            autoComplete="off"
                            value={employee.salary}
                            onChange={handleInputChange}
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
                            name="address"
                            placeholder="1234 Main St"
                            autoComplete="off"
                            value={employee.address}
                            onChange={handleInputChange}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>

                    <div className="col-12">
                        <label htmlFor="category" className="form-label">
                            Category
                        </label>
                        <select 
                            name="category_id" 
                            id="category" 
                            className="form-select"
                            value={employee.category_id}
                            onChange={handleInputChange}
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
                        <div className="input-group">
                            <input
                                type="file"
                                className={`form-control rounded-0 ${errors.image ? 'is-invalid' : ''}`}
                                id="inputGroupFile01"
                                name="image"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            {employee.existing_image && (
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => window.open(`http://localhost:3000/Images/${employee.existing_image}`, '_blank')}
                                >
                                    View Current
                                </button>
                            )}
                            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                        </div>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">
                            <b>Edit Employee</b>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditEmployee