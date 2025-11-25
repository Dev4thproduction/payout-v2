import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'

import Login from './screens/Login';
import UserList from './screens/UserList';
import AddRole from './screens/addRole';
import Customers from './screens/Customers';
import Roles from './screens/Roles';
import SideBar from './components/SideBar';
import Container from './components/Container';
import UserByID from './screens/UserById';
import Dashboard from './screens/Dashboard';
import RoleByID from './screens/RoleById';
import './assests/styles.css';
import './App.css';
import './assests/scripts'
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientsScreen from './screens/Clint';
import Product from './screens/product';
import FixedPrice from './screens/FixPrice';
import Process from './screens/Process';
import Verify from './screens/Verify';
import Fixed from './screens/Fixed';
import Verification from './screens/Verification';
import EmployeeReports from './screens/EmployeeReports';
import CollectionApp from './screens/Collection';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<DefaultContainer />} />
      </Routes>
    </Router>
  );
}

const DefaultContainer = () => {
  return (
    <Container>
      <SideBar />
      <div className='mx-auto py-10 px-6 bg-gray-100 overflow-x-auto w-4/5'>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} exact />
          <Route path="/users" element={<UserList />} exact />
          <Route path="/users/:id" element={<UserByID />} exact />
          <Route path="/customers" element={<Customers />} exact />
          <Route path="/roles" element={<Roles />} exact />
          <Route path='/roles/add' element={<AddRole />} exact />
          <Route path='/roles/update/:id' element={<RoleByID />} />
          <Route path='/Client' element={<ClientsScreen />} />
          <Route path='/product' element={<Product />} />
          <Route path='/Fixed-Price' element={<FixedPrice />} />
          <Route path='/Process' element={<Process />} />
          <Route path='/Verification' element={<Verify />} />
          <Route path='/Fixed' element={<Fixed />} />
          <Route path='/PayoutVerification' element={<Verification/>} />
          <Route path='/Report' element={<EmployeeReports/>} />
          <Route path='/Collection' element={<CollectionApp/>} />
        </Routes>
      </div>
    </Container>
  )
}

export default App;
