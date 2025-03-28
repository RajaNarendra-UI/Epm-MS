import React, { useEffect, useState } from 'react'
import axios from '../axios'
import { Link } from 'react-router-dom'

const Category = () => {

    const [category, setCategory] = useState([])

    useEffect(()=> {
        axios.get('/auth/category')
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [])
  return (
    <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'>
            <h3>Category List</h3>
        </div>
        <Link to="/dashboard/add_category" className='btn btn-success'><b>Add Category</b></Link>
        <div className='mt-3'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        category.map(c => (
                            <tr>
                                <td><b><i>{c.name}</i></b></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Category