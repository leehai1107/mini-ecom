'use client'

import { Tag, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function VoucherBanner() {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  useEffect(() => {
    fetch('/api/admin/vouchers')
      .then(res => res.json())
      .then(data => {
        const activeVouchers = (data.vouchers || []).filter((v: any) => v.active)
        setVouchers(activeVouchers)
      })
      .catch(err => console.error('Failed to fetch vouchers:', err))
  }, [])

  return (
    <div className="bg-gradient-to-r from-secondary via-wood-dark to-secondary rounded-2xl p-8 text-cream shadow-2xl border-2 border-primary/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary p-2 rounded-full">
          <Tag className="w-8 h-8 text-dark" />
        </div>
        <h2 className="text-3xl font-bold text-primary">Mã Giảm Giá Độc Quyền</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {vouchers.length === 0 ? (
          <div className="col-span-3 text-center text-accent py-8">Chưa có mã giảm giá nào đang hoạt động</div>
        ) : (
          vouchers.map((voucher) => (
            <div key={voucher.code} className="bg-gradient-to-br from-cream/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30 hover:border-primary transition-all hover:scale-105">
              <div className="text-sm text-accent mb-3 font-medium">{voucher.description}</div>
              <div className="text-2xl font-bold mb-4 text-gold">
                {voucher.type === 'percentage' ? `Giảm ${voucher.discount}%` : voucher.type === 'shipping' ? 'Miễn Phí Vận Chuyển' : `Giảm ${voucher.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-gradient-to-r from-primary to-gold text-dark px-4 py-3 rounded-lg font-mono font-bold text-center shadow-lg">
                  {voucher.code}
                </div>
                <button
                  onClick={() => copyToClipboard(voucher.code)}
                  className="bg-gradient-to-r from-primary to-gold text-dark px-4 py-3 rounded-lg hover:from-gold hover:to-primary transition-all shadow-lg flex items-center justify-center"
                  title="Sao chép mã"
                >
                  {copiedCode === voucher.code ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              {copiedCode === voucher.code && (
                <div className="text-xs text-gold mt-2 text-center font-semibold">
                  ✅ Đã sao chép!
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
