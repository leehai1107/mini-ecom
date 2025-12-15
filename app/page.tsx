import Link from 'next/link'
import { ShoppingCart, Tag, Mail, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import VoucherBanner from '@/components/VoucherBanner'

// Fetch products from admin API
async function getProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/admin/products', {
      cache: 'no-store'
    })
    const data = await res.json()
    return data.products || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            🛍️ Mini Store
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#products" className="text-gray-700 hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="#vouchers" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Vouchers
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Premium Products,
          <span className="text-primary"> Unbeatable Prices</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover our curated collection of high-quality products. Use exclusive voucher codes for amazing discounts!
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="#products" 
            className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="#vouchers" 
            className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Get Vouchers
          </Link>
        </div>
      </section>

      {/* Voucher Banner */}
      <section id="vouchers" className="container mx-auto px-4 py-12">
        <VoucherBanner />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Free shipping on orders over 2,000,000₫</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Exclusive Vouchers</h3>
            <p className="text-gray-600">Save more with special discount codes</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Notifications</h3>
            <p className="text-gray-600">Get order confirmations instantly</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Mini E-Commerce Store</h3>
          <p className="text-gray-400 mb-6">Quality products, exceptional service</p>
          <div className="flex justify-center gap-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-gray-500 mt-8">© 2025 Mini E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
