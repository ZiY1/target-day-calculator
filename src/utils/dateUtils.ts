import { DateTime } from 'luxon'

/**
 * dayHoursMap: mapping of luxon weekday (1=Mon .. 7=Sun) => hours (number)
 * start and end are DateTime objects with zone 'local' and startOf('day')
 */
export function calculateTotals(start: DateTime, end: DateTime, dayHoursMap: Record<number, number>) {
    // Ensure start and end are local day-starts
    const s = start.startOf('day').setZone('local')
    const e = end.startOf('day').setZone('local')

    let cursor = s
    let totalHours = 0
    let totalDays = 0

    // iterate inclusive from start to end using local date arithmetic
    while (cursor <= e) {
        const wk = cursor.weekday // 1..7
        const hours = dayHoursMap[wk] ?? 0
        if (hours && hours !== 0) {
            totalHours += hours
            totalDays += 1
        }
        // advance by one day — Luxon keeps local semantics across DST
        cursor = cursor.plus({ days: 1 }).startOf('day')
    }

    return { totalDays, totalHours }
}
