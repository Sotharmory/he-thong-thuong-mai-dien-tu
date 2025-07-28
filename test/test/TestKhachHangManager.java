import Name.KhachHangManager;
import Name.KhachHang;

public class TestKhachHangManager {
    public static void main(String[] args) {
        KhachHangManager manager = new KhachHangManager();

        // Test Create
        KhachHang kh1 = new KhachHang("KH01", "Nguyen Van A", "Ha Noi", "0901234567");
        KhachHang kh2 = new KhachHang("KH02", "Tran Thi B", "Hai Phong", "0912345678");
        KhachHang kh3 = new KhachHang("KH03", "Le Van C", "Hai Phong", "0923456789");
        manager.themKhachHang(kh1);
        manager.themKhachHang(kh2);
        manager.themKhachHang(kh3);
        System.out.println("Đã thêm khách hàng thành công!");
        System.out.println("Danh sách khách hàng hiện tại:");

        // Test Read
        System.out.println("Danh sách khách hàng:");
        for (KhachHang kh : manager.layTatCaKhachHang()) {
            System.out.println(kh);
        }

        // Test Update
        boolean updated = manager.capNhatKhachHang("KH01", "Nguyen Van C", "Ha Noi", "0987654321");
        System.out.println("\nCập nhật khách hàng KH01: " + (updated ? "Thành công" : "Thất bại"));
        System.out.println(manager.timKhachHangTheoMa("KH01"));

        // Test Delete
        boolean deleted = manager.xoaKhachHang("KH02");
        System.out.println("\nXóa khách hàng KH02: " + (deleted ? "Thành công" : "Thất bại"));
        System.out.println("Danh sách khách hàng sau khi xóa:");
        for (KhachHang kh : manager.layTatCaKhachHang()) {
            System.out.println(kh);
        }

        // Test liệt kê khách hàng theo địa chỉ
        System.out.println("\nLiệt kê khách hàng:");
        manager.lietKeKhachHangTheoDiaChi("Ha Noi");
        manager.lietKeKhachHangTheoDiaChi("Hai Phong");
    }
}
