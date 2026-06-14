import { useEffect, useRef } from 'react'

function AIPanel({ messages, onAskAI, loading }) {

    const bottomRef = useRef(null)

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>

            {/* header */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '9px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <span style={{
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: '500'
                }}>
                    AI Interviewer
                </span>
                <span style={{
                    backgroundColor: '#5b6af022',
                    border: '1px solid #5b6af055',
                    color: '#5b6af0',
                    fontSize: '10px',
                    padding: '2px 7px',
                    borderRadius: '4px'
                }}>
                    Claude
                </span>
            </div>

            {/* messages area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>

                {/* show this when no messages yet */}
                {messages.length === 0 && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '30px 16px'
                    }}>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            lineHeight: '1.6'
                        }}>
                            Click "Ask Interviewer" when you're ready for a question about your code.
                        </p>
                    </div>
                )}

                {/* render each ai message */}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '10px 12px'
                        }}
                    >
                        <p style={{
                            color: 'var(--accent)',
                            fontSize: '10px',
                            fontWeight: '500',
                            marginBottom: '5px',
                            letterSpacing: '0.5px'
                        }}>
                            INTERVIEWER · {msg.time}
                        </p>
                        <p style={{
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            lineHeight: '1.6',
                            margin: 0
                        }}>
                            {msg.text}
                        </p>
                    </div>
                ))}

                {/* loading state while waiting for claude */}
                {loading && (
                    <div style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '10px 12px'
                    }}>
                        <p style={{
                            color: 'var(--accent)',
                            fontSize: '10px',
                            fontWeight: '500',
                            marginBottom: '5px'
                        }}>
                            INTERVIEWER
                        </p>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            margin: 0
                        }}>
                            thinking...
                        </p>
                    </div>
                )}

                {/* invisible div at bottom for auto scroll */}
                <div ref={bottomRef} />
            </div>

            {/* ask interviewer button at bottom */}
            <div style={{
                padding: '12px',
                borderTop: '1px solid var(--border)',
                flexShrink: 0
            }}>
                <button
                    onClick={onAskAI}
                    disabled={loading}
                    style={{
                        width: '100%',
                        backgroundColor: loading ? 'var(--bg-card)' : 'var(--accent)',
                        color: loading ? 'var(--text-secondary)' : 'white',
                        padding: '9px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {loading ? 'asking...' : 'Ask Interviewer'}
                </button>
            </div>
        </div>
    )
}

export default AIPanel