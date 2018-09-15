package com.raorao.java.load;

import java.lang.reflect.Method;
import java.util.SortedSet;
import java.util.TreeSet;

/**
 * 破坏双亲委派模型.
 *
 * @author Xiong Raorao
 * @since 2018-09-10-9:12
 */
public class BreakAgent {

  public static void main(String[] args) throws ClassNotFoundException {

  }

  public static class Object {

    public void say() {
      System.out.println("say hello!");
    }
  }

  public static class MyLoader extends ClassLoader {

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
      return super.findClass(name);
    }
  }
}
