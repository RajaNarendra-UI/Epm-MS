import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './Components/ProtectedRoute'

// Lazy load components
const Login = lazy(() => import('./Components/Login'))
const Dashboard = lazy(() => import('./Components/Dashboard'))
const Home = lazy(() => import('./Components/Home'))
const Employee = lazy(() => import('./Components/Employee'))
const Category = lazy(() => import('./Components/Category'))
const AddCategory = lazy(() => import('./Components/AddCategory'))
const AddEmployee = lazy(() => import('./Components/AddEmployee'))
const EditEmployee = lazy(() => import('./Components/EditEmployee'))
const Start = lazy(() => import('./Components/Start'))
const EmployeeLogin = lazy(() => import('./Components/EmployeeLogin'))
const EmployeeDetail = lazy(() => import('./Components/EmployeeDetail'))
const DataVisualization = lazy(() => import('./Components/DataVisualization'))
const SessionTimeout = lazy(() => import('./Components/SessionTimeout'))

// Loading component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/adminlogin' element={<Login />} />
          <Route path='/employee_login' element={<EmployeeLogin />} />
          <Route path='/employee_detail/:id' element={<EmployeeDetail />} />
          <Route path='/dashboard' 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          >
            <Route path='' element={<Home />} />
            <Route path='/dashboard/employee' element={<ProtectedRoute><Employee /></ProtectedRoute>} />
            <Route path='/dashboard/category' element={<ProtectedRoute><Category /></ProtectedRoute>} />
            <Route path='/dashboard/data_visualization' element={<ProtectedRoute><DataVisualization /></ProtectedRoute>} />
            <Route path='/dashboard/add_category' element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
            <Route path='/dashboard/add_employee' element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
            <Route path='/dashboard/edit_employee/:id' element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
          </Route>
          <Route path='/session-timeout' element={<SessionTimeout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App