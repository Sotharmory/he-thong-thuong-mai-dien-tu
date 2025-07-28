package Name;

public class Sanphamtest {
    public static void main(String[] args) {
        // Tạo một đối tượng SanPham để kiểm tra
        SanPham sp = new SanPham("SP001", "Laptop", 15000000, 10);
        System.out.println("Test SanPham: " + sp.toString());

        // Kiểm tra setters
        sp.setGia(16000000);
        sp.setSoLuong(8);
        System.out.println("Sau khi thay đổi giá và số lượng: " + sp.toString());

        // Tạo một đối tượng KhachHang để kiểm tra
        KhachHang kh = new KhachHang("KH001", "Nguyen Van A", "123 Đường Láng, Hà Nội", "0901234567");
        System.out.println("Test KhachHang: " + kh.toString());

        // Tạo một đối tượng HoaDon để kiểm tra
        HoaDon hd = new HoaDon("HD001", "2025-05-11", 16000000);
        System.out.println("Test HoaDon: " + hd.toString());
    }
}