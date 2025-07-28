package com.example.servingwebcontent;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class TinhTienController {
    @PostMapping("/tinh-tien")
    public String tinhTien(@ModelAttribute HoaDon hoaDon, Model model) {
        double tongGoc = 0;
        for (SanPham sp : hoaDon.getDanhSachSanPham()) {
            tongGoc += sp.getSoLuong() * sp.getDonGia();
        }

        double giamGia = (tongGoc > 500000) ? tongGoc * 0.05 : 0;
        double thueVAT = (tongGoc - giamGia) * 0.10;
        double tongCuoiCung = tongGoc - giamGia + thueVAT;

        model.addAttribute("hoaDon", hoaDon);
        model.addAttribute("tongGoc", tongGoc);
        model.addAttribute("giamGia", giamGia);
        model.addAttribute("thueVAT", thueVAT);
        model.addAttribute("tongCuoiCung", tongCuoiCung);

        return "tinh-tien";
    }
}
