'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FaChartLine, FaChartBar } from 'react-icons/fa'

interface ChartSectionProps {
  transactionHistory: Array<{ day: string; transactions: number; confirmations: number }>
  confirmationRate: Array<{ status: string; count: number }>
}

export default function ChartSection({ transactionHistory, confirmationRate }: ChartSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Transaction History Chart */}
      <div className="bg-rootstock-card p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <FaChartLine className="text-rootstock-orange" />
          <h3 className="text-xl font-bold text-white">Transaction History</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactionHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rootstock-chart-grid)" />
            <XAxis dataKey="day" stroke="var(--rootstock-chart-axis)" />
            <YAxis stroke="var(--rootstock-chart-axis)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--rootstock-gray-dark)',
                border: '1px solid var(--rootstock-gray)',
                color: 'var(--rootstock-text)',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="transactions" stroke="var(--rootstock-orange)" strokeWidth={2} />
            <Line type="monotone" dataKey="confirmations" stroke="var(--rootstock-chart-secondary-line)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Confirmation Rate Chart */}
      <div className="bg-rootstock-card p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <FaChartBar className="text-rootstock-orange" />
          <h3 className="text-xl font-bold text-white">Transaction Status</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={confirmationRate}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rootstock-chart-grid)" />
            <XAxis dataKey="status" stroke="var(--rootstock-chart-axis)" />
            <YAxis stroke="var(--rootstock-chart-axis)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--rootstock-gray-dark)',
                border: '1px solid var(--rootstock-gray)',
                color: 'var(--rootstock-text)',
              }}
            />
            <Bar dataKey="count" fill="var(--rootstock-orange)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


