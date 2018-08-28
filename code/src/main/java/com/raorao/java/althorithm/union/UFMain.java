package com.raorao.java.althorithm.union;

/**
 * 并查集测试.
 *
 * @author Xiong Raorao
 * @since 2018-08-27-9:55
 */
public class UFMain {

  public static void main(String[] args) {
    UF uf = new QuickFindUF(10);
    uf.union(1, 2);
    uf.union(3, 4);
    uf.union(0, 9);
    uf.union(4, 7);
    uf.union(6, 5);
    uf.union(5, 8);
    uf.union(3, 9);
    uf.union(1, 8);

    System.out.println(uf.find(0));     // 9
    System.out.println(uf.find(1));     // 5
    System.out.println(uf.find(2));     // 5
    System.out.println(uf.find(3));     // 9
    System.out.println(uf.find(4));     // 9
    System.out.println(uf.find(5));     // 5
    System.out.println(uf.find(6));     // 5
    System.out.println(uf.find(7));     // 9
    System.out.println(uf.find(8));     // 5
    System.out.println(uf.find(9));     // 9
  }
}
