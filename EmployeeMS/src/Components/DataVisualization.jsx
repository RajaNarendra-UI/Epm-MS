import React, { useEffect, useState, useRef } from 'react';
import axios from '../axios';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine } from '@fortawesome/free-solid-svg-icons';

const DataVisualization = () => {
    const [salaryData, setSalaryData] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('bar');
    
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    
    const destroyCharts = () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
        if (pieChartRef.current) {
            pieChartRef.current.destroy();
            pieChartRef.current = null;
        }
    };

    const toggleContainerStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        gap: '8px',
        zIndex: 1
    };

    const toggleButtonStyle = {
        padding: '8px',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px'
    };

    const activeButtonStyle = {
        ...toggleButtonStyle,
        backgroundColor: '#0d6efd',
        color: 'white',
        borderColor: '#0d6efd'
    };

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        
        Promise.all([
            axios.post('/auth/employee/salary-by-category'),
            axios.post('/auth/employee/employees-by-category')
        ])
        .then(([salaryResponse, employeeResponse]) => {
            if (salaryResponse.data.Status) {
                setSalaryData(salaryResponse.data.Result);
            }
            if (employeeResponse.data.Status) {
                setEmployeeData(employeeResponse.data.Result);
            }
        })
        .catch(err => {
            console.error("Data fetch error:", err);
            setError("Failed to fetch data");
        })
        .finally(() => {
            setLoading(false);
        });

        return () => {
            destroyCharts();
        };
    }, []);

    // Create/Update Charts
    useEffect(() => {
        if (!salaryData || !document.getElementById('salaryChart')) return;
        
        destroyCharts();

        const ctx = document.getElementById('salaryChart');
        chartInstanceRef.current = new Chart(ctx, {
            type: chartType,
            data: {
                labels: salaryData.map(item => item.category_name),
                datasets: [
                    {
                        label: 'Average Salary',
                        data: salaryData.map(item => item.avg_salary),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        tension: 0.4
                    },
                    {
                        label: 'Highest Salary',
                        data: salaryData.map(item => item.max_salary),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Salary'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Categories'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Salary Statistics by Category'
                    }
                }
            }
        });

        // Create Pie Chart
        if (employeeData && document.getElementById('employeeChart')) {
            const pieCtx = document.getElementById('employeeChart');
            pieChartRef.current = new Chart(pieCtx, {
                type: 'pie',
                data: {
                    labels: employeeData.map(item => item.category_name),
                    datasets: [{
                        data: employeeData.map(item => item.employee_count),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 199, 12, 0.5)',
                            'rgba(4, 12, 235, 0.5)',
                            'rgba(55, 96, 86, 0.5)',
                            'rgba(175, 12, 102, 0.5)',
                            'rgba(53, 192, 55, 0.5)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 199, 12, 1)',
                            'rgba(4, 12, 235, 1)',
                            'rgba(55, 96, 86, 1)',
                            'rgba(175, 72, 102, 1)',
                            'rgba(53, 192, 55, 1)',
                        ],
                        borderWidth: 0.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Employee Distribution by Category'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }, [salaryData, employeeData, chartType]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="alert alert-danger" role="alert">
            {error}
        </div>
    );
    
    if (!salaryData?.length || !employeeData?.length) {
        return (
            <div className="alert alert-info" role="alert">
                No data available for visualization
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-center mt-4">
                <h3>Data Visualization</h3>
            </div>
            <div className="visualization-container" style={{ padding: '20px' }}>
                <div style={{ position: 'relative', marginBottom: '30px', height: '400px' }}>
                    <div style={toggleContainerStyle}>
                        <button 
                            onClick={() => setChartType('bar')}
                            style={chartType === 'bar' ? activeButtonStyle : toggleButtonStyle}
                            title="Bar Chart"
                        >
                            <FontAwesomeIcon icon={faChartBar} />
                        </button>
                        <button 
                            onClick={() => setChartType('line')}
                            style={chartType === 'line' ? activeButtonStyle : toggleButtonStyle}
                            title="Line Chart"
                        >
                            <FontAwesomeIcon icon={faChartLine} />
                        </button>
                    </div>
                    <canvas id="salaryChart"></canvas>
                </div>
                <div style={{ height: '400px' }}>
                    <canvas id="employeeChart"></canvas>
                </div>
            </div>
        </div>
    );
};

export default DataVisualization;