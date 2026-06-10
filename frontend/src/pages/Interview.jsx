import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Timer from '../components/Timer'
import CodeEditor from '../components/CodeEditor'
import AIPanel from '../components/AIPanel'
import OutputPanel from '../components/OutputPanel'

const starterCode = {
    python: `def solution():
    # write your code here
    pass
`,
    javascript: `function solution() {
    // write your code here
}
`,
    java: `class Solution {
    public void solution() {
        // write your code here
    }
}
`,
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // write your code here
    return 0;
}
`
}

function Interview() {
    const { problemId } = useParams()
    const navigate = useNavigate()

    const [problem, setProblem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sessionId, setSessionId] = useState(null)
    const [language, setLanguage] = useState('python')
    const [code, setCode] = useState(starterCode['python'])
    const [output, setOutput] = useState(null)
    const [runningCode, setRunningCode] = useState(false)
    const [aiMessages, setAiMessages] = useState([])
    const [askingAI, setAskingAI] = useState(false)
    const [sessionEnded, setSessionEnded] = useState(false)

    const startTimeRef = useRef(Date.now())

    useEffect(() => {
        async function init() {
            try {
                const probRes = await api.get(`/api/problems/${problemId}`)
                setProblem(probRes.data.problem)

                const sessionRes = await api.post('/api/sessions/start', {
                    problemId: problemId,
                    language: language
                })
                setSessionId(sessionRes.data.sessionId)

            } catch (err) {
                console.log('failed to load interview:', err.message)
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [problemId])

    function handleLanguageChange(newLang) {
        setLanguage(newLang)
        setCode(starterCode[newLang])
        setOutput(null)
    }

    async function handleRunCode() {
        if (!code.trim()) return
        setRunningCode(true)
        setOutput(null)

        try {
            const res = await api.post('/api/execute', {
                code: code,
                language: language,
                stdin: ''
            })
            setOutput(res.data)
        } catch (err) {
            console.log('run code error:', err.message)
            setOutput({ stderr: 'something went wrong while running your code' })
        } finally {
            setRunningCode(false)
        }
    }

    async function handleAskAI() {
        if (!code.trim() || !problem) return
        setAskingAI(true)

        try {
            const res = await api.post('/api/ai/review', {
                code: code,
                problemTitle: problem.title,
                problemDescription: problem.description
            })

            const newMessage = {
                id: Date.now(),
                text: res.data.question,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }

            setAiMessages((prev) => [...prev, newMessage])

            if (sessionId) {
                await api.post('/api/sessions/message', {
                    sessionId: sessionId,
                    message: res.data.question,
                    codeSnapshot: code
                })
            }

        } catch (err) {
            console.log('ask ai error:', err.message)
        } finally {
            setAskingAI(false)
        }
    }

    async function handleEndSession() {
        if (!sessionId) return

        const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000)

        try {
            await api.post('/api/sessions/end', {
                sessionId: sessionId,
                finalCode: code,
                timeTaken: timeTaken,
                testCasesPassed: output?.status === 'Accepted' ? 1 : 0,
                testCasesTotal: 1
            })

            setSessionEnded(true)
            navigate(`/report/${sessionId}`)

        } catch (err) {
            console.log('end session error:', err.message)
        }
    }

    function handleTimeUp() {
        if (!sessionEnded) {
            handleEndSession()
        }
    }

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p style={{ color: 'var(--text-secondary)' }}>loading interview...</p>
            </div>
        )
    }

    if (!problem) {
        return (
            <div style={{
                height: '100vh',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <p style={{ color: 'var(--error)' }}>problem not found</p>
            </div>
        )
    }

    return (
        <div style={{
            height: '100vh',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>

            {/* top bar */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                {/* left - logo and problem name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{
                            width: '7px',
                            height: '7px',
                            backgroundColor: 'var(--accent)',
                            borderRadius: '50%'
                        }} />
                        <span style={{
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}>
                            InterviewForge
                        </span>
                    </div>
                    <span style={{ color: 'var(--border)' }}>|</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                        {problem.title}
                    </span>
                    <span style={{
                        backgroundColor: problem.difficulty === 'easy' ? '#0d2e1f' : problem.difficulty === 'medium' ? '#2e1f0d' : '#2e0d0d',
                        color: problem.difficulty === 'easy' ? '#34c97e' : problem.difficulty === 'medium' ? '#f0a04a' : '#f06a6a',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                    }}>
                        {problem.difficulty}
                    </span>
                </div>

                {/* middle - timer */}
                <Timer duration={45 * 60} onTimeUp={handleTimeUp} />

                {/* right - run and end buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={handleRunCode}
                        disabled={runningCode}
                        style={{
                            backgroundColor: '#34c97e22',
                            border: '1px solid #34c97e55',
                            color: '#34c97e',
                            padding: '6px 14px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        {runningCode ? 'running...' : '▶ Run Code'}
                    </button>
                    <button
                        onClick={handleEndSession}
                        style={{
                            backgroundColor: '#f06a6a22',
                            border: '1px solid #f06a6a55',
                            color: '#f06a6a',
                            padding: '6px 14px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        End Session
                    </button>
                </div>
            </div>

            {/* main body - three panels */}
            <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden'
            }}>

                {/* left panel - problem statement */}
                <div style={{
                    width: '30%',
                    borderRight: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderBottom: '1px solid var(--border)',
                        padding: '8px 16px'
                    }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Problem</span>
                    </div>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px'
                    }}>
                        <h2 style={{
                            color: 'var(--text-primary)',
                            fontSize: '15px',
                            fontWeight: '500',
                            marginBottom: '12px'
                        }}>
                            {problem.title}
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '13px',
                            lineHeight: '1.7',
                            marginBottom: '20px',
                            whiteSpace: 'pre-line'
                        }}>
                            {problem.description}
                        </p>

                        {/* examples */}
                        <p style={{
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            fontWeight: '500',
                            marginBottom: '10px'
                        }}>
                            Examples
                        </p>
                        {problem.examples.map((ex, i) => (
                            <div key={i} style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '10px 12px',
                                marginBottom: '8px'
                            }}>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '11px',
                                    marginBottom: '6px'
                                }}>
                                    Example {i + 1}
                                </p>
                                <p style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '12px',
                                    fontFamily: 'monospace'
                                }}>
                                    Input: {ex.input}
                                </p>
                                <p style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '12px',
                                    fontFamily: 'monospace'
                                }}>
                                    Output: {ex.output}
                                </p>
                                {ex.explanation && (
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '11px',
                                        marginTop: '4px'
                                    }}>
                                        {ex.explanation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* middle panel - editor + output */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid var(--border)',
                    overflow: 'hidden'
                }}>
                    <CodeEditor
                        code={code}
                        language={language}
                        onCodeChange={setCode}
                        onLanguageChange={handleLanguageChange}
                    />
                    <OutputPanel output={output} />
                </div>

                {/* right panel - ai chat */}
                <div style={{ width: '25%', display: 'flex', flexDirection: 'column' }}>
                    <AIPanel
                        messages={aiMessages}
                        onAskAI={handleAskAI}
                        loading={askingAI}
                    />
                </div>
            </div>
        </div>
    )
}

export default Interview