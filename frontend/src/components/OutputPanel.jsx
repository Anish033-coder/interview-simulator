// output panel component
// shows two different things depending on what happened last:
// 1. output from "Run Code" - just stdout/stderr from one run
// 2. output from "Submit" - pass/fail for every test case

function OutputPanel({ output, submitResult }) {
    return (
        <div style={{
            height: '200px',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
        }}>

            {/* header */}
            <div style={{
                padding: '7px 14px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <span style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px'
                }}>
                    {submitResult ? 'Test Results' : 'Output'}
                </span>

                {/* run code status badge */}
                {output && !submitResult && (
                    <span style={{
                        backgroundColor: output.stderr || output.compile_output
                            ? '#2e0d0d'
                            : '#0d2e1f',
                        color: output.stderr || output.compile_output
                            ? '#f06a6a'
                            : '#34c97e',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                    }}>
                        {output.status}
                    </span>
                )}

                {/* submit pass count badge */}
                {submitResult && (
                    <span style={{
                        backgroundColor: submitResult.passed === submitResult.total
                            ? '#0d2e1f'
                            : '#2e1f0d',
                        color: submitResult.passed === submitResult.total
                            ? '#34c97e'
                            : '#f0a04a',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                    }}>
                        {submitResult.passed}/{submitResult.total} passed
                    </span>
                )}
            </div>

            {/* content area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px 14px'
            }}>

                {/* nothing run yet */}
                {!output && !submitResult && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                        click run code to test with custom input, or submit to check against all test cases
                    </p>
                )}

                {/* --- RUN CODE VIEW --- */}
                {output && !submitResult && (
                    <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                        {output.stdout && (
                            <p style={{ color: '#34c97e', whiteSpace: 'pre-wrap', margin: 0 }}>
                                {output.stdout}
                            </p>
                        )}
                        {output.compile_output && (
                            <p style={{ color: '#f06a6a', whiteSpace: 'pre-wrap', margin: 0 }}>
                                Compile Error:{'\n'}{output.compile_output}
                            </p>
                        )}
                        {output.stderr && (
                            <p style={{ color: '#f06a6a', whiteSpace: 'pre-wrap', margin: 0 }}>
                                {output.stderr}
                            </p>
                        )}
                        {!output.stdout && !output.stderr && !output.compile_output && (
                            <p style={{ color: 'var(--text-secondary)' }}>no output</p>
                        )}
                    </div>
                )}

                {/* --- SUBMIT VIEW - one row per test case --- */}
                {submitResult && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {submitResult.results.map((test) => (
                            <div
                                key={test.testCaseNumber}
                                style={{
                                    backgroundColor: 'var(--bg-card)',
                                    border: `1px solid ${test.passed ? '#34c97e33' : '#f06a6a33'}`,
                                    borderRadius: '6px',
                                    padding: '8px 10px'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: test.passed ? '0' : '4px'
                                }}>
                                    <span style={{
                                        color: 'var(--text-primary)',
                                        fontSize: '12px',
                                        fontWeight: '500'
                                    }}>
                                        Test Case {test.testCaseNumber}
                                    </span>
                                    <span style={{
                                        color: test.passed ? '#34c97e' : '#f06a6a',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                    }}>
                                        {test.passed ? '✓ Passed' : '✗ Failed'}
                                    </span>
                                </div>

                                {/* only show details when a test fails, keeps passed ones clean */}
                                {!test.passed && (
                                    <div style={{
                                        fontFamily: 'monospace',
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        marginTop: '4px'
                                    }}>
                                        <div>Expected: <span style={{ color: '#34c97e' }}>{test.expectedOutput}</span></div>
                                        <div>Got: <span style={{ color: '#f06a6a' }}>{test.actualOutput || '(empty)'}</span></div>
                                        {test.stderr && (
                                            <div style={{ marginTop: '2px' }}>Error: {test.stderr}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OutputPanel