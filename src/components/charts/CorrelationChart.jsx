import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { format, parseISO } from 'date-fns'
import { nl } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function CorrelationChart({ correlationData, height = 200 }) {
  const labels = correlationData.map((d) => format(parseISO(d.day + 'T00:00:00'), 'd MMM', { locale: nl }))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stemming',
        data: correlationData.map((d) => d.mood),
        borderColor: '#C97D3A',
        backgroundColor: 'rgba(201, 125, 58, 0.1)',
        tension: 0.4, pointRadius: 3, pointBackgroundColor: '#C97D3A',
        yAxisID: 'y', spanGaps: true,
      },
      {
        label: 'Slaap (u)',
        data: correlationData.map((d) => d.sleep ? d.sleep - 5 : null),
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.05)',
        tension: 0.4, pointRadius: 3, pointBackgroundColor: '#60A5FA',
        borderDash: [4, 3],
        yAxisID: 'y', spanGaps: true,
      },
    ],
  }

  const options = {
    responsive: true, maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: true, labels: { color: 'rgba(245,236,215,0.5)', font: { family: 'DM Sans', size: 11 }, boxWidth: 12, boxHeight: 2, usePointStyle: true } },
      tooltip: {
        backgroundColor: '#1C1C1C', borderColor: 'rgba(245,236,215,0.1)', borderWidth: 1,
        titleColor: '#F5ECD7', bodyColor: '#A3A3A3',
      },
    },
    scales: {
      x: { grid: { color: 'rgba(245,236,215,0.04)' }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 }, maxRotation: 0 } },
      y: { grid: { color: 'rgba(245,236,215,0.04)' }, ticks: { color: 'rgba(245,236,215,0.3)', font: { family: 'DM Sans', size: 10 } } },
    },
  }
  return <div style={{ height }}><Line data={chartData} options={options} /></div>
}
