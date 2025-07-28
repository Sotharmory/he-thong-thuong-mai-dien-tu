package com.example.servingwebcontent;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class NhapThongTinController {
    @GetMapping("/nhap")
    public String hienForm(Model model) {
        HoaDon hoaDon = new HoaDon();
        model.addAttribute("hoaDon", hoaDon);
        return "nhap";
    }

    @PostMapping("/nhap")
    public String xuLyForm(@ModelAttribute HoaDon hoaDon, Model model) {
        model.addAttribute("hoaDon", hoaDon);
        return "redirect:/tinh-tien";
    }
}
