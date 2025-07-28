# **HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ**

**Tác giả:** Nguyễn Thái Sơn

## **1. GIỚI THIỆU**
Dự án hệ thống thương mại điện tử hoàn chỉnh theo kiến trúc microservices được phát triển bởi Nguyễn Thái Sơn, bao gồm:

* Trang Quản Trị (Angular)
* API Backend (Java Spring Boot + MongoDB)
* Giao Diện Người Dùng (HTML/CSS/JS)Bootstrap 5

## **2. KIẾN TRÚC HỆ THỐNG**
Tách biệt frontend và backend theo mô hình microservices.

## **3. THÀNH PHẦN HỆ THỐNG**

### **3.1 Trang Quản Trị (/admin-website)**
* Quản lý sản phẩm, danh mục, đơn hàng, mã giảm giá
* Dashboard thống kê, hỗ trợ khách hàng
* Công nghệ: Angular 20.0.4, SCSS

### **3.2 API Backend (/backend-mongodb)**
* REST API quản lý sản phẩm và danh mục
* Xác thực, phân quyền, tìm kiếm, lọc, tải file
* Công nghệ: Java 17, Spring Boot 3.2.0, MongoDB, Maven

### **3.3 Giao Diện Người Dùng (/Web-user)**
* Tìm kiếm sản phẩm, giỏ hàng, đặt hàng
* Responsive trên mọi thiết bị
* Công nghệ: HTML5, CSS3, JavaScript, Bootstrap 5

## **4. YÊU CẦU HỆ THỐNG**
* Angular
* Java 17+, Maven 3.6+
* MongoDB 4.4+
* Trình duyệt hiện đại

## **5. CÀI ĐẶT & CHẠY HỆ THỐNG**

### **CÀI ĐẶT MONGODB**
```bash
# Ubuntu
sudo apt update && sudo apt install mongodb
# macOS
brew install mongodb-community
```

### **KHỞI ĐỘNG MONGODB**
```bash
sudo systemctl start mongod
# hoặc
mongod
```

### **CHẠY BACKEND API**
```bash
cd backend-mongodb
mvn clean install
mvn spring-boot:run
```
Truy cập: [http://localhost:8081/api](http://localhost:8081/api)

### **CHẠY TRANG QUẢN TRỊ**
```bash
cd admin-website
npm install
ng serve
```
Truy cập: [http://localhost:4200](http://localhost:4200)

### **CHẠY GIAO DIỆN NGƯỜI DÙNG**
```bash
cd Web-user
python -m http.server 8000
```

## **6. SCRIPTS HỖ TRỢ**
* start-dev.bat (Windows)
* start-dev.sh (Linux/macOS)

## **7. CẤU HÌNH**
File: `application.properties`
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/admin_db
server.port=8081
server.servlet.context-path=/api
```

## **8. API ENDPOINTS**

### **CATEGORIES**
| METHOD | ENDPOINT                | MÔ TẢ |
|--------|-------------------------|--------|
| GET     | /categories              | Lấy tất cả danh mục |
| GET     | /categories/active       | Danh mục đang hoạt động |
| GET     | /categories/{id}         | Lấy theo ID |
| POST    | /categories              | Tạo mới |
| PUT     | /categories/{id}         | Cập nhật |
| DELETE  | /categories/{id}         | Xóa |
| PATCH   | /categories/{id}/toggle-status | Bật/tắt trạng thái |

### **PRODUCTS**
| METHOD | ENDPOINT               | MÔ TẢ |
|--------|------------------------|--------|
| GET     | /products                | Lấy tất cả sản phẩm |
| GET     | /products/active         | Sản phẩm đang hoạt động |
| GET     | /products/{id}           | Lấy theo ID |
| POST    | /products                | Tạo mới |
| PUT     | /products/{id}           | Cập nhật |
| DELETE  | /products/{id}           | Xóa |
| PATCH   | /products/{id}/toggle-status | Bật/tắt trạng thái |

### **PRODUCT VARIANTS**
| METHOD | ENDPOINT                                 | MÔ TẢ |
|--------|------------------------------------------|--------|
| POST    | /products/{productId}/variants             | Thêm variant |
| PUT     | /products/{productId}/variants/{variantId} | Cập nhật |
| DELETE  | /products/{productId}/variants/{variantId} | Xóa |

## **9. MÔ HÌNH DỮ LIỆU**

### **CATEGORY**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "active": true,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### **PRODUCT**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 100,
  "sku": "sku123",
  "active": true,
  "imageUrl": "string",
  "categoryIds": ["cat1", "cat2"],
  "variants": [...],
  "tags": [...],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### **ORDER**
```json
{
  "id": "string",
  "customer": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "items": [...],
  "status": "pending",
  "total": 300,
  "author": "Sơn"
}
```

## **10. TÍNH NĂNG NỔI BẬT**
* Hỗ trợ nhiều danh mục / sản phẩm
* Biến thể sản phẩm: giá phụ, tồn kho riêng
* Tags linh hoạt: màu sắc, nổi bật, giảm giá
* Tự tạo dữ liệu mẫu lần đầu chạy
* Cấu hình CORS cho Angular (localhost:4200)

## **11. KHẮC PHỤC SỰ CỐ**

### **MongoDB:**
* Đảm bảo dịch vụ đang chạy: `systemctl status mongod`
* Kiểm tra chuỗi kết nối MongoDB

### **Cổng trùng:**
* Đổi `server.port` trong `application.properties`

### **Lỗi CORS:**
* Đảm bảo frontend đang chạy tại `http://localhost:4200`
* Cập nhật `CorsConfig.java` nếu cần
