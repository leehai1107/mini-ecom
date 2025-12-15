import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL
const SHEET_NAME = process.env.SHEET_NAME_PRODUCTS || 'Products'

// Fetch products from Google Sheets
async function fetchProductsFromSheet() {
  if (!GOOGLE_SHEET_URL) {
    // Return default products if no Google Sheet configured
    return [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality sound with active noise cancellation',
        fullDescription: 'Experience audio like never before with our Premium Wireless Headphones.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        slug: 'premium-wireless-headphones',
        features: ['Active Noise Cancellation', '30-hour battery life', 'Premium leather ear cushions']
      },
      {
        id: '2',
        name: 'Smart Watch Pro',
        description: 'Track your fitness and stay connected',
        fullDescription: 'Stay connected and healthy with the Smart Watch Pro.',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        slug: 'smart-watch-pro',
        features: ['Heart rate monitoring', 'GPS tracking', 'Water-resistant (50m)']
      },
      {
        id: '3',
        name: 'Minimalist Leather Wallet',
        description: 'Handcrafted genuine leather wallet',
        fullDescription: 'Crafted from premium full-grain leather.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
        slug: 'minimalist-leather-wallet',
        features: ['Genuine full-grain leather', 'RFID-blocking technology', 'Slim design']
      },
      {
        id: '4',
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof speaker with 20-hour battery life',
        fullDescription: 'Take your music anywhere.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
        slug: 'portable-bluetooth-speaker',
        features: ['IPX7 waterproof rating', '20-hour battery life', '360-degree sound']
      }
    ]
  }

  try {
    const params = new URLSearchParams({
      path: SHEET_NAME,
      action: 'read',
    })
    const response = await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
    const data = await response.json()
    
    // Parse the data if it's in the expected format
    const products = Array.isArray(data.data) ? data.data.map((row: any) => ({
      id: row.id || row.ID || '',
      name: row.name || row.Name || '',
      description: row.description || row.Description || '',
      fullDescription: row.fullDescription || row.FullDescription || '',
      price: parseFloat(row.price || row.Price || '0'),
      image: row.image || row.Image || '',
      slug: row.slug || row.Slug || '',
      features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || [])
    })) : []
    
    return products
  } catch (error) {
    console.error('Failed to fetch from Google Sheets:', error)
    return []
  }
}

// GET all products
export async function GET(request: NextRequest) {
  try {
    const products = await fetchProductsFromSheet()
    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    
    // Generate ID and slug
    product.id = Date.now().toString()
    product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Save to Google Sheets
    if (GOOGLE_SHEET_URL) {
      try {
        const params = new URLSearchParams({
          path: SHEET_NAME,
          action: 'write',
          id: product.id,
          name: product.name,
          description: product.description,
          fullDescription: product.fullDescription || '',
          price: product.price.toString(),
          image: product.image,
          slug: product.slug,
          features: JSON.stringify(product.features || [])
        })
        await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
      } catch (sheetError) {
        console.error('Failed to save to Google Sheets:', sheetError)
      }
    }
    
    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT update product
export async function PUT(request: NextRequest) {
  try {
    const updatedProduct = await request.json()
    
    // Update in Google Sheets
    if (GOOGLE_SHEET_URL) {
      try {
        // Note: This requires updating your Google Apps Script to support update operations
        // For now, we'll re-add the updated product
        const params = new URLSearchParams({
          path: SHEET_NAME,
          action: 'update',
          id: updatedProduct.id,
          name: updatedProduct.name,
          description: updatedProduct.description,
          fullDescription: updatedProduct.fullDescription || '',
          price: updatedProduct.price.toString(),
          image: updatedProduct.image,
          slug: updatedProduct.slug,
          features: JSON.stringify(updatedProduct.features || [])
        })
        await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
      } catch (sheetError) {
        console.error('Failed to update in Google Sheets:', sheetError)
      }
    }
    
    return NextResponse.json({
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // Delete from Google Sheets
    if (GOOGLE_SHEET_URL) {
      try {
        // Note: This requires updating your Google Apps Script to support delete operations
        const params = new URLSearchParams({
          path: SHEET_NAME,
          action: 'delete',
          id: id || ''
        })
        await fetch(`${GOOGLE_SHEET_URL}?${params.toString()}`)
      } catch (sheetError) {
        console.error('Failed to delete from Google Sheets:', sheetError)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
