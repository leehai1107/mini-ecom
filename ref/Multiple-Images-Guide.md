# 📸 Hướng Dẫn Thêm Nhiều Ảnh Cho Sản Phẩm

## 🎯 Cách Hoạt Động

Bạn có thể thêm **nhiều ảnh** cho một sản phẩm bằng cách nhập nhiều URL ảnh vào cột `image` trong Google Sheets, **ngăn cách bởi dấu phẩy**.

---

## 📝 Cách Sử Dụng Trong Google Sheets

### Cột `image` trong sheet **Products**:

#### ✅ Một Ảnh (như cũ):
```
https://example.com/image1.jpg
```

#### ✅ Nhiều Ảnh (mới):
```
https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg
```

### Ví Dụ Thực Tế:

| id | name | description | price | image | slug |
|----|------|-------------|-------|-------|------|
| 1 | Bàn Gỗ | Bàn gỗ cao cấp | 5000000 | https://i.imgur.com/abc.jpg, https://i.imgur.com/def.jpg, https://i.imgur.com/ghi.jpg | ban-go |

---

## 🎨 Hiển Thị

### Trên Trang Chủ:
- Hiển thị **ảnh đầu tiên** trong danh sách

### Trên Trang Sản Phẩm:
- **Gallery với các tính năng:**
  - ✨ Ảnh lớn với nút Previous/Next
  - 🖼️ Thumbnails ở dưới để chọn nhanh
  - 📱 Responsive trên mọi thiết bị
  - 🔢 Hiển thị số thứ tự ảnh (1/3, 2/3, ...)

---

## 💡 Tips

### 1. Định Dạng URL
- ✅ **Đúng**: `https://i.imgur.com/abc.jpg, https://i.imgur.com/def.jpg`
- ❌ **Sai**: `https://i.imgur.com/abc.jpg,https://i.imgur.com/def.jpg` (không có khoảng trắng)
- ⚠️ **Chấp nhận được** nhưng không đẹp: thêm hoặc bỏ khoảng trắng sau dấu phẩy đều ok

### 2. Số Lượng Ảnh
- Không giới hạn số lượng
- Khuyến nghị: **3-5 ảnh** cho mỗi sản phẩm
- Quá nhiều ảnh có thể làm chậm trang

### 3. Nguồn Ảnh
- Upload lên **Google Drive** (dùng link share)
- Upload lên **Imgur** (miễn phí)
- Dùng URL từ website khác (cẩn thận hotlink)

### 4. Kích Thước Ảnh
- Khuyến nghị: **800x800px** đến **1200x1200px**
- Format: JPG, PNG, WebP
- Tối ưu dung lượng: < 500KB mỗi ảnh

---

## 🔧 Google Drive Images

Nếu dùng Google Drive, dùng format sau:

### URL Gốc từ Drive:
```
https://drive.google.com/file/d/1ABC123DEF/view?usp=sharing
```

### Chuyển sang Direct Link:
```
https://drive.google.com/uc?export=view&id=1ABC123DEF
```

### Trong Google Sheets (nhiều ảnh Drive):
```
https://drive.google.com/uc?export=view&id=1ABC123, https://drive.google.com/uc?export=view&id=1DEF456, https://drive.google.com/uc?export=view&id=1GHI789
```

---

## 🧪 Test

### 1. Thêm Sản Phẩm Mẫu
Trong Google Sheets, thêm dòng:
```
id: test123
name: Test Multiple Images
description: Testing
price: 100000
image: https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800, https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800, https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800
slug: test-multiple-images
```

### 2. Kiểm Tra
- Vào trang chủ → thấy sản phẩm với ảnh đầu tiên
- Click vào sản phẩm → thấy gallery với 3 ảnh
- Test nút Previous/Next
- Test click thumbnails

---

## 🆘 Troubleshooting

### Không Thấy Ảnh Thứ 2, 3...?
- ✅ Check có dấu phẩy ngăn cách không
- ✅ Check URL có đúng không (mở trực tiếp xem có load được)
- ✅ Clear browser cache và reload

### Ảnh Bị Lỗi?
- ✅ Check URL có public không (đặc biệt với Google Drive)
- ✅ Check format link Google Drive (phải dùng `uc?export=view&id=`)
- ✅ Thử mở URL trực tiếp trong tab mới

### Gallery Không Hoạt Động?
- ✅ Check console browser (F12) xem có lỗi JS không
- ✅ Đảm bảo có ít nhất 2 ảnh để hiện nút Previous/Next
- ✅ Restart dev server (`npm run dev`)

---

## 📞 Liên Hệ

Nếu cần hỗ trợ, cung cấp:
1. Screenshot Google Sheets (cột image)
2. Screenshot lỗi (nếu có)
3. URL sản phẩm bị lỗi
