'use client'

import Link from 'next/link'
import { ShoppingCart, Tag, Phone, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setMobileMenuOpen(false)
    }

    return (
        <header className="bg-gradient-to-r from-dark via-secondary to-dark text-cream shadow-2xl sticky top-0 z-50 border-b-4 border-primary">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" onClick={scrollToTop} className="flex items-center gap-3 group">
                        <div className="text-3xl transform group-hover:scale-110 transition-transform">🌳</div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary tracking-wide">
                                Wood Craft
                            </h1>
                            <p className="text-xs text-accent">Premium Wooden Products</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="#products"
                            className="text-cream hover:text-primary transition-colors font-medium flex items-center gap-2 group"
                        >
                            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Sản Phẩm
                        </Link>
                        <Link
                            href="#vouchers"
                            className="text-cream hover:text-primary transition-colors font-medium flex items-center gap-2 group"
                        >
                            <Tag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Ưu Đãi
                        </Link>
                        <Link
                            href="#contact"
                            className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-gold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                        >
                            <Phone className="w-4 h-4" />
                            Liên Hệ
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-cream hover:text-primary transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-primary/30 pt-4">
                        <Link
                            href="#products"
                            className="block text-cream hover:text-primary transition-colors font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <ShoppingCart className="w-4 h-4 inline mr-2" />
                            Sản Phẩm
                        </Link>
                        <Link
                            href="#vouchers"
                            className="block text-cream hover:text-primary transition-colors font-medium py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Tag className="w-4 h-4 inline mr-2" />
                            Ưu Đãi
                        </Link>
                        <Link
                            href="#contact"
                            className="block bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-gold transition-all text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Phone className="w-4 h-4 inline mr-2" />
                            Liên Hệ
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    )
}
