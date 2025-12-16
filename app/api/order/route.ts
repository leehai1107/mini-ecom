import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Send email to customer
async function sendCustomerEmail(orderData: any) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: orderData.email,
    subject: `Order Confirmation - ${orderData.productName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0070f3 0%, #7928ca 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; color: #0070f3; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your purchase</p>
          </div>
          <div class="content">
            <p>Hi ${orderData.name},</p>
            <p>Your order has been successfully placed. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order Summary</h3>
              <div class="detail-row">
                <span>Product:</span>
                <span><strong>${orderData.productName}</strong></span>
              </div>
              <div class="detail-row">
                <span>Original Price:</span>
                <span>$${orderData.originalPrice.toFixed(2)}</span>
              </div>
              ${orderData.discount > 0 ? `
              <div class="detail-row" style="color: #22c55e;">
                <span>Discount (${orderData.voucherCode}):</span>
                <span>-$${(orderData.originalPrice - orderData.finalPrice).toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="detail-row total">
                <span>Total Paid:</span>
                <span>$${orderData.finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div class="order-details">
              <h3>Shipping Information</h3>
              <p><strong>Name:</strong> ${orderData.name}</p>
              <p><strong>Email:</strong> ${orderData.email}</p>
              <p><strong>Phone:</strong> ${orderData.phone}</p>
              <p><strong>Address:</strong><br>${orderData.address.replace(/\n/g, '<br>')}</p>
            </div>

            <p>We'll send you another email when your order ships.</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            
            <p>Best regards,<br><strong>Mini E-Commerce Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Mini E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}

// Send email to admin
async function sendAdminEmail(orderData: any) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order: ${orderData.productName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0070f3; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🛍️ New Order Received</h2>
          </div>
          <div class="content">
            <div class="order-details">
              <h3>Order Details</h3>
              <div class="detail-row"><strong>Product:</strong> ${orderData.productName}</div>
              <div class="detail-row"><strong>Product ID:</strong> ${orderData.productId}</div>
              <div class="detail-row"><strong>Price:</strong> $${orderData.originalPrice.toFixed(2)}</div>
              <div class="detail-row"><strong>Discount:</strong> ${orderData.discount}% ${orderData.voucherCode ? `(${orderData.voucherCode})` : ''}</div>
              <div class="detail-row"><strong>Final Price:</strong> $${orderData.finalPrice.toFixed(2)}</div>
              <div class="detail-row"><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleString()}</div>
            </div>

            <div class="order-details">
              <h3>Customer Information</h3>
              <div class="detail-row"><strong>Name:</strong> ${orderData.name}</div>
              <div class="detail-row"><strong>Email:</strong> ${orderData.email}</div>
              <div class="detail-row"><strong>Phone:</strong> ${orderData.phone}</div>
              <div class="detail-row"><strong>Shipping Address:</strong><br>${orderData.address.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}

// Save to Google Sheets
async function saveToGoogleSheets(orderData: any) {
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL
  const sheetName = process.env.SHEET_NAME_ORDERS || 'Orders'

  if (!googleSheetUrl) {
    console.warn('Google Sheets URL not configured')
    return
  }

  // Format data for Google Sheets
  const params = new URLSearchParams({
    path: sheetName,
    action: 'write',
    OrderID: `ORD-${Date.now()}`,
    Date: new Date(orderData.orderDate).toLocaleString(),
    CustomerName: orderData.name,
    Email: orderData.email,
    Phone: orderData.phone,
    Address: orderData.address,
    ProductID: orderData.productId,
    ProductName: orderData.productName,
    OriginalPrice: orderData.originalPrice.toString(),
    Discount: orderData.discount.toString(),
    VoucherCode: orderData.voucherCode || 'None',
    FinalPrice: orderData.finalPrice.toString(),
  })

  const response = await fetch(`${googleSheetUrl}?${params.toString()}`)
  return response.text()
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validate required fields
    if (!orderData.name || !orderData.email || !orderData.phone || !orderData.address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Store order in admin system
    const orderId = `ORD-${Date.now()}`
    const orderWithId = { ...orderData, orderId }

    // Send emails
    try {
      await Promise.all([
        sendCustomerEmail(orderData),
        sendAdminEmail(orderData),
      ])
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue even if email fails
    }

    // Save to Google Sheets
    try {
      await saveToGoogleSheets(orderData)
    } catch (sheetError) {
      console.error('Google Sheets error:', sheetError)
      // Continue even if sheet save fails
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderId,
    })
  } catch (error) {
    console.error('Order processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    )
  }
}
