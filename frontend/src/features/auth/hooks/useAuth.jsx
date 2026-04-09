import React, { useContext, useEffect } from 'react'
import { register, login, logout, getme } from '../services/auth.api'
import { AuthContext } from '../auth.context'
import { toast } from 'react-toastify'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading, error, setError } = context

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {

            const data = await register({ username, email, password })
            setUser(data.user)
            toast.success("Registration successful")
            return true

        } catch (err) {

            const message = err.response?.data?.message || "Something went wrong"
            setError(message)
            setTimeout(() => {
                setError(null);
            }, 5000)
            return false

        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            toast.success("Login successful")
            return true
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong"
            setError(message)
            setTimeout(() => {
                setError(null);
            }, 5000)
            return false

        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout();
            setUser(null)
            toast.success("Logged out successfully")
        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false)
        }
    }
    

    useEffect(() => {
        const getandSetUser = async () => {
            try {
                const data = await getme()
                setUser(data.user)
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false)
            }
        }
        getandSetUser()
    }, [])

    return { handleRegister, handleLogin, handleLogout, user, loading, error }


}

