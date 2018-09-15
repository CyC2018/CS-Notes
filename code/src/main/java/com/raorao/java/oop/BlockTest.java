package com.raorao.java.oop;

/**
 * 块代码测试.
 *
 * @author Xiong Raorao
 * @since 2018-09-09-22:24
 */
public class BlockTest {

  public static void main(String[] args) {
    new B();
    System.out.println(A.a);
  }


}

class A {

  //public static final String a = new String("JD"); // this will call static block
  public static final String a = "JD"; // this won't call static block

  static {
    System.out.println("A static block");
  }

  {
    System.out.println("A block");
  }

  public A() {
    System.out.println("A constructor");
  }
}

class B extends A {

  static {
    System.out.println("B static block");
  }

  {
    System.out.println("B block");
  }

  public B() {
    System.out.println("B constructor");
  }
}
