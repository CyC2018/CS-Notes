package com.raorao.java.base;

import java.util.function.Consumer;
import java.util.function.Predicate;

/**
 * 函数接口.
 *
 * @author Xiong Raorao
 * @since 2018-08-09-12:59
 */
public class FunctionTest {

  public static void main(String[] args) {
    new Add(()-> System.out.println("加法")).compute();
  }

  public static void myConsumer(Consumer<Integer> item){
    item.accept(12);
  }

  static interface Compute {

    void compute();
  }

  static class Add implements Compute {

    Compute target;

    public Add(Compute compute) {
      target = compute;
    }

    @Override
    public void compute() {
      target.compute();
    }
  }
}
