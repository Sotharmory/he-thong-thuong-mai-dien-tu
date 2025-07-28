import java.io.FileWriter;
import java.io.IOException;

public class SinhVienC {
    /**
     * Lưu và in hóa đơn ra màn hình, đồng thời ghi vào file hoadon.txt
     * @param hoaDon Đối tượng hóa đơn
     * @param tongTienCuoiCung Tổng tiền cuối cùng sau giảm giá và thuế
     */
    public static void luuVaInHoaDon(HoaDon hoaDon, double tongTienCuoiCung) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n===== HÓA ĐƠN =====\n");
        sb.append("Khách hàng: ").append(hoaDon.tenKhachHang).append("\n");
        sb.append("SĐT: ").append(hoaDon.soDienThoai).append("\n");
        sb.append("Danh sách sản phẩm:\n");
        for (SanPham sp : hoaDon.danhSachSanPham) {
            sb.append("- ").append(sp.tenSanPham)
              .append(": ").append(sp.soLuong)
              .append(" x ").append(String.format("%.0f", sp.donGia)).append(" VND\n");
        }
        sb.append("Tổng tiền thanh toán: ").append(String.format("%.0f", tongTienCuoiCung)).append(" VND\n");

        // In ra màn hình
        System.out.print(sb);

        // Lưu vào file
        try (FileWriter fw = new FileWriter("hoadon.txt")) {
            fw.write(sb.toString());
            System.out.println("Đã lưu hóa đơn vào file 'hoadon.txt'");
        } catch (IOException e) {
            System.out.println("Lỗi khi lưu file: " + e.getMessage());
        }
    }
}