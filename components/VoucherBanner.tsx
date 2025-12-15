'use client'

import { Tag } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function VoucherBanner() {
  const [vouchers, setVouchers] = useState<any[]>([])

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
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
      <div className="flex items-center gap-3 mb-6">
        <Tag className="w-8 h-8" />
        <h2 className="text-3xl font-bold">Exclusive Voucher Codes</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {vouchers.length === 0 ? (
          <div className="col-span-3 text-center text-white/70">No active vouchers at the moment</div>
        ) : (
          vouchers.map((voucher) => (
            <div key={voucher.code} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-sm opacity-90 mb-2">{voucher.description}</div>
              <div className="text-2xl font-bold mb-2">
                {voucher.type === 'percentage' ? `${voucher.discount}%` : voucher.type === 'shipping' ? 'Free Shipping' : `${voucher.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`} OFF
              </div>
              <div className="bg-white text-purple-600 px-4 py-2 rounded-lg font-mono font-bold text-center">
                {voucher.code}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
