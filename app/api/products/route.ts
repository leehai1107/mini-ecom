import { NextRequest, NextResponse } from 'next/server'

// Fetch products from Google Sheets
export async function GET(request: NextRequest) {
  try {
    const googleSheetUrl = process.env.GOOGLE_SHEET_URL
    const sheetName = process.env.SHEET_NAME_PRODUCTS || 'Products'

    if (!googleSheetUrl) {
      return NextResponse.json(
        { error: 'Google Sheets URL not configured' },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      path: sheetName,
      action: 'read',
    })

    const response = await fetch(`${googleSheetUrl}?${params.toString()}`)
    const data = await response.json()

    return NextResponse.json({
      success: true,
      products: data.data,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
