import { useEffect, useState, type FormEvent } from 'react'
import type { Brand, Category, Product } from '../types/catalog'

import { apiBaseUrl } from '../api/config'

type ProductManagerProps = {
    brands: Brand[]
    categories: Category[]
}

export function ProductManager({ brands, categories }: ProductManagerProps) {
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

    async function loadProducts() {
        setProductMessage('')

        try {
            const response = await fetch(`${apiBaseUrl}/products`)

            if (!response.ok) {
                throw new Error('Không tải được danh sách sản phẩm.')
            }

            const data = (await response.json()) as Product[]
            setProducts(data)
        } catch (error) {
            setProductMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi.')
        }
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
            setProductMessage('Tên sản phẩm hoặc mã SKU đã tồn tại.')
            return
        }

        if (!response.ok) {
            const errorText = await response.text()
            setProductMessage(errorText || 'Không thể tạo sản phẩm.')
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
        setProductMessage('Đã tạo sản phẩm.')
        await loadProducts()
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (
        <section className="content-grid section-gap">
            <form className="panel" onSubmit={createProduct}>
                <h2>Tạo sản phẩm</h2>

                <label>
                    Tên sản phẩm
                    <input
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        placeholder="Yonex Astrox 88D Pro"
                        required
                    />
                </label>

                <label>
                    Mô tả
                    <textarea
                        value={productDescription}
                        onChange={(event) => setProductDescription(event.target.value)}
                        placeholder="Vợt cầu lông thiên công, nặng đầu"
                    />
                </label>

                <label>
                    Thương hiệu
                    <select
                        value={productBrandId}
                        onChange={(event) => setProductBrandId(event.target.value)}
                        required
                    >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Danh mục
                    <select
                        value={productCategoryId}
                        onChange={(event) => setProductCategoryId(event.target.value)}
                        required
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <div className="form-divider">Biến thể</div>

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
                        Giá bán
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
                        Tồn kho
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
                        Trọng lượng
                        <input
                            value={variantWeight}
                            onChange={(event) => setVariantWeight(event.target.value)}
                            placeholder="4U"
                        />
                    </label>

                    <label>
                        Chu vi cán
                        <input
                            value={variantGripSize}
                            onChange={(event) => setVariantGripSize(event.target.value)}
                            placeholder="G5"
                        />
                    </label>
                </div>

                <label>
                    Màu sắc
                    <input
                        value={variantColor}
                        onChange={(event) => setVariantColor(event.target.value)}
                        placeholder="Camel Gold"
                    />
                </label>

                <button type="submit">Tạo sản phẩm</button>

                {productMessage && <p className="message">{productMessage}</p>}
            </form>

            <section className="panel">
                <h2>Danh sách sản phẩm</h2>

                <div className="product-list">
                    {products.map((product) => (
                        <article className="product-item" key={product.id}>
                            <div>
                                <h3>{product.name}</h3>
                                <p>{product.description || 'Chưa có mô tả'}</p>
                                <p>
                                    {product.brand?.name} · {product.category?.name}
                                </p>
                            </div>

                            <div className="variant-list">
                                {product.variants.map((variant) => (
                                    <span key={variant.id}>
                                        {variant.sku} · {variant.price.toLocaleString('vi-VN')} VND · Tồn kho{' '}
                                        {variant.stockQuantity}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </section>
    )
}
