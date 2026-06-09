import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar({ theme, toggleTheme }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <nav style={{
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>

            {/* logo */}
            <div
                onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
                <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--accent)',
                    borderRadius: '50%'
                }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px' }}>
                    InterviewForge
                </span>
            </div>

            {/* right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                {/* theme toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                    }}
                >
                    {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
                </button>

                {/* only show these if user is logged in */}
                {user && (
                    <>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                            Hi, {user.name || user.email}
                        </span>

                        <button
                            onClick={handleLogout}
                            className='btn-secondary'
                            style={{ fontSize: '12px', padding: '5px 12px' }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar