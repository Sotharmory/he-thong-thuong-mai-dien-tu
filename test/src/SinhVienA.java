import java.util.ArrayList;
import java.util.Scanner;
import java.text.NumberFormat;
import java.util.Locale;

class SanPham {
    String tenSanPham;
    int soLuong;
    double donGia;

    public SanPham(String tenSanPham, int soLuong, double donGia) {
        this.tenSanPham = tenSanPham;
        this.soLuong = soLuong;
        this.donGia = donGia;
    }

    @Override
    public String toString() {
        try {
            NumberFormat currencyVN = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            return tenSanPham + ": " + soLuong + " x " + currencyVN.format(donGia);
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi hiển thị sản phẩm";
        } finally {
            // Không có tài nguyên cần đóng ở đây
        }
    }
}

class HoaDon {
    String tenKhachHang;
    String soDienThoai;
    ArrayList<SanPham> danhSachSanPham;

    public HoaDon(String tenKhachHang, String soDienThoai, ArrayList<SanPham> danhSachSanPham) {
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.danhSachSanPham = danhSachSanPham;
    }

    public double tinhTongTien() {
        double tong = 0;
        try {
            for (SanPham sp : danhSachSanPham) {
                tong += sp.soLuong * sp.donGia;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // Không có tài nguyên cần đóng ở đây
        }
        return tong;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        try {
            NumberFormat currencyVN = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            sb.append("Khách hàng: ").append(tenKhachHang).append("\n");
            sb.append("SĐT: ").append(soDienThoai).append("\n");
            sb.append("Danh sách sản phẩm:\n");
            for (SanPham sp : danhSachSanPham) {
                sb.append("- ").append(sp).append("\n");
            }
            sb.append("Tổng tiền: ").append(currencyVN.format(tinhTongTien())).append("\n");
        } catch (Exception e) {
            e.printStackTrace();
            sb.append("Lỗi khi hiển thị hóa đơn.\n");
        } finally {
            // Không có tài nguyên cần đóng ở đây
        }
        return sb.toString();
    }
}

public class SinhVienA {

    public static HoaDon nhapThongTinKhachHangVaSanPham() {
        Scanner scanner = null;
        HoaDon hoaDon = null;

        try {
            scanner = new Scanner(System.in);

            System.out.print("Nhập tên khách hàng: ");
            String tenKhachHang = scanner.nextLine();

            System.out.print("Nhập số điện thoại: ");
            String soDienThoai = scanner.nextLine();

            ArrayList<SanPham> danhSachSanPham = new ArrayList<>();
            int n = 0;

            while (true) {
                try {
                    System.out.print("Nhập số lượng sản phẩm: ");
                    n = Integer.parseInt(scanner.nextLine());
                    if (n <= 0) throw new NumberFormatException();
                    break;
                } catch (NumberFormatException e) {
                    System.out.println("Vui lòng nhập một số nguyên dương!");
                }
            }

            for (int i = 0; i < n; i++) {
                System.out.println("Sản phẩm #" + (i + 1));

                System.out.print("Tên sản phẩm: ");
                String ten = scanner.nextLine();

                int soLuong;
                while (true) {
                    try {
                        System.out.print("Số lượng: ");
                        soLuong = Integer.parseInt(scanner.nextLine());
                        if (soLuong <= 0) throw new NumberFormatException();
                        break;
                    } catch (NumberFormatException e) {
                        System.out.println("Vui lòng nhập số lượng hợp lệ (nguyên dương)!");
                    }
                }

                double donGia;
                while (true) {
                    try {
                        System.out.print("Đơn giá: ");
                        donGia = Double.parseDouble(scanner.nextLine());
                        if (donGia < 0) throw new NumberFormatException();
                        break;
                    } catch (NumberFormatException e) {
                        System.out.println("Vui lòng nhập đơn giá hợp lệ (số thực dương)!");
                    }
                }

                danhSachSanPham.add(new SanPham(ten, soLuong, donGia));
            }

            hoaDon = new HoaDon(tenKhachHang, soDienThoai, danhSachSanPham);
        } catch (Exception e) {
            System.out.println("Đã xảy ra lỗi trong quá trình nhập thông tin!");
            e.printStackTrace();
        } finally {
            if (scanner != null) {
                scanner.close();
            }
        }

        return hoaDon;
    }

    public static void main(String[] args) {
        try {
            HoaDon hoaDon = nhapThongTinKhachHangVaSanPham();

            System.out.println("\n--- Thông tin hóa đơn ---");
            if (hoaDon != null) {
                System.out.println(hoaDon);
            } else {
                System.out.println("Không thể hiển thị hóa đơn vì có lỗi xảy ra.");
            }
        } catch (Exception e) {
            System.out.println("Lỗi xảy ra trong quá trình chạy chương trình.");
            e.printStackTrace();
        } finally {
            System.out.println("Chương trình đã kết thúc.");
        }
    }
}
