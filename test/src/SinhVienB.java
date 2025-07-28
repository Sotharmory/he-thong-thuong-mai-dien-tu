import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Locale;

public class SinhVienB {
    /**
     * Tính tổng tiền phải trả cho danh sách sản phẩm, bao gồm giảm giá và thuế VAT.
     * @param danhSachSanPham Danh sách sản phẩm trong hóa đơn
     * @return Tổng tiền cuối cùng sau khi áp dụng giảm giá và thuế
     */
    public static double tinhTongTien(ArrayList<SanPham> danhSachSanPham) {
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        
        double tongGoc = 0;
        for (SanPham sp : danhSachSanPham) {
            tongGoc += sp.soLuong * sp.donGia;
        }

        double giamGia = (tongGoc > 500_000) ? tongGoc * 0.05 : 0;
        double thueVAT = (tongGoc - giamGia) * 0.10;
        double tongCuoiCung = tongGoc - giamGia + thueVAT;

        // In thông tin chi tiết
        System.out.println("\n=== CHI TIẾT TÍNH TOÁN ===");
        System.out.println("Tổng tiền gốc: " + currencyFormat.format(tongGoc));
        System.out.println("Giảm giá (5% nếu > 500.000đ): " + currencyFormat.format(giamGia));
        System.out.println("Thuế VAT (10%): " + currencyFormat.format(thueVAT));
        System.out.println("=> Tổng tiền phải trả: " + currencyFormat.format(tongCuoiCung));

        return tongCuoiCung;
    }
}
