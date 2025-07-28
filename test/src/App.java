public class App {
    public static void main(String[] args) {
        System.out.println("=== CHƯƠNG TRÌNH QUẢN LÝ HÓA ĐƠN ===");

        try {
            // A: Nhập thông tin khách hàng và sản phẩm
            HoaDon hoaDon = SinhVienA.nhapThongTinKhachHangVaSanPham();

            // B: Tính tổng tiền thanh toán
            double tongTienPhaiTra = SinhVienB.tinhTongTien(hoaDon.danhSachSanPham);

            // C: Lưu và in hóa đơn
            SinhVienC.luuVaInHoaDon(hoaDon, tongTienPhaiTra);

        } catch (Exception e) {
            System.out.println("❌ Đã xảy ra lỗi: " + e.getMessage());
            e.printStackTrace();
        } finally {
            System.out.println("=== Chương trình kết thúc. ===");
        }
    }
}
