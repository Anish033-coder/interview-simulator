import { useState, useEffect, useRef } from 'react'

function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(duration)
    const timerRef = useRef(null)

    useEffect(() => {
       timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    onTimeUp()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timerRef.current)
    }, [])

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    function getTimerColor() {
        if (timeLeft < 120) return '#f06a6a'
        if (timeLeft < 300) return '#f0a04a'
        return 'var(--text-secondary)'
    }

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '5px 14px',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: '600',
            color: getTimerColor(),
            letterSpacing: '1px'
        }}>
            ⏱ {formatTime(timeLeft)}
        </div>
    )
}

export default Timer