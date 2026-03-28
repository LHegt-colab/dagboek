import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { getLastNDays, getDayKey } from '@/utils/dateHelpers'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

export default function EnergyChart({ checkins, days = 14, height = 120 }) {
  const dayKeys = getLastNDays(days)
  const grouped = {}
  checkins.forEach((c) => {
    if (c.energyLevel) {
      const k = getDayKey(parseISO(c.createdAt))
      grouped[k] = [...(grouped[k] || []), c.energyLevel]
    }
  })

  const labels = dayKeys.map((d) => format(d, 'd MMM', { locale: nl }))
  const data = dayKeys.map((d) => {
    const arr = grouped[getDayKey(d)]
    return arr ? arr.reduce((a, b) => a + b, 0) / arr.length : null
  })

  const chartData = {
    labels,
    datasets: [{
      data,
      borderColor: '#60A5FA',
      backgroundColor: 'rgba(96, 165, 250, 0.08)',
      fill: false,
      tension: 0.4,
      pointRadius: (ctx) => ctx.raw !== null ? 3 : 0,
      pointBackgroundColor: '#60A5FA',
      pointBorderColor: '#0D0D0D',
      pointBorderWidth: 2,
      spanGaps: true,
    }],
  }

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#1C1C1C', borderColor: 'rgba(245,236,215,0.1)', borderWidth: 1,
      titleColor: '#F5ECD7', bodyColor: '#A3A3A3',
      callbacks: { label: (ctx) => ` Energie: ${ctx.raw?.toFixed(1) ?? 'n/a'}/10` },
    }},
    scales: {
      x: { grid: { color: 'rgba(245,236,215,0.04)' }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 }, maxRotation: 0 } },
      y: { min: 0, max: 10, grid: { color: 'rgba(245,236,215,0.04)' }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 }, stepSize: 5 } },
    },
  }
  return <div style={{ height }}><Line data={chartData} options={options} /></div>
}
