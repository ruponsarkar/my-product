import React from 'react'
import LoginCheck from './components/login-data'
import DeliveryAddress from './components/delivery-address'

export default function Order() {
  return (
    <div>
        <div>
            <LoginCheck />

            <DeliveryAddress />
        </div>
    </div>
  )
}
