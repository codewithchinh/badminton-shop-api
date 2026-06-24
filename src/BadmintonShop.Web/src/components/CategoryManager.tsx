import { useEffect, useState, type FormEvent } from 'react'
import { createCategory, getCategories } from '../api/catalogApi'
import type { Category } from '../types/catalog'

type CategoryManagerProps = {
  onCategoriesChanged?: () => void
}

export function CategoryManager({ onCategoriesChanged }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryMessage, setCategoryMessage] = useState('')

  async function loadCategories() {
    setCategoryMessage('')

    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi.')
    }
  }

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCategoryMessage('')

    try {
      await createCategory({
        name: categoryName,
        description: categoryDescription,
      })

      setCategoryName('')
      setCategoryDescription('')
      setCategoryMessage('Đã tạo danh mục.')
      await loadCategories()
      onCategoriesChanged?.()
    } catch (error) {
      setCategoryMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi.')
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <section className="content-grid section-gap">
      <form className="panel" onSubmit={handleCreateCategory}>
        <h2>Tạo danh mục</h2>

        <label>
          Tên danh mục
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Vợt cầu lông"
            required
          />
        </label>

        <label>
          Mô tả
          <textarea
            value={categoryDescription}
            onChange={(event) => setCategoryDescription(event.target.value)}
            placeholder="Các dòng vợt cầu lông"
          />
        </label>

        <button type="submit">Tạo mới</button>

        {categoryMessage && <p className="message">{categoryMessage}</p>}
      </form>

      <section className="panel">
        <h2>Danh sách danh mục</h2>

        <div className="brand-list">
          {categories.map((category) => (
            <article className="brand-item" key={category.id}>
              <div>
                <h3>{category.name}</h3>
                <p>{category.description || 'Chưa có mô tả'}</p>
              </div>
              <span>{category.isActive ? 'Đang bán' : 'Tạm ẩn'}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
