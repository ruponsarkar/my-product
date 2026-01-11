import React from 'react'
import Summary from './summary'
import StockBarChart from '../analytics/StockBarChart'

export default function Dashboard() {
  return (
    <div>

      <div>
        {/* <StockBarChart /> */}
      </div>
      <div>
        <Summary />
      </div>
    </div>
  )
}
