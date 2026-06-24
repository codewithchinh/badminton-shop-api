import { useEffect, useState } from 'react'
import { BrandManager, type Brand } from './components/BrandManager'
import { CategoryManager, type Category } from './components/CategoryManager'
import { ProductManager } from './components/ProductManager'
import './App.css'
import { apiBaseUrl } from './api/config'

function App() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  async function loadBrands() {
    const response = await fetch(`${apiBaseUrl}/brands`)

    if (!response.ok) {
      return
    }

    const data = (await response.json()) as Brand[]
    setBrands(data)
  }

  async function loadCategories() {
    const response = await fetch(`${apiBaseUrl}/categories`)

    if (!response.ok) {
      return
    }

    const data = (await response.json()) as Category[]
    setCategories(data)
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
