package com.raorao.java.base;

/**
 * String 类的Intern方法测试.
 *
 * 说明：Intern方法可以将堆区的String放到常量池中，最终返回的是常量池中的String
 *
 * @author Xiong Raorao
 * @since 2018-09-10-10:14
 */
public class InternTest {

  public static void main(String[] args) {
    String a = "hello";
    String b = "hello";
    String c = new String("hello");
    System.out.println(a == b);
    System.out.println(a == c);
    c = c.intern();
    System.out.println(a == c);
  }
}
