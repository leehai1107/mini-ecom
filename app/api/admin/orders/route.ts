import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL
const SHEET_NAME = process.env.SHEET_NAME_ORDERS || 'Orders'

// Fetch orders from Google Sheets
async function fetchOrdersFromSheet() {
  if (!GOOGLE_SHEET_URL) {
    return []
  }

  try {
    const params = new URLSearchParams({
      path: SHEET_NAME,
      action: 'read',
    })
    const response = await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`, {
      cache: 'no-store'
    })
    const data = await response.json()
    
    const orders = Array.isArray(data.data) ? data.data.map((row: any) => ({
      orderId: row.OrderID || row.orderId || '',
      orderDate: row.Date || row.orderDate || '',
      name: row.CustomerName || row.name || '',
      email: row.Email || row.email || '',
      phone: row.Phone || row.phone || '',
      address: row.Address || row.address || '',
      productId: row.ProductID || row.productId || '',
      productName: row.ProductName || row.productName || '',
      originalPrice: parseFloat(row.OriginalPrice || row.originalPrice || '0'),
      discount: parseFloat(row.Discount || row.discount || '0'),
      voucherCode: row.VoucherCode || row.voucherCode || '',
      finalPrice: parseFloat(row.FinalPrice || row.finalPrice || '0'),
    })) : []
    
    return orders
  } catch (error) {
    console.error('Failed to fetch orders from Google Sheets:', error)
    return []
  }
}

// GET all orders
export async function GET(request: NextRequest) {
  try {
    const orders = await fetchOrdersFromSheet()
    const sortedOrders = orders.sort((a: any, b: any) => {
      const dateA = new Date(a.orderDate).getTime()
      const dateB = new Date(b.orderDate).getTime()
      return dateB - dateA
    })
    
    return NextResponse.json({
      success: true,
      orders: sortedOrders,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
