package com.raorao.java.oop;

/**
 * 测试.
 *
 * @author Xiong Raorao
 * @since 2018-09-06-9:28
 */
public class Client {

  public static void main(String[] args) {
    Father f = new Children();
    System.out.println(f.num);
    f.say();
  }
}
