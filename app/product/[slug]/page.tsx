import { Metadata } from 'next'
import Image from 'next/image'
import OrderForm from '@/components/OrderForm'
import ProductCard from '@/components/ProductCard'
import ImageGallery from '@/components/ImageGallery'
import Header from '@/components/Header'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

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

async function getProductBySlug(slug: string) {
  const products = await getProducts()
  return products.find((p: any) => p.slug === slug)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Wood Craft`,
    description: product.fullDescription,
    openGraph: {
      title: product.name,
      description: product.fullDescription,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  const allProducts = await getProducts()

  // Get related products (exclude current product, limit to 4)
  const relatedProducts = allProducts
    .filter((p: any) => p.slug !== params.slug)
    .slice(0, 4)

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-accent to-wood-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-dark">Không Tìm Thấy Sản Phẩm</h1>
          <Link href="/" className="text-secondary hover:text-primary transition-colors font-semibold">
            Quay Về Trang Chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-accent to-wood-light">
      {/* Header */}
      <Header />

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-semibold mb-8">
          <ArrowLeft className="w-5 h-5" />
          Quay Lại Cửa Hàng
        </Link>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {/* Product Image Gallery */}
          <ImageGallery 
            images={product.images || [product.image]} 
            productName={product.name} 
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-dark mb-4 tracking-tight">{product.name}</h1>
              <p className="text-xl text-wood-dark mb-6 leading-relaxed">{product.fullDescription}</p>
              <div className="text-5xl font-bold text-secondary mb-6 bg-gradient-to-r from-accent to-white p-4 rounded-xl inline-block shadow-lg">
                {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-xl p-6 border-2 border-primary/20">
              <h2 className="text-2xl font-bold mb-4 text-dark flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Đặc Điểm Nổi Bật
              </h2>
              <ul className="space-y-3">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-wood-dark font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Form */}
            <OrderForm product={product} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-dark mb-4">Sản Phẩm Liên Quan</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-gold to-primary mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
