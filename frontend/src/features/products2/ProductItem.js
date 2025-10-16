import React from 'react'
import { useDispatch } from 'react-redux'
import { stockIncremented, stockDecremented, productRemoved, testAction } from './productsSlice'

export default function ProductItem({ product }) {
  const dispatch = useDispatch()
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid #eee' }}>
      <div>
        <div><strong>{product.title}</strong></div>
        <div>Price: {product.price}  •  Qty: {product.quantity}</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => dispatch(stockIncremented({ id: product.id }))}>+1</button>
        <button onClick={() => dispatch(stockDecremented({ id: product.id }))}>-1</button>
        <button onClick={() => dispatch(productRemoved(product.id))}>Delete</button>
        <button onClick={() => dispatch(testAction(product.id))}>testAction</button>
      </div>
    </li>
  )
}
