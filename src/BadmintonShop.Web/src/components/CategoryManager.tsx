import type { Category } from '../types/catalog'
import { useEffect, useState, type FormEvent } from 'react'
import { apiBaseUrl } from '../api/config'

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
            const response = await fetch(`${apiBaseUrl}/categories`)

            if (!response.ok) {
                throw new Error('Không tải được danh sách danh mục.')
            }

            const data = (await response.json()) as Category[]
            setCategories(data)
        } catch (error) {
            setCategoryMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi.')
        }
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
            setCategoryMessage('Tên danh mục đã tồn tại.')
            return
        }

        if (!response.ok) {
            setCategoryMessage('Không thể tạo danh mục.')
            return
        }

        setCategoryName('')
        setCategoryDescription('')
        setCategoryMessage('Đã tạo danh mục.')
        await loadCategories()
        onCategoriesChanged?.()
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return (
        <section className="content-grid section-gap">
            <form className="panel" onSubmit={createCategory}>
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
