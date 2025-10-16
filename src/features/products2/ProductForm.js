import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { productAddedLocal } from './productsSlice'

export default function ProductForm() {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!title) return
    dispatch(productAddedLocal({
        title,
      price: parseFloat(price) || 0,
      quantity: parseInt(quantity, 10) || 0
    }))
    setTitle(''); setPrice(''); setQuantity('')
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input placeholder="Name" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="number" step="0.01" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <input type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  )
}
