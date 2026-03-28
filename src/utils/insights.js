import { parseISO, differenceInDays, startOfDay } from 'date-fns'
import { getDayKey, getLastNDays } from './dateHelpers'

// Rule-based insight engine
export function generateInsights(store) {
  const insights = []
  const { moods, healthSleep, healthSport, journal, checkins } = store

  const last14 = getLastNDays(14)
  const cutoff = startOfDay(last14[0])

  const recentMoods = moods.filter((m) => parseISO(m.createdAt) >= cutoff)
  const recentSleep = healthSleep.filter((s) => parseISO(s.createdAt) >= cutoff)
  const recentSport = healthSport.filter((s) => parseISO(s.createdAt) >= cutoff)

  // Sleep vs mood correlation
  if (recentSleep.length >= 3 && recentMoods.length >= 3) {
    const avgSleep = recentSleep.reduce((a, s) => a + s.hours, 0) / recentSleep.length
    const avgMood = recentMoods.reduce((a, m) => a + m.score, 0) / recentMoods.length
    if (avgSleep < 6 && avgMood < 0) {
      insights.push({
        id: 'sleep-mood',
        type: 'warning',
        icon: 'moon',
        title: 'Slaap & stemming',
        body: 'Je stemming daalt op dagen met minder slaap. Probeer meer dan 6 uur te slapen.',
      })
    } else if (avgSleep >= 7 && avgMood > 1) {
      insights.push({
        id: 'sleep-mood-positive',
        type: 'success',
        icon: 'moon',
        title: 'Goede slaap werkt',
        body: `Je slaapt gemiddeld ${avgSleep.toFixed(1)}u en je stemming is positief. Zo door!`,
      })
    }
  }

  // Exercise vs mood
  if (recentSport.length > 0 && recentMoods.length > 0) {
    const sportDays = new Set(recentSport.map((s) => getDayKey(parseISO(s.createdAt))))
    const moodsOnSportDays = recentMoods.filter((m) => sportDays.has(getDayKey(parseISO(m.createdAt))))
    if (moodsOnSportDays.length > 0) {
      const avgMoodSport = moodsOnSportDays.reduce((a, m) => a + m.score, 0) / moodsOnSportDays.length
      if (avgMoodSport > 0.5) {
        insights.push({
          id: 'exercise-mood',
          type: 'success',
          icon: 'activity',
          title: 'Beweging werkt',
          body: 'Beweging heeft een positief effect op je stemming. Je voelt je beter op sportdagen!',
        })
      }
    }
  }

  // Journal streak
  if (journal.length >= 3) {
    const days = [...new Set(journal.map((j) => getDayKey(parseISO(j.createdAt))))].sort().reverse()
    let streak = 0
    let current = getDayKey(new Date())
    for (const day of days) {
      const diff = differenceInDays(parseISO(current + 'T00:00:00'), parseISO(day + 'T00:00:00'))
      if (diff <= 1) { streak++; current = day } else break
    }
    if (streak >= 3) {
      insights.push({
        id: 'journal-streak',
        type: 'info',
        icon: 'flame',
        title: `${streak} dagen streak!`,
        body: `Je schrijft al ${streak} dagen achter elkaar in je dagboek. Geweldig!`,
      })
    }
  }

  // Most frequent emotion
  if (recentMoods.length >= 5) {
    const tagCount = {}
    recentMoods.forEach((m) => m.emotionTags?.forEach((t) => { tagCount[t] = (tagCount[t] || 0) + 1 }))
    const topTag = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]
    if (topTag && topTag[1] >= 3) {
      insights.push({
        id: 'top-emotion',
        type: 'info',
        icon: 'heart',
        title: 'Meest voorkomende emotie',
        body: `"${topTag[0]}" verschijnt het vaakst in je stemmingslogs de afgelopen 2 weken.`,
      })
    }
  }

  // No checkins recently
  if (checkins.length === 0 || differenceInDays(new Date(), parseISO(checkins[0]?.createdAt)) > 2) {
    insights.push({
      id: 'no-checkin',
      type: 'warning',
      icon: 'sun',
      title: 'Mis je check-in?',
      body: 'Je hebt al even geen dagelijkse check-in gedaan. Even 30 seconden nemen?',
    })
  }

  return insights.slice(0, 4)
}

export function getCorrelationData(moods, sleepEntries, sportEntries, days = 14) {
  const dayKeys = getLastNDays(days).map(getDayKey)
  return dayKeys.map((day) => {
    const dayMoods = moods.filter((m) => getDayKey(parseISO(m.createdAt)) === day)
    const daySleep = sleepEntries.filter((s) => getDayKey(parseISO(s.createdAt)) === day)
    const daySport = sportEntries.filter((s) => getDayKey(parseISO(s.createdAt)) === day)
    return {
      day,
      mood: dayMoods.length ? dayMoods.reduce((a, m) => a + m.score, 0) / dayMoods.length : null,
      sleep: daySleep.length ? daySleep[0].hours : null,
      exercise: daySport.length ? 1 : 0,
    }
  })
}
