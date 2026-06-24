import type { Brand } from '../types/catalog'
import { useEffect, useState, type FormEvent } from 'react'

import { apiBaseUrl } from '../api/config'

type BrandManagerProps = {
    onBrandsChanged?: () => void
}

export function BrandManager({ onBrandsChanged }: BrandManagerProps) {
    const [brands, setBrands] = useState<Brand[]>([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function loadBrands() {
        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch(`${apiBaseUrl}/brands`)

            if (!response.ok) {
                throw new Error('Không tải được danh sách thương hiệu.')
            }

            const data = (await response.json()) as Brand[]
            setBrands(data)
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi.')
        } finally {
            setIsLoading(false)
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
            setMessage('Tên thương hiệu đã tồn tại.')
            return
        }

        if (!response.ok) {
            setMessage('Không thể tạo thương hiệu.')
            return
        }

        setName('')
        setDescription('')
        setMessage('Đã tạo thương hiệu.')
        await loadBrands()
        onBrandsChanged?.()
    }

    useEffect(() => {
        loadBrands()
    }, [])

    return (
        <section className="content-grid">
            <form className="panel" onSubmit={createBrand}>
                <h2>Tạo thương hiệu</h2>

                <label>
                    Tên thương hiệu
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Yonex"
                        required
                    />
                </label>

                <label>
                    Mô tả
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Thương hiệu dụng cụ cầu lông Nhật Bản"
                    />
                </label>

                <button type="submit">Tạo mới</button>

                {message && <p className="message">{message}</p>}
            </form>

            <section className="panel">
                <h2>Danh sách thương hiệu</h2>

                {isLoading ? (
                    <p className="muted">Đang tải...</p>
                ) : (
                    <div className="brand-list">
                        {brands.map((brand) => (
                            <article className="brand-item" key={brand.id}>
                                <div>
                                    <h3>{brand.name}</h3>
                                    <p>{brand.description || 'Chưa có mô tả'}</p>
                                </div>
                                <span>{brand.isActive ? 'Đang bán' : 'Tạm ẩn'}</span>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </section>
    )
}
