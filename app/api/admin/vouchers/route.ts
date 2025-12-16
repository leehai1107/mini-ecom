import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL
const SHEET_NAME = process.env.SHEET_NAME_VOUCHERS || 'Vouchers'

// Fetch vouchers from Google Sheets
async function fetchVouchersFromSheet() {
  if (!GOOGLE_SHEET_URL) {
    // Return default vouchers if no Google Sheet configured
    return [
      { id: '1', code: 'WELCOME10', discount: 10, type: 'percentage', description: 'First-time customers', active: true, usageLimit: 100, usageCount: 0 },
      { id: '2', code: 'SAVE20', discount: 20, type: 'percentage', description: 'Orders over $200', active: true, usageLimit: 50, usageCount: 0 },
      { id: '3', code: 'FREESHIP', discount: 0, type: 'shipping', description: 'Free shipping', active: true, usageLimit: 200, usageCount: 0 },
    ]
  }

  try {
    const params = new URLSearchParams({
      path: SHEET_NAME,
      action: 'read',
    })
    const response = await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
    const data = await response.json()
    
    const vouchers = Array.isArray(data.data) ? data.data.map((row: any) => ({
      id: row.id || row.ID || '',
      code: row.code || row.Code || '',
      discount: parseFloat(row.discount || row.Discount || '0'),
      type: row.type || row.Type || 'percentage',
      description: row.description || row.Description || '',
      active: row.active === 'true' || row.active === true || row.Active === 'true',
      usageLimit: parseInt(row.usageLimit || row.UsageLimit || '0'),
      usageCount: parseInt(row.usageCount || row.UsageCount || '0')
    })) : []
    
    return vouchers
  } catch (error) {
    console.error('Failed to fetch vouchers from Google Sheets:', error)
    return []
  }
}

// GET all vouchers
export async function GET(request: NextRequest) {
  try {
    const vouchers = await fetchVouchersFromSheet()
    return NextResponse.json({
      success: true,
      vouchers,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vouchers' },
      { status: 500 }
    )
  }
}

// POST create new voucher
export async function POST(request: NextRequest) {
  try {
    const voucher = await request.json()
    voucher.id = Date.now().toString()
    voucher.active = true
    voucher.usageCount = 0
    
    // Save to Google Sheets
    if (GOOGLE_SHEET_URL) {
      try {
        const params = new URLSearchParams({
          path: SHEET_NAME,
          action: 'write',
          id: voucher.id,
          code: voucher.code,
          discount: voucher.discount.toString(),
          type: voucher.type,
          description: voucher.description,
          active: voucher.active.toString(),
          usageLimit: voucher.usageLimit?.toString() || '0',
          usageCount: voucher.usageCount.toString()
        })
        await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
      } catch (sheetError) {
        console.error('Failed to save voucher to Google Sheets:', sheetError)
      }
    }
    
    return NextResponse.json({
      success: true,
      voucher,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create voucher' },
      { status: 500 }
    )
  }
}

// PUT update voucher
export async function PUT(request: NextRequest) {
  try {
    const updatedVoucher = await request.json()
    
    // Update in Google Sheets
    if (GOOGLE_SHEET_URL) {
      try {
        const params = new URLSearchParams({
          path: SHEET_NAME,
          action: 'update',
          id: updatedVoucher.id,
          code: updatedVoucher.code,
          discount: updatedVoucher.discount.toString(),
          type: updatedVoucher.type,
          description: updatedVoucher.description,
          active: updatedVoucher.active.toString(),
          usageLimit: updatedVoucher.usageLimit?.toString() || '0',
          usageCount: updatedVoucher.usageCount?.toString() || '0'
        })
        await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
      } catch (sheetError) {
        console.error('Failed to update voucher in Google Sheets:', sheetError)
      }
    }
    
    return NextResponse.json({
      success: true,
      voucher: updatedVoucher,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update voucher' },
      { status: 500 }
    )
  }
}

// DELETE voucher
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // Delete from Google Sheets
    if (GOOGLE_SHEET_URL) {
      try {
        const params = new URLSearchParams({
          path: SHEET_NAME,
          action: 'delete',
          id: id || ''
        })
        await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
      } catch (sheetError) {
        console.error('Failed to delete voucher from Google Sheets:', sheetError)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Voucher deleted',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete voucher' },
      { status: 500 }
    )
  }
}
