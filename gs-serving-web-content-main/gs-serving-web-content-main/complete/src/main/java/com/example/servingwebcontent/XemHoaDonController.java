package com.example.servingwebcontent;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileWriter;
import java.io.IOException;

@Controller
public class XemHoaDonController {
    @PostMapping("/xem-hoadon")
    public String xemHoaDon(@ModelAttribute HoaDon hoaDon, @RequestParam double tongCuoiCung, Model model) {
        StringBuilder sb = new StringBuilder();
        sb.append("===== HÓA ĐƠN =====\n");
        sb.append("Khách hàng: ").append(hoaDon.getTenKhachHang()).append("\n");
        sb.append("SĐT: ").append(hoaDon.getSoDienThoai()).append("\n");
        for (SanPham sp : hoaDon.getDanhSachSanPham()) {
            sb.append("- ").append(sp.getTenSanPham())
              .append(": ").append(sp.getSoLuong())
              .append(" x ").append(sp.getDonGia()).append(" VND\n");
        }
        sb.append("Tổng tiền thanh toán: ").append(tongCuoiCung).append(" VND\n");

        try (FileWriter writer = new FileWriter("hoadon.txt")) {
            writer.write(sb.toString());
        } catch (IOException e) {
            System.out.println("Lỗi khi ghi file: " + e.getMessage());
        }

        model.addAttribute("hoaDonText", sb.toString());
        return "xem-hoadon";
    }
}

