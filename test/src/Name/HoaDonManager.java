package Name;

import java.util.*;

public class HoaDonManager {
    private List<HoaDon> danhSach = new ArrayList<>();

    public void themHoaDon(HoaDon hd) {
        danhSach.add(hd);
    }

    public List<HoaDon> layTatCaHoaDon() {
        return new ArrayList<>(danhSach);
    }

    public boolean capNhatHoaDon(String ma, String ngay, int tongTien) {
        for (HoaDon hd : danhSach) {
            if (hd.getMa().equals(ma)) {
                hd.setNgay(ngay);
                hd.setTongTien(tongTien);
                return true;
            }
        }
        return false;
    }

    public HoaDon timHoaDonTheoMa(String ma) {
        for (HoaDon hd : danhSach) {
            if (hd.getMa().equals(ma)) {
                return hd;
            }
        }
        return null;
    }

    public boolean xoaHoaDon(String ma) {
        Iterator<HoaDon> it = danhSach.iterator();
        while (it.hasNext()) {
            HoaDon hd = it.next();
            if (hd.getMa().equals(ma)) {
                it.remove();
                return true;
            }
        }
        return false;
    }
}