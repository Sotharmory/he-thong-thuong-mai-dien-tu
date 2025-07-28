package objectgeneral;

public class TestObjectList {
    public static void main(String[] args) {
        try {
            ObjectList list = new ObjectList();

            // Create
            ObjectGeneral obj1 = new ObjectGeneral(1, "SanPham");
            ObjectGeneral obj2 = new ObjectGeneral(2, "KhachHang");
            ObjectGeneral obj3 = new ObjectGeneral(3, "HoaDon");
            list.create(obj1);
            list.create(obj2);
            list.create(obj3);

            // Read
            System.out.println("Danh sách đối tượng:");
            for (ObjectGeneral obj : list.readAll()) {
                System.out.println(obj);
            }

            // Update
            boolean updated = list.update(1, "SanPhamMoi");
            System.out.println("\nCập nhật id=1: " + (updated ? "Thành công" : "Thất bại"));
            System.out.println(list.readAll().get(0));

            // Delete
            boolean deleted = list.delete(2);
            System.out.println("\nXóa id=2: " + (deleted ? "Thành công" : "Thất bại"));
            System.out.println("Danh sách sau khi xóa:");
            for (ObjectGeneral obj : list.readAll()) {
                System.out.println(obj);
            }
        } catch (Exception e) {
            System.out.println("Đã xảy ra lỗi: " + e.getMessage());
            e.printStackTrace();
        }
    }
}