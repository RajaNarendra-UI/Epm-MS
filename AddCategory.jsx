import React, {useState} from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';


const AddCategory = () => {

    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!category || !category.trim()) {
            setError('Category name is required');
            return;
        }
        axios.post('/auth/add_category', {category})
        .then(result => {
            if(result.data.Status) {
                navigate('/dashboard/category')
            }else{
                alert(result.data.Error)
            }
        })
        .catch(err => console.log(err))
    }

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        // Only allow letters and spaces
        if (/^[A-Za-z\s]*$/.test(value)) {
            setCategory(value);
            setError('');
        }
    }

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
        <div className='p-3 rounded w-25 border'>
            <h2>Add Category</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="category"><strong>Category:</strong></label>
                    <input type="text" name='category' placeholder='Enter Category'
                    value={category}
                    onChange={handleCategoryChange}
                    className='form-control rounded-0'/>
                    {error && <div className="text-danger mt-1">{error}</div>}
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'><b>Add Category</b></button>
            </form>
        </div>
    </div>
  )
}

export default AddCategory