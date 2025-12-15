# Updated Google Apps Script Setup Guide

## 🔄 What Changed

The updated script now supports **full CRUD operations** (Create, Read, Update, Delete) for all data types:

### New Features:
- ✅ **Multi-column write** - Write products, vouchers, orders with all fields
- ✅ **Update support** - Update existing rows by ID
- ✅ **Delete support** - Delete rows by ID
- ✅ **Flexible columns** - Works with any sheet structure

## 📝 Setup Instructions

### 1. Update Your Google Apps Script

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Replace the entire `Code.gs` content with `Code-Updated.gs`
4. Click **Save** (disk icon)
5. Click **Deploy → New Deployment**
   - Or **Deploy → Manage Deployments → Edit → Version: New Version**
6. **Important**: Make sure "Execute as" = **Me** and "Who has access" = **Anyone**
7. Click **Deploy**
8. Copy the new Web App URL

### 2. Create Sheet Structure

Create these sheets in your Google Spreadsheet:

#### **Products Sheet**
Add these headers in Row 1:
```
id | name | description | fullDescription | price | image | slug | features
```

#### **Vouchers Sheet**
Add these headers in Row 1:
```
id | code | discount | type | description | active
```

#### **Orders Sheet**
Add these headers in Row 1:
```
OrderID | Date | CustomerName | Email | Phone | Address | ProductID | ProductName | OriginalPrice | Discount | VoucherCode | FinalPrice
```

### 3. Update Your .env File

Update the `GOOGLE_SHEET_URL` with your new deployment URL:
```env
GOOGLE_SHEET_URL=https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec
```

## 🧪 Test the API

Test with these curl commands:

### Read Products:
```bash
curl "YOUR_SHEET_URL?path=Products&action=read"
```

### Write Product:
```bash
curl "YOUR_SHEET_URL?path=Products&action=write&id=1&name=Test&description=Demo&price=10&image=url&slug=test&features=feat1"
```

### Update Product:
```bash
curl "YOUR_SHEET_URL?path=Products&action=update&id=1&name=Updated"
```

### Delete Product:
```bash
curl "YOUR_SHEET_URL?path=Products&action=delete&id=1"
```

## 🔍 Troubleshooting

**Issue**: "Sheet not found"
- Make sure sheet names match exactly (case-sensitive): `Products`, `Vouchers`, `Orders`

**Issue**: "ID column not found"
- Make sure the first header is `id` or `ID`

**Issue**: Changes not showing
- Wait a few seconds for Google Sheets to sync
- Check the Execution log in Apps Script (View → Logs)

**Issue**: Authorization required
- Redeploy with "Who has access" = **Anyone**

## 🎯 How It Works

1. **Read**: Returns all rows as JSON
2. **Write**: Adds new row with all column data
3. **Update**: Finds row by ID and updates specified columns
4. **Delete**: Finds row by ID and removes it

All operations match column headers automatically!
