import { FormEvent, useEffect, useState } from 'react'
import './App.css'

const apiBaseUrl = 'http://localhost:5120/api'

type Brand = {
  id: number
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

type Category = {
  id: number
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

type ProductVariant = {
  id: number
  sku: string
  price: number
  stockQuantity: number
  weight: string | null
  gripSize: string | null
  shoeSize: string | null
  color: string | null
  isActive: boolean
  createdAt: string
}

type Product = {
  id: number
  name: string
  description: string | null
  brandId: number
  brand: Brand
  categoryId: number
  category: Category
  isActive: boolean
  createdAt: string
  variants: ProductVariant[]
}

function App() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryMessage, setCategoryMessage] = useState('')

  const [products, setProducts] = useState<Product[]>([])
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productBrandId, setProductBrandId] = useState('')
  const [productCategoryId, setProductCategoryId] = useState('')
  const [variantSku, setVariantSku] = useState('')
  const [variantPrice, setVariantPrice] = useState('')
  const [variantStock, setVariantStock] = useState('')
  const [variantWeight, setVariantWeight] = useState('')
  const [variantGripSize, setVariantGripSize] = useState('')
  const [variantColor, setVariantColor] = useState('')
  const [productMessage, setProductMessage] = useState('')

  async function loadBrands() {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${apiBaseUrl}/brands`)

      if (!response.ok) {
        throw new Error('Failed to load brands.')
      }

      const data = (await response.json()) as Brand[]
      setBrands(data)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unexpected error.')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadCategories() {
    setCategoryMessage('')

    try {
      const response = await fetch(`${apiBaseUrl}/categories`)

      if (!response.ok) {
        throw new Error('Failed to load categories.')
      }

      const data = (await response.json()) as Category[]
      setCategories(data)
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : 'Unexpected error.')
    }
  }

  async function loadProducts() {
    setProductMessage('')

    try {
      const response = await fetch(`${apiBaseUrl}/products`)

      if (!response.ok) {
        throw new Error('Failed to load products.')
      }

      const data = (await response.json()) as Product[]
      setProducts(data)
    } catch (error) {
      setProductMessage(error instanceof Error ? error.message : 'Unexpected error.')
    }
  }

  async function createBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    const response = await fetch(`${apiBaseUrl}/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
      }),
    })

    if (response.status === 409) {
      setMessage('Brand name already exists.')
      return
    }

    if (!response.ok) {
      setMessage('Could not create brand.')
      return
    }

    setName('')
    setDescription('')
    setMessage('Brand created.')
    await loadBrands()
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCategoryMessage('')

    const response = await fetch(`${apiBaseUrl}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryName,
        description: categoryDescription,
      }),
    })

    if (response.status === 409) {
      setCategoryMessage('Category name already exists.')
      return
    }

    if (!response.ok) {
      setCategoryMessage('Could not create category.')
      return
    }

    setCategoryName('')
    setCategoryDescription('')
    setCategoryMessage('Category created.')
    await loadCategories()
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProductMessage('')

    const response = await fetch(`${apiBaseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: productName,
        description: productDescription,
        brandId: Number(productBrandId),
        categoryId: Number(productCategoryId),
        variants: [
          {
            sku: variantSku,
            price: Number(variantPrice),
            stockQuantity: Number(variantStock),
            weight: variantWeight,
            gripSize: variantGripSize,
            color: variantColor,
          },
        ],
      }),
    })

    if (response.status === 409) {
      setProductMessage('Product name or SKU already exists.')
      return
    }

    if (!response.ok) {
      const errorText = await response.text()
      setProductMessage(errorText || 'Could not create product.')
      return
    }

    setProductName('')
    setProductDescription('')
    setProductBrandId('')
    setProductCategoryId('')
    setVariantSku('')
    setVariantPrice('')
    setVariantStock('')
    setVariantWeight('')
    setVariantGripSize('')
    setVariantColor('')
    setProductMessage('Product created.')
    await loadProducts()
  }

  useEffect(() => {
    loadBrands()
    loadCategories()
    loadProducts()
  }, [])

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Badminton Shop Admin</p>
          <h1>Brands</h1>
        </div>
        <button type="button" onClick={loadBrands}>
          Refresh
        </button>
      </section>

      <section className="content-grid">
        <form className="panel" onSubmit={createBrand}>
          <h2>Create brand</h2>

          <label>
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Yonex"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Japanese badminton equipment brand"
            />
          </label>

          <button type="submit">Create</button>

          {message && <p className="message">{message}</p>}
        </form>

        <section className="panel">
          <h2>Brand list</h2>

          {isLoading ? (
            <p className="muted">Loading...</p>
          ) : (
            <div className="brand-list">
              {brands.map((brand) => (
                <article className="brand-item" key={brand.id}>
                  <div>
                    <h3>{brand.name}</h3>
                    <p>{brand.description || 'No description'}</p>
                  </div>
                  <span>{brand.isActive ? 'Active' : 'Inactive'}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="content-grid section-gap">
        <form className="panel" onSubmit={createCategory}>
          <h2>Create category</h2>

          <label>
            Name
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Rackets"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={categoryDescription}
              onChange={(event) => setCategoryDescription(event.target.value)}
              placeholder="Badminton rackets"
            />
          </label>

          <button type="submit">Create</button>

          {categoryMessage && <p className="message">{categoryMessage}</p>}
        </form>

        <section className="panel">
          <h2>Category list</h2>

          <div className="brand-list">
            {categories.map((category) => (
              <article className="brand-item" key={category.id}>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description || 'No description'}</p>
                </div>
                <span>{category.isActive ? 'Active' : 'Inactive'}</span>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="content-grid section-gap">
        <form className="panel" onSubmit={createProduct}>
          <h2>Create product</h2>

          <label>
            Name
            <input
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="Yonex Astrox 88D Pro"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={productDescription}
              onChange={(event) => setProductDescription(event.target.value)}
              placeholder="Head-heavy attacking badminton racket"
            />
          </label>

          <label>
            Brand
            <select
              value={productBrandId}
              onChange={(event) => setProductBrandId(event.target.value)}
              required
            >
              <option value="">Select brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Category
            <select
              value={productCategoryId}
              onChange={(event) => setProductCategoryId(event.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-divider">Variant</div>

          <label>
            SKU
            <input
              value={variantSku}
              onChange={(event) => setVariantSku(event.target.value)}
              placeholder="AX88DPRO-4UG5"
              required
            />
          </label>

          <div className="form-row">
            <label>
              Price
              <input
                type="number"
                min="0"
                value={variantPrice}
                onChange={(event) => setVariantPrice(event.target.value)}
                placeholder="4290000"
                required
              />
            </label>

            <label>
              Stock
              <input
                type="number"
                min="0"
                value={variantStock}
                onChange={(event) => setVariantStock(event.target.value)}
                placeholder="10"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Weight
              <input
                value={variantWeight}
                onChange={(event) => setVariantWeight(event.target.value)}
                placeholder="4U"
              />
            </label>

            <label>
              Grip size
              <input
                value={variantGripSize}
                onChange={(event) => setVariantGripSize(event.target.value)}
                placeholder="G5"
              />
            </label>
          </div>

          <label>
            Color
            <input
              value={variantColor}
              onChange={(event) => setVariantColor(event.target.value)}
              placeholder="Camel Gold"
            />
          </label>

          <button type="submit">Create product</button>

          {productMessage && <p className="message">{productMessage}</p>}
        </form>

        <section className="panel">
          <h2>Product list</h2>

          <div className="product-list">
            {products.map((product) => (
              <article className="product-item" key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description || 'No description'}</p>
                  <p>
                    {product.brand?.name} · {product.category?.name}
                  </p>
                </div>

                <div className="variant-list">
                  {product.variants.map((variant) => (
                    <span key={variant.id}>
                      {variant.sku} · {variant.price.toLocaleString('vi-VN')} VND · Stock{' '}
                      {variant.stockQuantity}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

    </main>
  )
}

export default App