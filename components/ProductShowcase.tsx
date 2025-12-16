'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ShoppingCart, Star, Images, X, ChevronLeft, ChevronRight } from 'lucide-react'
import OrderModal from './OrderModal'
import { getGoogleDriveThumbnail } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sellPrice: number
  image: string
  images?: string[]
}

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch products:', err)
        setLoading(false)
      })
  }, [])

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleImageClick = (product: Product) => {
    setPreviewProduct(product)
    setCurrentImageIndex(0)
  }

  const handleClosePreview = () => {
    setPreviewProduct(null)
    setCurrentImageIndex(0)
  }

  const goToNextImage = () => {
    if (previewProduct?.images) {
      setCurrentImageIndex((prev) => 
        prev === previewProduct.images!.length - 1 ? 0 : prev + 1
      )
    }
  }

  const goToPrevImage = () => {
    if (previewProduct?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? previewProduct.images!.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-wood-dark">Đang tải sản phẩm...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-wood-dark text-lg">Chưa có sản phẩm nào</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
      {products.map((product, index) => {
        const isEven = index % 2 === 0
        const productImages = product.images || [product.image]
        const hasMultipleImages = productImages.length > 1
        const discountPercent = product.price > product.sellPrice 
          ? Math.round(((product.price - product.sellPrice) / product.price) * 100)
          : 0
        
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`flex flex-col ${
              isEven ? 'md:flex-row' : 'md:flex-row-reverse'
            } gap-4 md:gap-8 items-center bg-gradient-to-br from-cream via-accent to-wood-light rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 border-secondary/30 hover:border-secondary transition-all duration-300 hover:shadow-3xl`}
          >
            {/* Image Section */}
            <div className={`w-full md:w-1/2 relative h-64 sm:h-80 md:h-96 p-3 md:p-4 ${
              isEven 
                ? 'bg-gradient-to-br from-wood-light via-accent to-cream' 
                : 'bg-gradient-to-bl from-cream via-accent to-wood-light'
            }`}>
              <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-primary/40 shadow-inner">
                {/* Stacked Images Effect */}
                <div 
                  className="relative w-full h-full group cursor-pointer"
                  onClick={() => handleImageClick(product)}
                >
                  {/* Ảnh thứ 3 (nếu có) */}
                  {productImages[2] && (
                    <div className="absolute inset-0 transform translate-x-3 translate-y-3 opacity-30">
                      <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white/50 shadow-md">
                        <Image
                          src={getGoogleDriveThumbnail(productImages[2])}
                          alt={`${product.name} - 3`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Ảnh thứ 2 (nếu có) */}
                  {productImages[1] && (
                    <div className="absolute inset-0 transform translate-x-2 translate-y-2 opacity-50 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500">
                      <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-lg">
                        <Image
                          src={getGoogleDriveThumbnail(productImages[1])}
                          alt={`${product.name} - 2`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Ảnh chính */}
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={getGoogleDriveThumbnail(productImages[0])}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Badge số lượng ảnh */}
                  {hasMultipleImages && (
                    <div className="absolute top-3 left-3 bg-dark/90 text-cream px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 z-10">
                      <Images className="w-3.5 h-3.5" />
                      {productImages.length} ảnh
                    </div>
                  )}
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-gold transition-all duration-300 group-hover:w-8 group-hover:h-8 md:group-hover:w-12 md:group-hover:h-12 pointer-events-none z-20"></div>
                <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t-2 md:border-t-4 border-r-2 md:border-r-4 border-gold transition-all duration-300 group-hover:w-8 group-hover:h-8 md:group-hover:w-12 md:group-hover:h-12 pointer-events-none z-20"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b-2 md:border-b-4 border-l-2 md:border-l-4 border-gold transition-all duration-300 group-hover:w-8 group-hover:h-8 md:group-hover:w-12 md:group-hover:h-12 pointer-events-none z-20"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-gold transition-all duration-300 group-hover:w-8 group-hover:h-8 md:group-hover:w-12 md:group-hover:h-12 pointer-events-none z-20"></div>
              </div>
            </div>

            {/* Content Section */}
            <div className={`w-full md:w-1/2 p-6 sm:p-8 md:p-12 ${!isEven ? 'md:flex md:justify-end' : ''}`}>
              <div className={`max-w-xl ${!isEven ? 'md:text-right' : ''}`}>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-dark leading-tight">
                  {product.name}
                </h3>
                <p className="text-wood-dark mb-4 md:mb-6 text-base md:text-lg leading-relaxed">
                  {product.description}
                </p>
                
                <div className="border-t-2 border-primary/20 pt-4 md:pt-6 mb-4 md:mb-6">
                  <div className={`flex flex-col gap-2 mb-2 ${!isEven ? 'md:items-end' : ''}`}>
                    {discountPercent > 0 && (
                      <div className={`flex items-center gap-2 ${!isEven ? 'md:justify-end' : ''}`}>
                        <span className="text-base md:text-lg text-wood-dark line-through">
                          {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-md">
                          GIẢM {discountPercent}%
                        </span>
                      </div>
                    )}
                    <div className={`flex items-baseline gap-2 ${!isEven ? 'md:justify-end' : ''}`}>
                      <span className="text-xs md:text-sm text-wood-dark font-medium">Giá bán:</span>
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
                        {product.sellPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-wood-dark/70">Miễn phí vận chuyển cho đơn hàng trên 2,000,000₫</p>
                </div>

                <button
                  onClick={() => handleOrderClick(product)}
                  className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-secondary to-wood-dark text-cream px-6 md:px-8 py-3 md:py-4 rounded-xl hover:from-dark hover:to-secondary transition-all shadow-xl hover:shadow-2xl font-bold text-base md:text-lg hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  Đặt Hàng Ngay
                </button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>

      {/* Order Modal */}
      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Image Preview Modal */}
      {previewProduct && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleClosePreview}
        >
          <button
            onClick={handleClosePreview}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-3xl max-h-[80vh] aspect-square" onClick={(e) => e.stopPropagation()}>
            {/* Main Image */}
            <div className="relative w-full h-full">
              <Image
                src={getGoogleDriveThumbnail((previewProduct.images || [previewProduct.image])[currentImageIndex])}
                alt={`${previewProduct.name} - ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Navigation Arrows */}
            {(previewProduct.images || [previewProduct.image]).length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevImage()
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNextImage()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                  {currentImageIndex + 1} / {(previewProduct.images || [previewProduct.image]).length}
                </div>
              </>
            )}

            {/* Thumbnails */}
            {(previewProduct.images || [previewProduct.image]).length > 1 && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-full overflow-x-auto">
                {(previewProduct.images || [previewProduct.image]).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                    className={`relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? 'border-primary scale-110'
                        : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getGoogleDriveThumbnail(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Info */}
            <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded-lg max-w-xs">
              <h3 className="font-bold text-base">{previewProduct.name}</h3>
              <p className="text-xs text-white/80">{previewProduct.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
