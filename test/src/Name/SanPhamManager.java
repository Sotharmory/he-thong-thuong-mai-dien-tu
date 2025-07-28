package Name;
import java.util.ArrayList;
import java.util.List;

public class SanPhamManager {
    private List<SanPham> danhSachSanPham = new ArrayList<>();

    // Create
    public void themSanPham(SanPham sp) {
        if (sp != null) {
            danhSachSanPham.add(sp);
        }
    }

    // Read
    public List<SanPham> layTatCaSanPham() {
        return new ArrayList<>(danhSachSanPham); // Trả về bản sao để tránh bị sửa ngoài ý muốn
    }

    public SanPham timSanPhamTheoMa(String maSP) {
        if (maSP == null) return null;
        for (SanPham sp : danhSachSanPham) {
            if (sp.getMaSanPham().equals(maSP)) {
                return sp;
            }
        }
        return null;
    }

    // Update
    public boolean capNhatSanPham(String maSP, String tenMoi, double giaMoi, int soLuongMoi) {
        SanPham sp = timSanPhamTheoMa(maSP);
        if (sp != null) {
            sp.setTenSanPham(tenMoi);
            sp.setGia(giaMoi);
            sp.setSoLuong(soLuongMoi);
            return true;
        }
        return false;
    }

    // Delete
    public boolean xoaSanPham(String maSP) {
        SanPham sp = timSanPhamTheoMa(maSP);
        if (sp != null) {
            danhSachSanPham.remove(sp);
            return true;
        }
        return false;
    }
}