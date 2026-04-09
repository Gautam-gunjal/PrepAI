import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import Loader from "../components/Loader";

const Protected = ({ children }) => {

    const { loading, user } = useAuth()

    if (loading) {
        return (<Loader/>)
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    return children

}

export default Protected