import { NextRequest, NextResponse } from 'next/server'

// Validate voucher code against Google Sheets
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Voucher code is required' },
        { status: 400 }
      )
    }

    const googleSheetUrl = process.env.GOOGLE_SHEET_URL
    const sheetName = process.env.SHEET_NAME_VOUCHERS || 'Vouchers'

    // Fetch from admin API (in-memory storage)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const vouchersRes = await fetch(`${baseUrl}/api/admin/vouchers`)
      const vouchersData = await vouchersRes.json()
      
      const voucher = (vouchersData.vouchers || []).find(
        (v: any) => v.code?.toUpperCase() === code.toUpperCase() && v.active
      )

      if (voucher) {
        // Kiểm tra số lượt sử dụng
        const usageLimit = voucher.usageLimit || 0
        const usageCount = voucher.usageCount || 0
        
        if (usageLimit > 0 && usageCount >= usageLimit) {
          return NextResponse.json({
            success: true,
            valid: false,
            message: 'Voucher đã hết lượt sử dụng',
          })
        }
        
        return NextResponse.json({
          success: true,
          valid: true,
          voucher,
        })
      } else {
        return NextResponse.json({
          success: true,
          valid: false,
          message: 'Invalid voucher code',
        })
      }
    } catch (fetchError) {
      return NextResponse.json({
        success: true,
        valid: false,
        message: 'Failed to validate voucher',
      })
    }

    // Google Sheets fallback
    if (!googleSheetUrl) {
      return NextResponse.json({
        success: true,
        valid: false,
        message: 'Voucher system not configured',
      })
    }

    // Fetch vouchers from Google Sheets
    const params = new URLSearchParams({
      path: sheetName,
      action: 'read',
    })

    const response = await fetch(`${googleSheetUrl}?${params.toString()}`)
    const data = await response.json()

    // Find matching voucher
    const voucher = data.data.find(
      (v: any) => v.code?.toUpperCase() === code.toUpperCase()
    )

    if (voucher) {
      return NextResponse.json({
        success: true,
        valid: true,
        voucher,
      })
    } else {
      return NextResponse.json({
        success: true,
        valid: false,
        message: 'Invalid voucher code',
      })
    }
  } catch (error) {
    console.error('Error validating voucher:', error)
    return NextResponse.json(
      { error: 'Failed to validate voucher' },
      { status: 500 }
    )
  }
}
