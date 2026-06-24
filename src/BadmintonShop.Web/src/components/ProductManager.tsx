import { useEffect, useState, type FormEvent } from 'react'
import { createProduct, getProducts } from '../api/catalogApi'
import type { Brand, Category, Product } from '../types/catalog'

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
    const [variantShoeSize, setVariantShoeSize] = useState('')
    const [variantColor, setVariantColor] = useState('')
    const [productMessage, setProductMessage] = useState('')
    const [filterBrandId, setFilterBrandId] = useState('')
    const [filterCategoryId, setFilterCategoryId] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const filteredProducts = products.filter((product) => {
        const matchesBrand = !filterBrandId || product.brandId === Number(filterBrandId)
        const matchesCategory = !filterCategoryId || product.categoryId === Number(filterCategoryId)
        const normalizedSearchTerm = searchTerm.trim().toLowerCase()
        const matchesSearch =
            !normalizedSearchTerm ||
            product.name.toLowerCase().includes(normalizedSearchTerm) ||
            product.variants.some((variant) => variant.sku.toLowerCase().includes(normalizedSearchTerm))

        return matchesBrand && matchesCategory && matchesSearch
    })

    async function loadProducts() {
        setProductMessage('')

        try {
            const data = await getProducts()
            setProducts(data)
        } catch (error) {
            setProductMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi.')
        }
    }

    async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setProductMessage('')

        try {
            await createProduct({
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
                        shoeSize: variantShoeSize,
                        color: variantColor,
                    },
                ],
            })

            setProductName('')
            setProductDescription('')
            setProductBrandId('')
            setProductCategoryId('')
            setVariantSku('')
            setVariantPrice('')
            setVariantStock('')
            setVariantWeight('')
            setVariantGripSize('')
            setVariantShoeSize('')
            setVariantColor('')
            setProductMessage('Đã tạo sản phẩm.')
            await loadProducts()
        } catch (error) {
            setProductMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi.')
        }
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (
        <section className="content-grid section-gap">
            <form className="panel" onSubmit={handleCreateProduct}>
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

                <label>
                    Size giày
                    <input
                        value={variantShoeSize}
                        onChange={(event) => setVariantShoeSize(event.target.value)}
                        placeholder="42"
                    />
                </label>

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

                <div className="filter-bar">
                    <label>
                        Tìm kiếm
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tên sản phẩm hoặc SKU"
                        />
                    </label>

                    <label>
                        Thương hiệu
                        <select
                            value={filterBrandId}
                            onChange={(event) => setFilterBrandId(event.target.value)}
                        >
                            <option value="">Tất cả thương hiệu</option>
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
                            value={filterCategoryId}
                            onChange={(event) => setFilterCategoryId(event.target.value)}
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="product-list">
                    {filteredProducts.map((product) => (
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
                                        {variant.weight ? ` · ${variant.weight}` : ''}
                                        {variant.gripSize ? `/${variant.gripSize}` : ''}
                                        {variant.shoeSize ? ` · Size ${variant.shoeSize}` : ''}
                                        {variant.color ? ` · ${variant.color}` : ''}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                {filteredProducts.length === 0 && <p className="muted">Không có sản phẩm phù hợp.</p>}
            </section>
        </section>
    )
}
