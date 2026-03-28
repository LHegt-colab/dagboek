import { format, parseISO, isToday, isYesterday, differenceInDays, startOfDay, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { nl } from 'date-fns/locale'

export const formatDate = (dateStr, fmt = 'd MMM yyyy') =>
  format(parseISO(dateStr), fmt, { locale: nl })

export const formatTime = (dateStr) =>
  format(parseISO(dateStr), 'HH:mm', { locale: nl })

export const formatRelative = (dateStr) => {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Vandaag'
  if (isYesterday(date)) return 'Gisteren'
  const diff = differenceInDays(new Date(), date)
  if (diff < 7) return `${diff} dagen geleden`
  return format(date, 'd MMM yyyy', { locale: nl })
}

export const formatDateLabel = (dateStr) =>
  format(parseISO(dateStr), 'EEE d MMM', { locale: nl })

export const getLastNDays = (n) => {
  const today = startOfDay(new Date())
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i))
}

export const getDayKey = (date) => format(date, 'yyyy-MM-dd')

export const groupByDay = (entries, dateField = 'createdAt') => {
  const groups = {}
  entries.forEach((e) => {
    const key = getDayKey(parseISO(e[dateField]))
    if (!groups[key]) groups[key] = []
    groups[key].push(e)
  })
  return groups
}

export const getStreakDays = (entries, dateField = 'createdAt') => {
  if (!entries.length) return 0
  const days = [...new Set(entries.map((e) => getDayKey(parseISO(e[dateField]))))].sort().reverse()
  let streak = 0
  let current = getDayKey(new Date())
  for (const day of days) {
    if (day === current) {
      streak++
      current = getDayKey(subDays(parseISO(current + 'T00:00:00'), 1))
    } else break
  }
  return streak
}

export const getWeekDays = () => {
  const now = new Date()
  return eachDayOfInterval({ start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) })
}

export const toISO = (date = new Date()) => date.toISOString()

export const nowISO = () => new Date().toISOString()
