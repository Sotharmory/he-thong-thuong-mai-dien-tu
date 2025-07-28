package objectgeneral;

public class ObjectGeneral {
    private int id;
    private String name;

    public ObjectGeneral(int id, String name) {
        try {
            this.id = id;
            this.name = name;
        } catch (Exception e) {
            System.out.println("Lỗi khởi tạo ObjectGeneral: " + e.getMessage());
        }
    }

    public int getId() {
        try {
            return id;
        } catch (Exception e) {
            System.out.println("Lỗi getId: " + e.getMessage());
            return -1;
        }
    }

    public void setId(int id) {
        try {
            this.id = id;
        } catch (Exception e) {
            System.out.println("Lỗi setId: " + e.getMessage());
        }
    }

    public String getName() {
        try {
            return name;
        } catch (Exception e) {
            System.out.println("Lỗi getName: " + e.getMessage());
            return null;
        }
    }

    public void setName(String name) {
        try {
            this.name = name;
        } catch (Exception e) {
            System.out.println("Lỗi setName: " + e.getMessage());
        }
    }

    @Override
    public String toString() {
        try {
            return "ObjectGeneral{id=" + id + ", name='" + name + "'}";
        } catch (Exception e) {
            System.out.println("Lỗi toString: " + e.getMessage());
            return "";
        }
    }
}
