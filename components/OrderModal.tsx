'use client'

import { useState } from 'react'
import { X, Tag, Loader2, CheckCircle, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { getGoogleDriveThumbnail } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  sellPrice: number
  image: string
  description: string
}

interface OrderModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    voucherCode: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'shipping'>('percentage')
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false)
  const [voucherStatus, setVoucherStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [voucherMessage, setVoucherMessage] = useState('')

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const applyVoucher = async () => {
    if (!formData.voucherCode.trim()) {
      setVoucherStatus('error')
      setVoucherMessage('Vui lòng nhập mã giảm giá')
      setTimeout(() => setVoucherStatus('idle'), 3000)
      return
    }

    setIsCheckingVoucher(true)
    setVoucherStatus('idle')
    try {
      const response = await fetch('/api/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: formData.voucherCode })
      })
      
      const result = await response.json()
      
      if (result.valid && result.voucher) {
        setDiscount(result.voucher.discount)
        setDiscountType(result.voucher.type)
        setVoucherStatus('success')
        setVoucherMessage(`✨ ${result.voucher.description}`)
        setTimeout(() => setVoucherStatus('idle'), 5000)
      } else {
        setDiscount(0)
        setVoucherStatus('error')
        setVoucherMessage('❌ Mã voucher không hợp lệ hoặc đã hết hạn')
        setTimeout(() => setVoucherStatus('idle'), 4000)
      }
    } catch (error) {
      setDiscount(0)
      setVoucherStatus('error')
      setVoucherMessage('⚠️ Không thể xác thực mã voucher. Vui lòng thử lại')
      setTimeout(() => setVoucherStatus('idle'), 4000)
    } finally {
      setIsCheckingVoucher(false)
    }
  }

  const calculateTotal = () => {
    let total = product.sellPrice
    if (discountType === 'percentage') {
      total = total * (1 - discount / 100)
    } else if (discountType === 'fixed') {
      total = Math.max(0, total - discount)
    }
    return total
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const orderData = {
        ...formData,
        productId: product.id,
        productName: product.name,
        originalPrice: product.price,
        discount: discount,
        discountType: discountType,
        finalPrice: calculateTotal(),
        orderDate: new Date().toISOString()
      }

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          voucherCode: ''
        })
        setDiscount(0)
        setTimeout(() => {
          onClose()
          setSubmitStatus('idle')
        }, 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Không thể gửi đơn hàng')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Đã xảy ra lỗi khi gửi đơn hàng')
      console.error('Order submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-wood-dark text-cream p-6 flex justify-between items-center rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Đặt Hàng Ngay</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {/* Product Info */}
          <div className="p-4 sm:p-6 pb-0">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b-2 border-primary/20">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                <Image
                  src={getGoogleDriveThumbnail(product.image)}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2">{product.name}</h3>
                <p className="text-sm sm:text-base text-wood-dark mb-3 line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                  {product.price > product.sellPrice && (
                    <span className="text-base sm:text-lg text-wood-dark line-through">
                      {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-bold text-secondary">
                    {product.sellPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                  {product.price > product.sellPrice && (
                    <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded">
                      -{Math.round(((product.price - product.sellPrice) / product.price) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6">
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-800 font-semibold">Đặt hàng thành công!</p>
                <p className="text-green-700 text-sm">Bạn sẽ nhận được email xác nhận trong giây lát.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">Lỗi</p>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-dark mb-2">
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-dark mb-2">
                  Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="0912345678"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-dark mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-dark mb-2">
                Địa Chỉ Giao Hàng *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                placeholder="Số nhà, đường, phường, quận, thành phố"
              />
            </div>

            {/* Voucher Code */}
            <div>
              <label htmlFor="voucherCode" className="block text-sm font-semibold text-dark mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Mã Giảm Giá
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  id="voucherCode"
                  name="voucherCode"
                  value={formData.voucherCode}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border-2 border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all uppercase text-sm sm:text-base"
                  placeholder="Nhập mã giảm giá"
                />
                <button
                  type="button"
                  onClick={applyVoucher}
                  disabled={isCheckingVoucher}
                  className="bg-gradient-to-r from-primary to-gold text-dark px-4 sm:px-6 py-3 rounded-lg hover:from-gold hover:to-primary transition-all font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto whitespace-nowrap text-sm sm:text-base"
                >
                  {isCheckingVoucher ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Kiểm tra...
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4" />
                      Áp Dụng
                    </>
                  )}
                </button>
              </div>
              
              {/* Voucher Status Notification */}
              {voucherStatus === 'success' && (
                <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-green-800 font-semibold text-sm">Áp dụng thành công!</p>
                    <p className="text-green-700 text-xs mt-1">{voucherMessage}</p>
                  </div>
                </div>
              )}
              
              {voucherStatus === 'error' && (
                <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3 animate-in slide-in-from-top">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 font-semibold text-sm">Không thể áp dụng</p>
                    <p className="text-red-700 text-xs mt-1">{voucherMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-cream to-white rounded-xl p-6 space-y-3 border-2 border-primary/20">
              <h4 className="font-bold text-lg text-dark mb-3">Tổng Đơn Hàng</h4>
              {product.price > product.sellPrice && (
                <div className="flex justify-between text-wood-dark">
                  <span>Giá gốc:</span>
                  <span className="font-semibold line-through">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
              )}
              <div className="flex justify-between text-dark">
                <span className="font-semibold">Giá bán:</span>
                <span className="font-semibold">{product.sellPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá ({discountType === 'percentage' ? `${discount}%` : `${discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}):</span>
                  <span className="font-semibold">
                    -{discountType === 'percentage' ? (product.sellPrice * discount / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                </div>
              )}
              {discountType === 'shipping' && discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Miễn phí vận chuyển</span>
                  <span className="font-semibold">✓</span>
                </div>
              )}
              <div className="border-t-2 border-primary/30 pt-3 flex justify-between font-bold text-xl">
                <span className="text-dark">Tổng cộng:</span>
                <span className="text-secondary">{calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-dark py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-secondary to-wood-dark text-cream py-4 rounded-xl font-bold hover:from-dark hover:to-secondary transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Xác Nhận Đặt Hàng
                  </>
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}
