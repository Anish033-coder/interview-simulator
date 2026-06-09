import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Report from './pages/Report'
import Navbar from './components/Navbar'

function App() {
    const { user, loading } = useAuth()
    const [theme, setTheme] = useState('dark')

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p style={{ color: 'var(--text-secondary)' }}>loading...</p>
            </div>
        )
    }

    return (
        <div className={theme === 'light' ? 'light' : ''}>
            <BrowserRouter>
                <Navbar theme={theme} toggleTheme={toggleTheme} />
                <Routes>
                    {/* if not logged in redirect to login */}
                    <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
                    <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
                    <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />} />
                    <Route path='/interview/:problemId' element={user ? <Interview /> : <Navigate to='/login' />} />
                    <Route path='/report/:sessionId' element={user ? <Report /> : <Navigate to='/login' />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App