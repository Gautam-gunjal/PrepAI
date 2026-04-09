import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Home from './features/interview/pages/Home';
import Protected from './features/auth/components/Protected';
import Interview from './features/interview/pages/interview';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register></Register>} />
        <Route path='/login' element={<Login></Login>} />
        <Route path='/' element={
          <Protected>
            <Home />
          </Protected>
        }></Route>
        <Route path='/interview/:interviewid' element={<Interview></Interview>}></Route>

      </Routes>
    </>
  )
}

export default AppRoutes;