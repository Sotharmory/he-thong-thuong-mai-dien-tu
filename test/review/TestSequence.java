public class TestSequence {
    public static void main(String[] args) {
        Sequence sequence = new Sequence(5);
        for (int i = 0; i < 5; i++) {
            sequence.add(i * 10);
        }

        Selector selector = sequence.selector();
        while (!selector.end()) {
            System.out.println(selector.current());
            selector.next();
        }
    }
}
