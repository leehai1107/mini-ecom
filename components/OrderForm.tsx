'use client'

import { useState } from 'react'
import { Tag, Loader2, CheckCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
}

interface OrderFormProps {
  product: Product
}

export default function OrderForm({ product }: OrderFormProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const applyVoucher = async () => {
    if (!formData.voucherCode) return

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
        alert(`Voucher applied: ${result.voucher.description}`)
      } else {
        setDiscount(0)
        alert('Invalid voucher code')
      }
    } catch (error) {
      setDiscount(0)
      alert('Failed to validate voucher code')
    }
  }

  const calculateTotal = () => {
    let total = product.price
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
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Failed to submit order')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('An error occurred while submitting your order')
      console.error('Order submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Complete Your Order</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-green-800 font-semibold">Order Submitted Successfully!</p>
            <p className="text-green-700 text-sm">You will receive a confirmation email shortly.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">Error</p>
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Address *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>

        {/* Voucher Code */}
        <div>
          <label htmlFor="voucherCode" className="block text-sm font-medium text-gray-700 mb-1">
            Voucher Code (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="voucherCode"
              name="voucherCode"
              value={formData.voucherCode}
              onChange={handleInputChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter code"
            />
            <button
              type="button"
              onClick={applyVoucher}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Product Price:</span>
            <span>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountType === 'percentage' ? `${discount}%` : `${discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}):</span>
              <span>
                -{discountType === 'percentage' ? (product.price * discount / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
          )}
          {discountType === 'shipping' && (
            <div className="flex justify-between text-green-600">
              <span>Free Shipping:</span>
              <span>{(0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-primary">{calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </button>
      </form>
    </div>
  )
}
