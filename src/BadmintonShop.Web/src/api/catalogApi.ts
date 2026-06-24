import { apiBaseUrl } from './config'
import type { Brand, Category, Product } from '../types/catalog'

export type CreateBrandRequest = {
  name: string
  description: string
}

export type CreateCategoryRequest = {
  name: string
  description: string
}

export type CreateProductRequest = {
  name: string
  description: string
  brandId: number
  categoryId: number
  variants: Array<{
    sku: string
    price: number
    stockQuantity: number
    weight: string
    gripSize: string
    color: string
  }>
}

export async function getBrands() {
  const response = await fetch(`${apiBaseUrl}/brands`)

  if (!response.ok) {
    throw new Error('Không tải được danh sách thương hiệu.')
  }

  return (await response.json()) as Brand[]
}

export async function createBrand(request: CreateBrandRequest) {
  const response = await fetch(`${apiBaseUrl}/brands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (response.status === 409) {
    throw new Error('Tên thương hiệu đã tồn tại.')
  }

  if (!response.ok) {
    throw new Error('Không thể tạo thương hiệu.')
  }

  return (await response.json()) as Brand
}

export async function getCategories() {
  const response = await fetch(`${apiBaseUrl}/categories`)

  if (!response.ok) {
    throw new Error('Không tải được danh sách danh mục.')
  }

  return (await response.json()) as Category[]
}

export async function createCategory(request: CreateCategoryRequest) {
  const response = await fetch(`${apiBaseUrl}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (response.status === 409) {
    throw new Error('Tên danh mục đã tồn tại.')
  }

  if (!response.ok) {
    throw new Error('Không thể tạo danh mục.')
  }

  return (await response.json()) as Category
}

export async function getProducts() {
  const response = await fetch(`${apiBaseUrl}/products`)

  if (!response.ok) {
    throw new Error('Không tải được danh sách sản phẩm.')
  }

  return (await response.json()) as Product[]
}

export async function createProduct(request: CreateProductRequest) {
  const response = await fetch(`${apiBaseUrl}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (response.status === 409) {
    throw new Error('Tên sản phẩm hoặc mã SKU đã tồn tại.')
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Không thể tạo sản phẩm.')
  }

  return (await response.json()) as Product
}
