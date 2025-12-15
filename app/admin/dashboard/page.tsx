'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Tag, Package, LogOut, Plus, Edit, Trash2, BarChart } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'products' | 'vouchers' | 'orders'>('products')
  const [products, setProducts] = useState<any[]>([])
  const [vouchers, setVouchers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingVoucher, setEditingVoucher] = useState<any>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, vouchersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/vouchers'),
        fetch('/api/admin/orders'),
      ])

      const productsData = await productsRes.json()
      const vouchersData = await vouchersRes.json()
      const ordersData = await ordersRes.json()

      setProducts(productsData.products || [])
      setVouchers(vouchersData.vouchers || [])
      setOrders(ordersData.orders || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin')
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      alert('Failed to delete product')
    }
  }

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return

    try {
      await fetch(`/api/admin/vouchers?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      alert('Failed to delete voucher')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-accent to-wood-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark via-secondary to-dark text-cream shadow-2xl border-b-4 border-primary">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🎛️</span>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-cream hover:text-primary transition-colors font-medium">
              Xem Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg font-medium"
            >
              <LogOut className="w-4 h-4" />
              Đăng Xuất
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-wood-dark text-sm font-bold">Tổng Sản Phẩm</h3>
              <Package className="w-10 h-10 text-secondary" />
            </div>
            <p className="text-4xl font-bold text-dark">{products.length}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-wood-dark text-sm font-bold">Mã Giảm Giá</h3>
              <Tag className="w-10 h-10 text-primary" />
            </div>
            <p className="text-4xl font-bold text-dark">{vouchers.filter(v => v.active).length}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-wood-dark text-sm font-bold">Tổng Đơn Hàng</h3>
              <ShoppingBag className="w-10 h-10 text-wood-medium" />
            </div>
            <p className="text-4xl font-bold text-dark">{orders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-6 border-2 border-primary/20 hover:border-primary transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-wood-dark text-sm font-bold">Doanh Thu</h3>
              <BarChart className="w-10 h-10 text-gold" />
            </div>
            <p className="text-2xl font-bold text-dark">
              {orders.reduce((sum, o) => sum + (o.finalPrice || 0), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-primary/20">
          <div className="border-b-2 border-primary/20 bg-gradient-to-r from-accent to-cream">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 font-bold transition-all ${activeTab === 'products'
                  ? 'text-dark border-b-4 border-primary bg-white/50'
                  : 'text-wood-dark hover:text-dark hover:bg-white/30'
                  }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Sản Phẩm
              </button>
              <button
                onClick={() => setActiveTab('vouchers')}
                className={`px-6 py-4 font-bold transition-all ${activeTab === 'vouchers'
                  ? 'text-dark border-b-4 border-primary bg-white/50'
                  : 'text-wood-dark hover:text-dark hover:bg-white/30'
                  }`}
              >
                <Tag className="w-5 h-5 inline mr-2" />
                Mã Giảm Giá
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-bold transition-all ${activeTab === 'orders'
                  ? 'text-dark border-b-4 border-primary bg-white/50'
                  : 'text-wood-dark hover:text-dark hover:bg-white/30'
                  }`}
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Đơn Hàng
              </button>
            </nav>
          </div>

          <div className="p-8">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-dark">Quản Lý Sản Phẩm</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null)
                      setShowProductModal(true)
                    }}
                    className="bg-gradient-to-r from-secondary to-wood-dark text-cream px-6 py-3 rounded-lg hover:from-dark hover:to-secondary transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-bold"
                  >
                    <Plus className="w-5 h-5" />
                    Thêm Sản Phẩm
                  </button>
                </div>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border-2 border-primary/20 rounded-xl p-5 hover:shadow-2xl transition-all bg-gradient-to-br from-white to-cream hover:border-primary flex gap-6">
                      <img src={product.image} alt={product.name} className="w-48 h-32 object-cover rounded-lg shadow-md flex-shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-xl mb-2 text-dark">{product.name}</h3>
                          <p className="text-wood-dark text-sm mb-2 line-clamp-2">{product.description}</p>
                          <p className="text-secondary font-bold text-xl">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowProductModal(true)
                          }}
                          className="bg-gradient-to-r from-primary to-gold text-dark px-5 py-2 rounded-lg hover:from-gold hover:to-primary transition-all shadow-md flex items-center justify-center gap-2 font-semibold whitespace-nowrap"
                        >
                          <Edit className="w-4 h-4" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center justify-center gap-2 font-semibold whitespace-nowrap"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vouchers Tab */}
            {activeTab === 'vouchers' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-dark">Quản Lý Mã Giảm Giá</h2>
                  <button
                    onClick={() => {
                      setEditingVoucher(null)
                      setShowVoucherModal(true)
                    }}
                    className="bg-gradient-to-r from-secondary to-wood-dark text-cream px-6 py-3 rounded-lg hover:from-dark hover:to-secondary transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-bold"
                  >
                    <Plus className="w-5 h-5" />
                    Thêm Mã
                  </button>
                </div>
                <div className="space-y-4">
                  {vouchers.map((voucher) => (
                    <div key={voucher.id} className="border-2 border-primary/20 rounded-xl p-6 hover:shadow-xl transition-all bg-gradient-to-br from-white to-cream hover:border-primary">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="bg-gradient-to-r from-primary to-gold text-dark px-5 py-2 rounded-lg font-mono font-bold text-xl shadow-md">
                              {voucher.code}
                            </span>
                            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${voucher.active ? 'bg-green-100 text-green-800 border-2 border-green-300' : 'bg-gray-100 text-gray-800 border-2 border-gray-300'}`}>
                              {voucher.active ? 'Đang Hoạt Động' : 'Đã Tắt'}
                            </span>
                          </div>
                          <p className="text-wood-dark mb-2 font-medium">{voucher.description}</p>
                          <p className="text-secondary font-bold text-lg">
                            {voucher.type === 'percentage' ? `Giảm ${voucher.discount}%` : voucher.type === 'shipping' ? 'MIỄN PHÍ VẬN CHUYỂN' : `Giảm ${voucher.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingVoucher(voucher)
                              setShowVoucherModal(true)
                            }}
                            className="bg-gradient-to-r from-primary to-gold text-dark px-5 py-2 rounded-lg hover:from-gold hover:to-primary transition-all shadow-md flex items-center gap-2 font-semibold"
                          >
                            <Edit className="w-4 h-4" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteVoucher(voucher.id)}
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center gap-2 font-semibold"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-dark">Quản Lý Đơn Hàng</h2>
                <div className="overflow-x-auto rounded-xl border-2 border-primary/20 shadow-lg">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-accent to-cream border-b-2 border-primary/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-dark">Mã Đơn</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-dark">Khách Hàng</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-dark">Sản Phẩm</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-dark">Tổng Tiền</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-dark">Ngày Đặt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/10 bg-white">
                      {orders.map((order, idx) => (
                        <tr key={idx} className="hover:bg-accent/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono font-semibold text-secondary">{order.orderId || `ORD-${idx}`}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-semibold text-dark">{order.name}</div>
                            <div className="text-wood-dark text-xs">{order.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-dark">{order.productName}</td>
                          <td className="px-6 py-4 text-sm font-bold text-secondary">{order.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                          <td className="px-6 py-4 text-sm text-wood-dark">
                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-wood-dark font-medium">
                            Chưa có đơn hàng nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowProductModal(false)}
          onSave={() => {
            fetchData()
            setShowProductModal(false)
          }}
        />
      )}

      {showVoucherModal && (
        <VoucherModal
          voucher={editingVoucher}
          onClose={() => setShowVoucherModal(false)}
          onSave={() => {
            fetchData()
            setShowVoucherModal(false)
          }}
        />
      )}
    </div>
  )
}

// Product Modal Component
function ProductModal({ product, onClose, onSave }: any) {
  const [formData, setFormData] = useState(product || {
    name: '',
    description: '',
    fullDescription: '',
    price: 0,
    image: '',
    features: []
  })
  const [featureInput, setFeatureInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = product ? 'PUT' : 'POST'
      await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      onSave()
    } catch (error) {
      alert('Failed to save product')
    }
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()]
      })
      setFeatureInput('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_: any, i: number) => i !== index)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Full Description</label>
            <textarea
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price (VND)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Add a feature"
              />
              <button type="button" onClick={addFeature} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                Add
              </button>
            </div>
            <div className="space-y-2">
              {(formData.features || []).map((feature: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded">
                  <span className="flex-1">{feature}</span>
                  <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Save Product
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Voucher Modal Component
function VoucherModal({ voucher, onClose, onSave }: any) {
  const [formData, setFormData] = useState(voucher || {
    code: '',
    discount: 0,
    type: 'percentage',
    description: '',
    active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = voucher ? 'PUT' : 'POST'
      await fetch('/api/admin/vouchers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      onSave()
    } catch (error) {
      alert('Failed to save voucher')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-8">
        <h2 className="text-2xl font-bold mb-6">{voucher ? 'Edit Voucher' : 'Add New Voucher'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Voucher Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="shipping">Free Shipping</option>
            </select>
          </div>
          {formData.type !== 'shipping' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Discount Value {formData.type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="active" className="text-sm font-medium">Active</label>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
              Save Voucher
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
