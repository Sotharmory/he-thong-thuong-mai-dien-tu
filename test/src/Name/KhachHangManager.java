package Name;
import java.util.ArrayList;
import java.util.List;

public class KhachHangManager {
    private List<KhachHang> danhSachKhachHang = new ArrayList<>();

    // Create
    public void themKhachHang(KhachHang kh) {
        danhSachKhachHang.add(kh);
    }

    // Read
    public List<KhachHang> layTatCaKhachHang() {
        return danhSachKhachHang;
    }

    public KhachHang timKhachHangTheoMa(String maKH) {
        for (KhachHang kh : danhSachKhachHang) {
            if (kh.getMaKhachHang().equals(maKH)) {
                return kh;
            }
        }
        return null;
    }

    // Update
    public boolean capNhatKhachHang(String maKH, String tenMoi, String diaChiMoi, String sdtMoi) {
        try {
            KhachHang kh = timKhachHangTheoMa(maKH);
            if (kh != null) {
                kh.setTenKhachHang(tenMoi);
                kh.setDiaChi(diaChiMoi);
                kh.setSoDienThoai(sdtMoi);
                return true;
            }
        } catch (Exception e) {
            System.out.println("Lỗi cập nhật khách hàng: " + e.getMessage());
        }
        return false;
    }

    // Delete
    public boolean xoaKhachHang(String maKH) {
        KhachHang kh = timKhachHangTheoMa(maKH);
        if (kh != null) {
            danhSachKhachHang.remove(kh);
            return true;
        }
        return false;
    }
    // Phương thức liệt kê khách hàng theo địa chỉ
    public void lietKeKhachHangTheoDiaChi(String diaChi) {
        try {
            System.out.println("Danh sách khách hàng ở địa chỉ: " + diaChi);
            for (KhachHang kh : danhSachKhachHang) {
                if (kh.getDiaChi().equalsIgnoreCase(diaChi)) {
                    System.out.println(kh);
                }
            }
        } catch (Exception e) {
            System.out.println("Lỗi liệt kê khách hàng theo địa chỉ: " + e.getMessage());
        }
    }
}