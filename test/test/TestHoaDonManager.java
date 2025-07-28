import Name.HoaDon;
import Name.HoaDonManager;

public class TestHoaDonManager {
    public static void main(String[] args) {
        try {
            HoaDonManager manager = new HoaDonManager();

            // Test Create
            HoaDon hd1 = new HoaDon("HD01", "2024-05-30", 100000);
            HoaDon hd2 = new HoaDon("HD02", "2024-06-01", 200000);
            manager.themHoaDon(hd1);
            manager.themHoaDon(hd2);

            // Test Read
            System.out.println("Danh sách hóa đơn:");
            for (HoaDon hd : manager.layTatCaHoaDon()) {
                System.out.println(hd);
            }

            // Test Update
            boolean updated = manager.capNhatHoaDon("HD01", "2024-06-02", 150000);
            System.out.println("\nCập nhật hóa đơn HD01: " + (updated ? "Thành công" : "Thất bại"));
            System.out.println(manager.timHoaDonTheoMa("HD01"));

            // Test Delete
            boolean deleted = manager.xoaHoaDon("HD02");
            System.out.println("\nXóa hóa đơn HD02: " + (deleted ? "Thành công" : "Thất bại"));
            System.out.println("Danh sách hóa đơn sau khi xóa:");
            for (HoaDon hd : manager.layTatCaHoaDon()) {
                System.out.println(hd);
            }
        } catch (Exception e) {
            System.out.println("Đã xảy ra lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }
}