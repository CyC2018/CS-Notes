package com.raorao.java.base;

/**
 * 内部类的引用.
 *
 * @author Xiong Raorao
 * @since 2018-08-06-14:43
 */
public class InnerClassTest {
  void f(){
    System.out.println("InnerClassTest.f()");
  }
  public class Inner{
    public InnerClassTest outer(){
      return InnerClassTest.this;
    }
  }

  public Inner inner(){
    return new Inner();
  }

  public static void main(String[] args) {
    InnerClassTest test = new InnerClassTest();
    InnerClassTest.Inner inner = test.new Inner();
    //inner = new InnerClassTest.Inner(); // 如果Inner 是static就可以，否则只能采用上面的语句
  }
}
