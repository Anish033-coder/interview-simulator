function OutputPanel({ output }) {
    return (
        <div style={{
            height: '160px',
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
                    Output
                </span>

                {/* show status badge if we have output */}
                {output && (
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
            </div>

            {/* output content */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px 14px',
                fontFamily: 'monospace',
                fontSize: '12px'
            }}>

                {/* no output yet */}
                {!output && (
                    <p style={{ color: 'var(--text-secondary)' }}>
                        click run code to see output here
                    </p>
                )}

                {/* stdout - normal output */}
                {output && output.stdout && (
                    <p style={{
                        color: '#34c97e',
                        whiteSpace: 'pre-wrap',
                        margin: 0
                    }}>
                        {output.stdout}
                    </p>
                )}

                {/* compile error */}
                {output && output.compile_output && (
                    <p style={{
                        color: '#f06a6a',
                        whiteSpace: 'pre-wrap',
                        margin: 0
                    }}>
                        Compile Error:{'\n'}{output.compile_output}
                    </p>
                )}

                {/* runtime error */}
                {output && output.stderr && (
                    <p style={{
                        color: '#f06a6a',
                        whiteSpace: 'pre-wrap',
                        margin: 0
                    }}>
                        {output.stderr}
                    </p>
                )}

                {/* accepted with no output */}
                {output && !output.stdout && !output.stderr && !output.compile_output && (
                    <p style={{ color: 'var(--text-secondary)' }}>
                        no output
                    </p>
                )}
            </div>
        </div>
    )
}

export default OutputPanel