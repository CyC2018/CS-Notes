package com.raorao.java.althorithm.offer;

/**
 * 单例模式.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-11:59
 */
public class Singleton {

  private static volatile Singleton instance;

  private Singleton() {
  }

  public static Singleton newInstance() {
    if (instance == null) {
      synchronized (Singleton.class) {
        if (instance == null) {
          instance = new Singleton();
        }
      }
    }
    return instance;
  }
}
