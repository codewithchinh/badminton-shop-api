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

  useEffect(() => {
    loadBrands()
    loadCategories()
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

    </main>
  )
}

export default App