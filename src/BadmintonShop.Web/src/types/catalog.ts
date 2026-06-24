export type Brand = {
    id: number
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
}

export type Category = {
    id: number
    name: string
    description: string | null
    isActive: boolean
    createdAt: string
}

export type ProductVariant = {
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

export type Product = {
    id: number
    name: string
    description: string | null
    imageUrl: string | null
    brandId: number
    brand: Brand
    categoryId: number
    category: Category
    isActive: boolean
    createdAt: string
    variants: ProductVariant[]
}