'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Images } from 'lucide-react'
import { getGoogleDriveThumbnail } from '@/lib/utils'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sellPrice: number
  image: string
  images?: string[]
}

export default function ProductCard({ product }: { product: Product }) {
  const images = product.images || [product.image]
  const hasMultipleImages = images.length > 1
  const discountPercent = product.price > product.sellPrice 
    ? Math.round(((product.price - product.sellPrice) / product.price) * 100)
    : 0

  return (
    <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary hover:scale-105 group">
      <div className="block cursor-pointer">
        <div className="relative h-64 bg-wood-light/20">
          {/* Stacked Images Effect - Ảnh xếp chồng như xấp giấy */}
          <div className="relative w-full h-full">
            {/* Ảnh thứ 3 (nếu có) - layer dưới cùng */}
            {images[2] && (
              <div className="absolute inset-0 transform translate-x-2 translate-y-2 opacity-40">
                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-md">
                  <Image
                    src={getGoogleDriveThumbnail(images[2])}
                    alt={`${product.name} - 3`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Ảnh thứ 2 (nếu có) - layer giữa */}
            {images[1] && (
              <div className="absolute inset-0 transform translate-x-1 translate-y-1 opacity-60 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300">
                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-lg">
                  <Image
                    src={getGoogleDriveThumbnail(images[1])}
                    alt={`${product.name} - 2`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Ảnh chính - layer trên cùng */}
            <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image
                src={getGoogleDriveThumbnail(images[0])}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Badge số lượng ảnh */}
          {hasMultipleImages && (
            <div className="absolute top-3 left-3 bg-dark/80 text-cream px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Images className="w-3 h-3" />
              {images.length} ảnh
            </div>
          )}

          {/* Badge Gỗ Tự Nhiên */}
          <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-gold text-dark px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Gỗ Tự Nhiên
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-dark">{product.name}</h3>
        <p className="text-wood-dark mb-4 text-sm leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {discountPercent > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-wood-dark line-through">
                  {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              </div>
            )}
            <span className="text-2xl font-bold text-secondary">
              {product.sellPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
          </div>
          <button
            className="bg-gradient-to-r from-secondary to-wood-dark text-cream px-6 py-2 rounded-lg hover:from-dark hover:to-secondary transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
          >
            <ShoppingCart className="w-4 h-4" />
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  )
}
