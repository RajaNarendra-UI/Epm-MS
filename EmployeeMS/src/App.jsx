import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Category from './Components/Category'
import AddCategory from './Components/AddCategory'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import Start from './Components/Start'
import EmployeeLogin from './Components/EmployeeLogin'
import EmployeeDetail from './Components/EmployeeDetail'
import DataVisualization from './Components/DataVisualization'
import ProtectedRoute from './Components/ProtectedRoute'
import SessionTimeout from './Components/SessionTimeout'

function App() {

  // if(document.cookie === ''){
  //   window.location.href='/'
  // }
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start />}></Route>
      <Route path='/adminlogin' element={<Login />}></Route>
      <Route path='/employee_login' element={<EmployeeLogin />}></Route>
      <Route path='/employee_detail/:id' element={<EmployeeDetail />}></Route>
      <Route path='/dashboard' 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      >
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/employee' element={<ProtectedRoute><Employee /></ProtectedRoute>}></Route>
        <Route path='/dashboard/category' element={<ProtectedRoute><Category /></ProtectedRoute>}></Route>
        <Route path='/dashboard/data_visualization' element={<ProtectedRoute><DataVisualization /></ProtectedRoute>}></Route>
        <Route path='/dashboard/add_category' element={<ProtectedRoute><AddCategory /></ProtectedRoute>}></Route>
        <Route path='/dashboard/add_employee' element={<ProtectedRoute><AddEmployee /></ProtectedRoute>}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<ProtectedRoute><EditEmployee /></ProtectedRoute>}></Route>
      </Route>
      <Route path='/session-timeout' element={<SessionTimeout />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App