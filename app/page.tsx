import Link from 'next/link'
import { ShoppingCart, Tag, Mail, ArrowRight, Truck, Shield, Award } from 'lucide-react'
import ProductShowcase from '@/components/ProductShowcase'
import VoucherBanner from '@/components/VoucherBanner'
import Header from '@/components/Header'
import FadeIn from '@/components/FadeIn'
import ScrollToTop from '@/components/ScrollToTop'

interface Product {
  id: string
  name: string
  price: number
  image: string
  images?: string[] // Multiple images support
  description: string
  sellPrice: number
}

// Fetch products from admin API
async function getProducts(): Promise<Product[]> {
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
    <div className="min-h-screen">
      <ScrollToTop />
      {/* Header */}
      <Header />

      {/* Main Content with animated background */}
      <div className="animated-gradient">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20 text-center relative z-10">
          <div className="absolute inset-0 wood-grain opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-dark mb-4 md:mb-6 tracking-tight">
              Nghệ Thuật Gỗ
              <span className="text-secondary block mt-2">Tinh Hoa Thủ Công</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-wood-dark mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Khám phá bộ sưu tập đồ gỗ thủ công cao cấp. Mỗi sản phẩm là một tác phẩm nghệ thuật độc đáo, mang đến vẻ đẹp tự nhiên cho không gian của bạn.
            </p>
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
              <Link
                href="#products"
                className="bg-gradient-to-r from-secondary to-wood-dark text-cream px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-base font-semibold hover:from-dark hover:to-secondary transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                Xem Sản Phẩm
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#vouchers"
                className="bg-primary text-dark border-2 border-secondary px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-base font-semibold hover:bg-gold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Nhận Ưu Đãi
              </Link>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section id="products" className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <FadeIn>
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4">Sản Phẩm Nổi Bật</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-gold to-primary mx-auto"></div>
            </div>
          </FadeIn>
          <ProductShowcase products={products} />
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-12 md:py-16 relative ">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <FadeIn delay={0.1} className="h-full">
              <div className="bg-gradient-to-br from-cream to-white p-6 md:p-8 rounded-2xl shadow-xl text-center border-2 border-primary/20 hover:border-primary transition-all hover:scale-105 h-full flex flex-col">
                <div className="bg-gradient-to-br from-primary to-gold w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <Truck className="w-8 h-8 md:w-10 md:h-10 text-dark" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-dark">Giao Hàng Nhanh</h3>
                <p className="text-sm md:text-base text-wood-dark flex-1">Miễn phí vận chuyển cho đơn hàng trên 2,000,000₫</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="h-full">
              <div className="bg-gradient-to-br from-cream to-white p-6 md:p-8 rounded-2xl shadow-xl text-center border-2 border-primary/20 hover:border-primary transition-all hover:scale-105 h-full flex flex-col">
                <div className="bg-gradient-to-br from-primary to-gold w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-dark" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-dark">Cam Kết Chất Lượng</h3>
                <p className="text-sm md:text-base text-wood-dark flex-1">100% gỗ tự nhiên cao cấp, bảo hành dài hạn</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3} className="h-full">
              <div className="bg-gradient-to-br from-cream to-white p-6 md:p-8 rounded-2xl shadow-xl text-center border-2 border-primary/20 hover:border-primary transition-all hover:scale-105 h-full flex flex-col">
                <div className="bg-gradient-to-br from-primary to-gold w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-dark" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-dark">Thủ Công Tinh Xảo</h3>
                <p className="text-sm md:text-base text-wood-dark flex-1">Được chế tác bởi nghệ nhân lành nghề</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Voucher Banner */}
        <section id="vouchers" className="container mx-auto px-4 py-8 md:py-12 pb-12 md:pb-20 relative ">
          <FadeIn>
            <VoucherBanner />
          </FadeIn>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-dark via-secondary to-dark text-cream py-12 md:py-16 border-t-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <span className="text-3xl md:text-4xl">🌳</span>
              <h3 className="text-2xl md:text-3xl font-bold text-primary">Wood Craft</h3>
            </div>
            <p className="text-accent text-base md:text-lg mb-4 md:mb-6">Nghệ thuật gỗ - Tinh hoa thủ công</p>
          </div>
          <div className="flex justify-center gap-4 md:gap-8 mb-6 md:mb-8 flex-wrap">
            <Link href="#" className="text-accent hover:text-primary transition-colors font-medium">
              Chính Sách Bảo Mật
            </Link>
            <Link href="#" className="text-accent hover:text-primary transition-colors font-medium">
              Điều Khoản Dịch Vụ
            </Link>
            <Link href="#contact" className="text-accent hover:text-primary transition-colors font-medium">
              Liên Hệ
            </Link>
          </div>
          <div className="text-center text-accent/70">
            <p>© 2025 Wood Craft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
