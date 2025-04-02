import React, {useState, useMemo, useEffect, useCallback} from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { FixedSizeList as List } from 'react-window';

const AddCategory = () => {
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateCategory = (value) => {
        // Regex to allow only letters and spaces
        const letterPattern = /^[A-Za-z\s]+$/;
        
        if (!value) {
            return 'Category name is required';
        }
        if (!letterPattern.test(value)) {
            return 'Category name should contain only letters';
        }
        return '';
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        setError(validateCategory(value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validateCategory(category);
        
        if (validationError) {
            setError(validationError);
            return;
        }

        axios.post('/auth/add_category', {category})
        .then(result => {
            if(result.data.Status) {
                navigate('/dashboard/category');
            } else {
                alert(result.data.Error);
            }
        })
        .catch(err => console.log(err));
    };

    const sortedCategories = useMemo(() => {
        return [...category].sort((a, b) => a.name.localeCompare(b.name));
    }, [category]);

    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            handleSearchClick(searchTerm);
        }, 300),
        []
    );

    return (
        <div className='d-flex justify-content-center align-items-center h-75'>
            <div className='p-3 rounded w-25 border'>
                <h2>Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="category"><strong>Category:</strong></label>
                        <input 
                            type="text" 
                            name='category' 
                            placeholder='Enter Category'
                            value={category}
                            onChange={handleChange}
                            className={`form-control rounded-0 ${error ? 'is-invalid' : ''}`}
                        />
                        {error && <div className='invalid-feedback'>{error}</div>}
                    </div>
                    <button 
                        className='btn btn-success w-100 rounded-0 mb-2'
                        disabled={!!error}
                    >
                        <b>Add Category</b>
                    </button>
                </form>
            </div>
        </div>
    );
};

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default AddCategory;