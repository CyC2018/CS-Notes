package com.raorao.java.proxy;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-23-20:28
 */
public class Student implements Person {

  @Override
  public void sayHello(String content, int age) {
    System.out.println("student say hello" + content + " " + age);
  }

  @Override
  public void sayGoodBye(boolean seeAgin, double time) {
    System.out.println("student sayGoodBye " + time + " " + seeAgin);
  }
}
