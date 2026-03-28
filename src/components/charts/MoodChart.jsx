import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { getLastNDays, getDayKey } from '@/utils/dateHelpers'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function MoodChart({ moods = [], days = 14, height = 120 }) {
  const dayKeys = getLastNDays(days)
  const grouped = {}
  ;(moods || []).forEach((m) => { const k = getDayKey(parseISO(m.createdAt)); grouped[k] = [...(grouped[k] || []), m.score] })

  const labels = dayKeys.map((d) => format(d, 'd MMM', { locale: nl }))
  const data = dayKeys.map((d) => {
    const k = getDayKey(d)
    const scores = grouped[k]
    return scores ? scores.reduce((a, b) => a + b, 0) / scores.length : null
  })

  const chartData = {
    labels,
    datasets: [{
      data,
      borderColor: '#C97D3A',
      backgroundColor: 'rgba(201, 125, 58, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: (ctx) => ctx.raw !== null ? 3 : 0,
      pointBackgroundColor: '#C97D3A',
      pointBorderColor: '#0D0D0D',
      pointBorderWidth: 2,
      spanGaps: true,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#1C1C1C',
      borderColor: 'rgba(245,236,215,0.1)',
      borderWidth: 1,
      titleColor: '#F5ECD7',
      bodyColor: '#A3A3A3',
      callbacks: { label: (ctx) => ` Stemming: ${ctx.raw?.toFixed(1) ?? 'n/a'}` },
    }},
    scales: {
      x: { grid: { color: 'rgba(245,236,215,0.04)' }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 }, maxRotation: 0 } },
      y: { min: -5, max: 5, grid: { color: 'rgba(245,236,215,0.04)' }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 }, stepSize: 2.5 } },
    },
  }

  return <div style={{ height }}><Line data={chartData} options={options} /></div>
}
