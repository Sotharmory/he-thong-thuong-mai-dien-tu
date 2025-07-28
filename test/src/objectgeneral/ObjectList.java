package objectgeneral;

import java.util.ArrayList;
import java.util.List;

public class ObjectList {
    private List<ObjectGeneral> list = new ArrayList<>();

    // Create
    public void create(ObjectGeneral obj) {
        try {
            list.add(obj);
        } catch (Exception e) {
            System.out.println("Lỗi thêm đối tượng: " + e.getMessage());
        }
    }

    // Read
    public List<ObjectGeneral> readAll() {
        try {
            return list;
        } catch (Exception e) {
            System.out.println("Lỗi đọc danh sách đối tượng: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Update
    public boolean update(int id, String newName) {
        try {
            for (ObjectGeneral obj : list) {
                if (obj.getId() == id) {
                    obj.setName(newName);
                    return true;
                }
            }
        } catch (Exception e) {
            System.out.println("Lỗi cập nhật đối tượng: " + e.getMessage());
        }
        return false;
    }

    // Delete
    public boolean delete(int id) {
        try {
            return list.removeIf(obj -> obj.getId() == id);
        } catch (Exception e) {
            System.out.println("Lỗi xóa đối tượng: " + e.getMessage());
            return false;
        }
    }
}
