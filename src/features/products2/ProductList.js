import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts, selectAllProducts, selectTotalInventoryValue } from './productsSlice'
import ProductItem from './ProductItem'

export default function ProductList() {
  const dispatch = useDispatch()
  const products = useSelector(selectAllProducts)
  const totalValue = useSelector(selectTotalInventoryValue)
  const status = useSelector(state => state.products.status)
  const error = useSelector(state => state.products.error)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts()) // replace endpoint or remove if no backend
    }
  }, [status, dispatch])

  if (status === 'loading') return <div>Loading products…</div>
  if (status === 'failed') return <div>Error: {error}</div>

  return (
    <section>
      <h3>Products — Total value: {totalValue.toFixed(2)}</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(p => <ProductItem key={p.id} product={p} />)}
      </ul>
    </section>
  )
}
