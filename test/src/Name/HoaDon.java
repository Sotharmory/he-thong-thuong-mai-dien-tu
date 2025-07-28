package Name;
public class HoaDon {
    private String ma;
    private String ngay;
    private int tongTien;

    public HoaDon(String ma, String ngay, int tongTien) {
        this.ma = ma;
        this.ngay = ngay;
        this.tongTien = tongTien;
    }

    public String getMa() { return ma; }
    public String getNgay() { return ngay; }
    public int getTongTien() { return tongTien; }

    public void setNgay(String ngay) { this.ngay = ngay; }
    public void setTongTien(int tongTien) { this.tongTien = tongTien; }

    @Override
    public String toString() {
        return "HoaDon{" +
                "ma='" + ma + '\'' +
                ", ngay='" + ngay + '\'' +
                ", tongTien=" + tongTien +
                '}';
    }
}