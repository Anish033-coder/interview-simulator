import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Home() {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('all')

    const navigate = useNavigate()

    useEffect(() => {
        api.get('/api/problems')
            .then((res) => {
                setProblems(res.data.problems)
            })
            .catch((err) => {
                setError('failed to load problems')
                console.log(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    function getFiltered() {
        if (filter === 'all') return problems
        return problems.filter((p) => p.difficulty === filter)
    }

    function handleStart(problemId) {
        navigate(`/interview/${problemId}`)
    }

    function getDifficultyStyle(difficulty) {
        if (difficulty === 'easy') {
            return { backgroundColor: '#0d2e1f', color: '#34c97e' }
        }
        if (difficulty === 'medium') {
            return { backgroundColor: '#2e1f0d', color: '#f0a04a' }
        }
        return { backgroundColor: '#2e0d0d', color: '#f06a6a' }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: 'calc(100vh - 57px)',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p style={{ color: 'var(--text-secondary)' }}>loading problems...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{
                minHeight: 'calc(100vh - 57px)',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p style={{ color: 'var(--error)' }}>{error}</p>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: 'calc(100vh - 57px)',
            backgroundColor: 'var(--bg-primary)',
            padding: '28px 24px'
        }}>

            <h1 style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: '500',
                marginBottom: '4px'
            }}>
                Problem Bank
            </h1>
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                marginBottom: '24px'
            }}>
                Pick a problem and start your mock interview
            </p>

            {/* difficulty filter buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['all', 'easy', 'medium', 'hard'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            backgroundColor: filter === f ? 'var(--bg-card)' : 'var(--bg-secondary)',
                            border: filter === f ? '1px solid var(--accent)' : '1px solid var(--border)',
                            color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                            padding: '5px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* problems table */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '10px 16px',
                                textAlign: 'left'
                            }}>
                                #
                            </th>
                            <th style={{
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '10px 16px',
                                textAlign: 'left'
                            }}>
                                Title
                            </th>
                            <th style={{
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '10px 16px',
                                textAlign: 'left'
                            }}>
                                Difficulty
                            </th>
                            <th style={{
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '10px 16px',
                                textAlign: 'left'
                            }}>
                                Topic
                            </th>
                            <th style={{
                                color: 'var(--text-secondary)',
                                fontSize: '12px',
                                fontWeight: '500',
                                padding: '10px 16px',
                                textAlign: 'left'
                            }}>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFiltered().map((problem, index) => (
                            <tr
                                key={problem.id}
                                style={{
                                    borderBottom: '1px solid var(--border)',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={{
                                    padding: '12px 16px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '13px'
                                }}>
                                    {index + 1}
                                </td>
                                <td style={{
                                    padding: '12px 16px',
                                    color: 'var(--text-primary)',
                                    fontSize: '13px'
                                }}>
                                    {problem.title}
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                        ...getDifficultyStyle(problem.difficulty),
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '500'
                                    }}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                        backgroundColor: 'var(--bg-card)',
                                        color: 'var(--text-secondary)',
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        border: '1px solid var(--border)'
                                    }}>
                                        {problem.topic}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <button
                                        onClick={() => handleStart(problem.id)}
                                        style={{
                                            backgroundColor: 'var(--accent)',
                                            color: 'white',
                                            padding: '5px 14px',
                                            borderRadius: '5px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Start
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* show this if no problems match the filter */}
                {getFiltered().length === 0 && (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '13px'
                    }}>
                        no problems found for this filter
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home