package com.raorao;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-02-16:46
 */
public class Test {

  private int a;

  public static void main(String[] args) {
    //System.out.println(foo());
    int r = new Test().foo();
    System.out.println(r);
  }

  public int foo() {
    try {
      System.out.println("sadfasdfasdf");
      return a;
    } catch (Exception e) {
      e.printStackTrace();
      return 3;
    } finally {
      System.out.println("finally: " + ++a);
      return a;
    }
  }
}
