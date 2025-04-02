import React, { useEffect, useState, useRef } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState(() => {
    const saved = localStorage.getItem('employeeData');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('currentPage');
    return saved ? parseInt(saved) : 0;
  });
  const [hasMore, setHasMore] = useState(() => {
    const saved = localStorage.getItem('hasMore');
    return saved ? JSON.parse(saved) : true;
  });
  const [search, setSearch] = useState(() => {
    const saved = localStorage.getItem('searchQuery');
    return saved || "";
  });
  const [tableFilter, setTableFilter] = useState(() => {
    const saved = localStorage.getItem('tableFilter');
    return saved || "";
  });
  const tableRef = useRef(null);
  const initialLoadDone = useRef(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const loadEmployees = () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const delay = currentPage > 0 ? 3000 : 0;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      axios
        .post(`/auth/employee/loading?page=${currentPage}`)
        .then((response) => {
          if (response.data.Result && response.data.Result.length > 0) {
            let newEmployeeData;
            if (!initialLoadDone.current && currentPage === 0) {
              newEmployeeData = response.data.Result;
              initialLoadDone.current = true;
            } else {
              newEmployeeData = [...employee, ...response.data.Result];
            }
            setEmployee(newEmployeeData);
            localStorage.setItem('employeeData', JSON.stringify(newEmployeeData));
            
            const newHasMore = response.data.Result.length === 7;
            setHasMore(newHasMore);
            localStorage.setItem('hasMore', JSON.stringify(newHasMore));
            localStorage.setItem('currentPage', currentPage.toString());
          } else {
            setHasMore(false);
            localStorage.setItem('hasMore', 'false');
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }, delay);
  };

  useEffect(() => {
    if (currentPage === 0 && !initialLoadDone.current) {
      loadEmployees();
    } else if (currentPage > 0) {
      loadEmployees();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentPage]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.2) {
      if (!loading && hasMore) {
        setCurrentPage(prev => prev + 1);
      }
    }
  };

  const handleDelete = (id) => {
    axios.delete('/auth/delete_employee/'+id)
    .then(result => {
        if(result.data.Status) {
            window.location.reload()
        } else {
            alert(result.data.Error)
        }
    })
  } 

  const handleSearchClick = () => {
    if (!loading) {
        setLoading(true);
        
        // Check if search is empty or contains only whitespace
        if (!search || !search.trim()) {
            // Reset all states to initial values
            setEmployee([]);
            setCurrentPage(0);
            initialLoadDone.current = false;
            setHasMore(true);
            
            // Clear localStorage
            localStorage.removeItem('employeeData');
            localStorage.setItem('currentPage', '0');
            localStorage.setItem('hasMore', 'true');
            localStorage.removeItem('searchQuery');
            
            // Load initial data
            loadEmployees();
            return;
        }

        // Proceed with search if there's a search term
        axios.post(`/auth/employee/search?search=${search}`)
            .then((response) => {
                if (response.data.Status) {
                    const searchResults = response.data.Result;
                    setEmployee(searchResults);
                    localStorage.setItem('employeeData', JSON.stringify(searchResults));
                    setHasMore(false);
                    localStorage.setItem('hasMore', 'false');
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Error occurred while searching');
            })
            .finally(() => setLoading(false));
    }
  };

  const getFilteredEmployees = () => {
    if (!tableFilter) return employee;
    return employee.filter(emp => 
        emp.name.toLowerCase().startsWith(tableFilter.toLowerCase())
    );
  };

  const tableStyles = {
    container: {
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    tableScroll: {
      height: '400px',
      overflowY: 'auto',
      borderRadius: '4px',
      position: 'relative'
    },
    table: {
      width: '100%',
      height: '150px',
      borderCollapse: 'collapse',
      background: 'white'
    },
    th: {
      position: 'sticky',
      top: 0,
      background: '#f8f9fa',
      zIndex: 1,
      padding: '8px 12px',
      textAlign: 'left',
      border: '1px solid #dee2e6',
      color: '#495057',
      fontWeight: 700,
      fontSize:'large',
      height: '40px'
    },
    td: {
      padding: '8px 12px',
      border: '1px solid #dee2e6',
      color: '#212529',
      height: '40px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    searchContainer: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    searchBarContainer: {
      display: 'flex',
    },
    searchBarTop: {
      width:'300px',
      padding: '8px 12px',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      fontSize: '14px',
      flex: 1,
      maxWidth: '500px',
      backgroundColor: '#fff',
      color: '#333'
    },
    searchButton: {
      padding: '8px 20px',
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    image:{
      width: "150px",
      height: "60px"
    },
    loadingIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      gap: '10px',
      position: 'sticky',
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.9)'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    filterInput: {
      padding: '4px 8px',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      fontSize: '14px',
      width: '100%',
      marginTop: '4px'
    }
  };

  useEffect(() => {
    localStorage.setItem('searchQuery', search);
  }, [search]);

  useEffect(() => {
    localStorage.setItem('tableFilter', tableFilter);
  }, [tableFilter]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('employeeData');
      localStorage.removeItem('currentPage');
      localStorage.removeItem('hasMore');
      localStorage.removeItem('searchQuery');
      localStorage.removeItem('tableFilter');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div style={tableStyles.container}>
      <div className="d-flex justify-content-center mb-3">
        <h3>Manage Employee's</h3>
      </div>
      
      <div style={tableStyles.searchContainer}>
        <Link to="/dashboard/add_employee" className="btn btn-success AE">
          <b>Add Employee</b>
        </Link>
        
        <div style={tableStyles.searchBarContainer}>
          <input
            type="text"
            placeholder="Search employee's by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchClick();
                }
            }}
            style={tableStyles.searchBarTop}
          />
          <button 
            onClick={handleSearchClick}
            style={tableStyles.searchButton}
            disabled={loading}
          >
            <b>Search</b>
          </button>
        </div>
      </div>

      <div 
        style={tableStyles.tableScroll} 
        onScroll={handleScroll} 
        ref={tableRef}
      >
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={tableStyles.th}>
                Name
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  style={tableStyles.filterInput}
                />
              </th>
              <th style={tableStyles.th}>Image</th>
              <th style={tableStyles.th}>Email</th>
              <th style={tableStyles.th}>Address</th>
              <th style={tableStyles.th}>Salary</th>
              <th style={tableStyles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredEmployees().length > 0 ? (
              getFilteredEmployees().map((e) => (
                <tr key={e.id}>
                  <td style={tableStyles.td}><b><i>{e.name}</i></b></td>
                  <td style={tableStyles.td}>
                    <img
                      src={`http://localhost:3000/Images/` + e.image}
                      className="employee_image"
                      alt={e.name} style={tableStyles.image}
                    />
                  </td>
                  <td style={tableStyles.td}>{e.email}</td>
                  <td style={tableStyles.td}>{e.address}</td>
                  <td style={tableStyles.td}>{e.salary}</td>
                  <td style={tableStyles.td}>
                    <Link
                      to={`/dashboard/edit_employee/` + e.id}
                      className="btn btn-info btn-sm me-2"
                    >
                      <b>Edit</b>
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(e.id)}
                    >
                      <b>Delete</b>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{...tableStyles.td, textAlign: 'center'}}>
                  {tableFilter ? 'No matching records found' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && (
          <div style={tableStyles.loadingIndicator}>
            <div style={tableStyles.spinner}></div>
            Loading more data...
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;