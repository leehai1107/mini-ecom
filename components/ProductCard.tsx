'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  slug: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary hover:scale-105">
      <div className="relative h-64 bg-wood-light/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-gold text-dark px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Gỗ Tự Nhiên
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-dark">{product.name}</h3>
        <p className="text-wood-dark mb-4 text-sm leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-secondary">
            {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="bg-gradient-to-r from-secondary to-wood-dark text-cream px-6 py-2 rounded-lg hover:from-dark hover:to-secondary transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
          >
            <ShoppingCart className="w-4 h-4" />
            Mua Ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
