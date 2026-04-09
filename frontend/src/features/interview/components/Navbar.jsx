import React from 'react'
import '../styles/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'

export default function Navbar() {

    const navigate = useNavigate()
    const {handleLogout} = useAuth();

    const logout = async ()=>{
        await handleLogout()
        navigate('/login')    
    }

    return (
        <nav className="navbar">
            <Link to='/' className="navbar-logo">
                <span className="navbar-logo-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                    </svg>
                </span>
                <span className="navbar-logo-text">
                    Interview<span className="navbar-logo-accent">AI</span>
                </span>
            </Link>

            <button onClick={logout}  className="navbar-logout" >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
            </button>
        </nav>
    )
}