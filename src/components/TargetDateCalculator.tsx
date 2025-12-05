import React, { useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { calculateTotals } from '../utils/dateUtils'

type DayKey = 'monday'|'tuesday'|'wednesday'|'thursday'|'friday'|'saturday'|'sunday'

const defaultHours: Record<DayKey, string> = {
    monday: '0',
    tuesday: '0',
    wednesday: '0',
    thursday: '0',
    friday: '0',
    saturday: '0',
    sunday: '0',
}

const weekdayLabels: Array<{ key: DayKey; label: string }> = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
]

export default function TargetDateCalculator() {
    const todayISO = DateTime.local().toISODate() // yyyy-MM-dd (local)
    const defaultEnd = DateTime.local().plus({ days: 7 }).toISODate()

    const [startDate, setStartDate] = useState<string>(todayISO)
    const [endDate, setEndDate] = useState<string>(defaultEnd)
    const [selected, setSelected] = useState<Record<DayKey, boolean>>({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    })
    const [hours, setHours] = useState<Record<DayKey, string>>(defaultHours)
    const [result, setResult] = useState<{ totalDays: number; totalHours: number } | null>(null)
    const [error, setError] = useState<string | null>(null)

    function onToggle(day: DayKey) {
        setSelected(prev => ({ ...prev, [day]: !prev[day] }))
    }

    function onHoursChange(day: DayKey, value: string) {
        // allow numeric with decimals and empty
        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
            setHours(prev => ({ ...prev, [day]: value }))
        }
    }

    function onCalculate(e?: React.FormEvent) {
        e?.preventDefault()
        setError(null)
        setResult(null)

        // parse and validate dates
        const start = DateTime.fromISO(startDate, { zone: 'local' }).startOf('day')
        const end = DateTime.fromISO(endDate, { zone: 'local' }).startOf('day')

        if (!start.isValid || !end.isValid) {
            setError('Invalid start or end date.')
            return
        }
        if (end < start) {
            setError('End date must be same or after start date.')
            return
        }

        // build mapping of weekday numbers to hours
        // Luxon weekday: 1 = Monday ... 7 = Sunday
        const dayHoursMap: Record<number, number> = {}
        weekdayLabels.forEach(({ key }, idx) => {
            const wk = idx + 1 // 1..7
            if (selected[key]) {
                const val = hours[key].trim() === '' ? '0' : hours[key]
                const parsed = parseFloat(val)
                dayHoursMap[wk] = isFinite(parsed) ? parsed : 0
            }
        })

        const { totalDays, totalHours } = calculateTotals(start, end, dayHoursMap)
        setResult({ totalDays, totalHours })
    }

    // memoize display strings for result
    const summary = useMemo(() => {
        if (!result) return null
        return `Number of target days: ${result.totalDays}, Total hours: ${Number(result.totalHours.toFixed(2))}`
    }, [result])

    return (
        <form onSubmit={onCalculate}>
            <div style={{ marginBottom: 12 }}>
                <label>
                    <div>Start Date:</div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        aria-label="Start date"
                    />
                </label>
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>
                    <div>End Date:</div>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        aria-label="End date"
                    />
                </label>
            </div>

            <fieldset style={{ padding: 12, border: '1px solid #ccc', marginBottom: 12 }}>
                <legend>Select Target Days</legend>
                {weekdayLabels.map(({ key, label }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input
                                type="checkbox"
                                checked={selected[key]}
                                onChange={() => onToggle(key)}
                                aria-label={`Select ${label}`}
                            />
                            <span style={{ minWidth: 80 }}>{label}</span>
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Enter hours"
                            value={hours[key]}
                            onChange={e => onHoursChange(key, e.target.value)}
                            disabled={!selected[key]}
                            aria-label={`${label} hours`}
                            style={{ width: 100 }}
                        />
                    </div>
                ))}
            </fieldset>

            <div style={{ marginBottom: 12 }}>
                <button type="submit">Calculate</button>
            </div>

            {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}

            {result && (
                <div style={{ fontWeight: 600 }}>
                    {summary}
                </div>
            )}
        </form>
    )
}
