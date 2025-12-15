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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">🎛️ Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              View Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Active Vouchers</h3>
              <Tag className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{vouchers.filter(v => v.active).length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
              <ShoppingBag className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Revenue</h3>
              <BarChart className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {orders.reduce((sum, o) => sum + (o.finalPrice || 0), 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'products'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Products
              </button>
              <button
                onClick={() => setActiveTab('vouchers')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'vouchers'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Tag className="w-5 h-5 inline mr-2" />
                Vouchers
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Orders
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Products</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null)
                      setShowProductModal(true)
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      <p className="text-primary font-bold text-xl mb-4">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowProductModal(true)
                          }}
                          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Vouchers</h2>
                  <button
                    onClick={() => {
                      setEditingVoucher(null)
                      setShowVoucherModal(true)
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Voucher
                  </button>
                </div>
                <div className="space-y-4">
                  {vouchers.map((voucher) => (
                    <div key={voucher.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-mono font-bold text-lg">
                              {voucher.code}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm ${voucher.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {voucher.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{voucher.description}</p>
                          <p className="text-primary font-semibold">
                            {voucher.type === 'percentage' ? `${voucher.discount}% OFF` : voucher.type === 'shipping' ? 'FREE SHIPPING' : `${voucher.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} OFF`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingVoucher(voucher)
                              setShowVoucherModal(true)
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVoucher(voucher.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
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
                <h2 className="text-2xl font-bold mb-6">Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-mono">{order.orderId || `ORD-${idx}`}</td>
                          <td className="px-4 py-4 text-sm">
                            <div className="font-medium">{order.name}</div>
                            <div className="text-gray-600">{order.email}</div>
                          </td>
                          <td className="px-4 py-4 text-sm">{order.productName}</td>
                          <td className="px-4 py-4 text-sm font-bold text-primary">{order.finalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No orders yet
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
