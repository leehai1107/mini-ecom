# Mini E-Commerce Landing Page

A modern, SEO-optimized e-commerce landing page built with **Next.js 14**, **Tailwind CSS**, and integrated with **Google Sheets** as a backend. Features include product showcase, voucher/discount system, and automated email notifications.

## 🚀 Features

- ✅ **SEO Optimized** - Next.js 14 App Router with metadata API
- 🎨 **Beautiful UI** - Tailwind CSS with responsive design
- 🛒 **Product Pages** - Dynamic product routes with detailed information
- 🎫 **Voucher System** - Apply discount codes at checkout
- 📧 **Email Notifications** - Automated emails to buyers and admin
- 📊 **Google Sheets Backend** - Store orders, products, and vouchers
- ⚡ **Fast Performance** - Server-side rendering and optimized images

## 📋 Prerequisites

- Node.js 18+ installed
- Gmail account (or other SMTP email provider)
- Google Sheets with Apps Script deployed (see reference in `ref/` folder)

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in `.env`:**

   ```env
   # Google Sheets API (from your Apps Script deployment)
   GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   SHEET_NAME_ORDERS=Orders
   SHEET_NAME_PRODUCTS=Products
   SHEET_NAME_VOUCHERS=Vouchers

   # Email Configuration (Gmail SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ADMIN_EMAIL=admin@yourstore.com

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=Mini E-Commerce Store
   NEXT_PUBLIC_CURRENCY=USD
   ```

## 📧 Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a password for "Mail" and "Windows Computer"
   - Use this password in `EMAIL_PASSWORD`

## 📊 Google Sheets Setup

### 1. Create Three Sheets

Create a Google Spreadsheet with these sheets:

#### **Orders Sheet**
Headers: `OrderID | Date | CustomerName | Email | Phone | Address | ProductID | ProductName | OriginalPrice | Discount | VoucherCode | FinalPrice`

#### **Products Sheet** (Optional)
Headers: `id | name | description | price | image | slug`

Example data:
```
1 | Premium Headphones | High-quality audio | 299.99 | https://... | premium-headphones
```

#### **Vouchers Sheet** (Optional)
Headers: `code | discount | type | description`

Example data:
```
WELCOME10 | 10 | percentage | First-time customers
SAVE20 | 20 | percentage | Orders over $200
FREESHIP | 0 | shipping | Free shipping
```

### 2. Deploy Apps Script

1. In Google Sheets: Extensions → Apps Script
2. Copy the code from `ref/Code.gs`
3. Update line 70 to match your Orders sheet headers
4. Deploy → New Deployment → Web app
5. Set access to "Anyone"
6. Copy the deployment URL to `GOOGLE_SHEET_URL`

## 🚀 Running the Application

### Development mode:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production build:
```bash
npm run build
npm start
```

## 📁 Project Structure

```
mini-ecom/
├── app/
│   ├── api/
│   │   ├── order/route.ts       # Order processing & emails
│   │   ├── products/route.ts    # Fetch products from Sheets
│   │   └── voucher/route.ts     # Validate voucher codes
│   ├── product/[slug]/page.tsx  # Dynamic product pages
│   ├── layout.tsx               # Root layout with SEO
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Tailwind styles
├── components/
│   ├── ProductCard.tsx          # Product card component
│   ├── VoucherBanner.tsx        # Voucher display
│   └── OrderForm.tsx            # Checkout form
├── ref/
│   ├── Code.gs                  # Google Apps Script
│   └── Guide.md                 # Setup instructions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Customization

### Update Products

Edit the `products` array in [app/page.tsx](app/page.tsx) or fetch from Google Sheets using the API.

### Update Vouchers

Edit the voucher codes in [components/VoucherBanner.tsx](components/VoucherBanner.tsx) or manage via Google Sheets.

### Styling

All styles use **Tailwind CSS**. Customize colors in [tailwind.config.ts](tailwind.config.ts):

```typescript
colors: {
  primary: '#0070f3',    // Change to your brand color
  secondary: '#7928ca',
}
```

## 📧 Email Templates

Email templates are in [app/api/order/route.ts](app/api/order/route.ts). They include:
- Customer confirmation email with order details
- Admin notification email with customer info

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use App Passwords for Gmail (not your main password)
- Consider implementing rate limiting for API routes
- Validate all user inputs on the server side

## 🌐 SEO Features

- Server-side rendering with Next.js 14
- Dynamic metadata for each product page
- Semantic HTML structure
- Open Graph tags for social sharing
- Mobile-responsive design
- Fast page load times

## 🐛 Troubleshooting

**Emails not sending:**
- Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD
- Verify App Password is correct (for Gmail)
- Check spam folder

**Google Sheets not saving:**
- Verify GOOGLE_SHEET_URL is correct
- Ensure Apps Script is deployed as "Anyone" access
- Check sheet names match environment variables

**Vouchers not working:**
- Verify voucher codes match exactly (case-sensitive)
- Check Vouchers sheet structure

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Support

For issues or questions, create an issue in the repository or contact support.

## 🎯 Next Steps

- [ ] Add payment gateway integration (Stripe, PayPal)
- [ ] Implement user authentication
- [ ] Add product inventory management
- [ ] Create admin dashboard
- [ ] Add product reviews and ratings
- [ ] Implement search functionality

---

Built with ❤️ using Next.js, Tailwind CSS, and Google Sheets
