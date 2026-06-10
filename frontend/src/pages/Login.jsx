import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await api.post('/api/auth/login', { email, password })
            login(res.data.user)
            navigate('/')
        } catch (err) {
            
            setError(err.response?.data?.message || 'something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: 'calc(100vh - 57px)',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '32px',
                width: '100%',
                maxWidth: '360px'
            }}>
                <h2 style={{
                    color: 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: '500',
                    marginBottom: '4px'
                }}>
                    Welcome back
                </h2>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    marginBottom: '24px'
                }}>
                    Login to continue your practice
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            marginBottom: '6px'
                        }}>
                            Email
                        </label>
                        <input
                            type='email'
                            className='input-field'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='you@example.com'
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            marginBottom: '6px'
                        }}>
                            Password
                        </label>
                        <input
                            type='password'
                            className='input-field'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='••••••••'
                            required
                        />
                    </div>

                    {/* show error if login fails */}
                    {error && (
                        <p style={{
                            color: 'var(--error)',
                            fontSize: '13px',
                            marginBottom: '14px'
                        }}>
                            {error}
                        </p>
                    )}

                    <button
                        type='submit'
                        className='btn-primary'
                        style={{ width: '100%', padding: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'logging in...' : 'Login'}
                    </button>
                </form>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Don't have an account?{' '}
                    <Link to='/register'>Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login