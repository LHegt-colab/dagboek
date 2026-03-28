import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'
import { getLastNDays, getDayKey } from '@/utils/dateHelpers'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function SleepChart({ sleepData = [], days = 14, height = 120 }) {
  const dayKeys = getLastNDays(days)
  const grouped = {}
  ;(sleepData || []).forEach((s) => { grouped[getDayKey(parseISO(s.createdAt))] = s.hours })

  const labels = dayKeys.map((d) => format(d, 'd MMM', { locale: nl }))
  const data = dayKeys.map((d) => grouped[getDayKey(d)] ?? 0)
  const colors = data.map((h) => h >= 7 ? 'rgba(74, 222, 128, 0.7)' : h >= 6 ? 'rgba(201, 125, 58, 0.7)' : 'rgba(248, 113, 113, 0.7)')

  const chartData = {
    labels,
    datasets: [{ data, backgroundColor: colors, borderRadius: 4, borderSkipped: false }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#1C1C1C', borderColor: 'rgba(245,236,215,0.1)', borderWidth: 1,
      titleColor: '#F5ECD7', bodyColor: '#A3A3A3',
      callbacks: { label: (ctx) => ` ${ctx.raw}u slaap` },
    }},
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 }, maxRotation: 0 } },
      y: { min: 0, max: 12, grid: { color: 'rgba(245,236,215,0.04)' }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 }, stepSize: 3, callback: (v) => v + 'u' } },
    },
  }
  return <div style={{ height }}><Bar data={chartData} options={options} /></div>
}
