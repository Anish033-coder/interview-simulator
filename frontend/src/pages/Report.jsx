import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Report() {
    const { sessionId } = useParams()
    const navigate = useNavigate()

    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get(`/api/sessions/report/${sessionId}`)
            .then((res) => {
                setReport(res.data)
            })
            .catch((err) => {
                console.log('fetch report error:', err.message)
                setError('failed to load report')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [sessionId])

    function formatTime(seconds) {
        if (!seconds) return '0m 0s'
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
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
                <p style={{ color: 'var(--text-secondary)' }}>loading report...</p>
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
            padding: '28px 24px',
            maxWidth: '900px',
            margin: '0 auto'
        }}>

            {/* header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{
                        color: 'var(--text-primary)',
                        fontSize: '20px',
                        fontWeight: '500',
                        marginBottom: '4px'
                    }}>
                        Session Report
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {report.problem.title} · {report.problem.difficulty} · {report.problem.topic}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className='btn-secondary'
                    style={{ fontSize: '13px' }}
                >
                    Back to Problems
                </button>
            </div>

            {/* stats row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px'
            }}>

                {/* time taken */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px'
                }}>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        marginBottom: '6px'
                    }}>
                        Time Taken
                    </p>
                    <p style={{
                        color: 'var(--text-primary)',
                        fontSize: '22px',
                        fontWeight: '500'
                    }}>
                        {formatTime(report.session.timeTaken)}
                    </p>
                </div>

                {/* test cases */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px'
                }}>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        marginBottom: '6px'
                    }}>
                        Test Cases
                    </p>
                    <p style={{
                        color: report.session.testCasesPassed > 0 ? '#34c97e' : '#f06a6a',
                        fontSize: '22px',
                        fontWeight: '500'
                    }}>
                        {report.session.testCasesPassed}/{report.session.testCasesTotal}
                    </p>
                </div>

                {/* ai questions asked */}
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px'
                }}>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        marginBottom: '6px'
                    }}>
                        AI Questions Asked
                    </p>
                    <p style={{
                        color: 'var(--text-primary)',
                        fontSize: '22px',
                        fontWeight: '500'
                    }}>
                        {report.aiMessages.length}
                    </p>
                </div>
            </div>

            {/* ai conversation transcript */}
            {report.aiMessages.length > 0 && (
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '24px'
                }}>
                    <p style={{
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '16px'
                    }}>
                        Interviewer Questions
                    </p>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {report.aiMessages.map((msg, i) => (
                            <div
                                key={msg.id}
                                style={{
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    padding: '12px'
                                }}
                            >
                                <p style={{
                                    color: 'var(--accent)',
                                    fontSize: '11px',
                                    marginBottom: '6px'
                                }}>
                                    Question {i + 1}
                                </p>
                                <p style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    margin: 0
                                }}>
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* final code */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '20px'
            }}>
                <p style={{
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '14px'
                }}>
                    Your Final Code
                </p>
                <pre style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '14px',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                }}>
                    {report.session.finalCode || 'no code submitted'}
                </pre>
            </div>
        </div>
    )
}

export default Report