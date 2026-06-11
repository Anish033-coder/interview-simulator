import Editor from '@monaco-editor/react'

function CodeEditor({ code, language, onCodeChange, onLanguageChange }) {

    function getMonacoLanguage(lang) {
        const map = {
            python: 'python',
            javascript: 'javascript',
            java: 'java',
            cpp: 'cpp'
        }
        return map[lang] || 'python'
    }

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>

            {/* top bar with language selector */}
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
                padding: '7px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <span style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px'
                }}>
                    solution.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'cpp'}
                </span>

                <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    <option value='python'>Python</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='java'>Java</option>
                    <option value='cpp'>C++</option>
                </select>
            </div>

            {/* monaco editor */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Editor
                    height='100%'
                    language={getMonacoLanguage(language)}
                    value={code}
                    onChange={(val) => onCodeChange(val || '')}
                    theme='vs-dark'
                    options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        renderLineHighlight: 'line',
                        tabSize: 4,
                        automaticLayout: true,
                        padding: { top: 12 }
                    }}
                />
            </div>
        </div>
    )
}

export default CodeEditor