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
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <FaChartLine className="text-[#FF6600]" />
          <h3 className="text-xl font-bold text-white">Transaction History</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactionHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="day" stroke="#a0a0a0" />
            <YAxis stroke="#a0a0a0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#ededed',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="transactions" stroke="#FF6600" strokeWidth={2} />
            <Line type="monotone" dataKey="confirmations" stroke="#00aa00" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Confirmation Rate Chart */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <FaChartBar className="text-[#FF6600]" />
          <h3 className="text-xl font-bold text-white">Transaction Status</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={confirmationRate}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="status" stroke="#a0a0a0" />
            <YAxis stroke="#a0a0a0" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                color: '#ededed',
              }}
            />
            <Bar dataKey="count" fill="#FF6600" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


