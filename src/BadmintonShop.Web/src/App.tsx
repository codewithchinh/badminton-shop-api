import { useEffect, useState } from 'react'
import { BrandManager } from './components/BrandManager'
import { CategoryManager } from './components/CategoryManager'
import type { Brand, Category } from './types/catalog'
import { ProductManager } from './components/ProductManager'
import './App.css'
import { getBrands, getCategories } from './api/catalogApi'

function App() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  async function loadBrands() {
    try {
      const data = await getBrands()
      setBrands(data)
    } catch {
      setBrands([])
    }
  }

  async function loadCategories() {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    loadBrands()
    loadCategories()
  }, [])

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Quản trị cửa hàng cầu lông</p>
          <h1>Quản lý sản phẩm</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            loadBrands()
            loadCategories()
          }}
        >
          Làm mới
        </button>
      </section>

      <BrandManager onBrandsChanged={loadBrands} />

      <CategoryManager onCategoriesChanged={loadCategories} />

      <ProductManager brands={brands} categories={categories} />
    </main>
  )
}

export default App
