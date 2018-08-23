package com.raorao.java.proxy;

/**
 * 静态代理测试.
 *
 * @author Xiong Raorao
 * @since 2018-08-23-20:29
 */
public class StaticProxyTest implements Person {

  private Person o;

  public StaticProxyTest(Person o) {
    this.o = o;
  }

  public static void main(String[] args) {
    // TODO Auto-generated method stub
    //s为被代理的对象，某些情况下 我们不希望修改已有的代码，我们采用代理来间接访问
    Student s = new Student();
    //创建代理类对象
    StaticProxyTest proxy = new StaticProxyTest(s);
    //调用代理类对象的方法
    proxy.sayHello("welcome to java", 20);
    System.out.println("******");
    //调用代理类对象的方法
    proxy.sayGoodBye(true, 100);

  }

  @Override
  public void sayHello(String content, int age) {
    // TODO Auto-generated method stub
    System.out.println("ProxyTest sayHello begin");
    //在代理类的方法中 间接访问被代理对象的方法
    o.sayHello(content, age);
    System.out.println("ProxyTest sayHello end");
  }

  @Override
  public void sayGoodBye(boolean seeAgin, double time) {
    // TODO Auto-generated method stub
    System.out.println("ProxyTest sayHello begin");
    //在代理类的方法中 间接访问被代理对象的方法
    o.sayGoodBye(seeAgin, time);
    System.out.println("ProxyTest sayHello end");
  }
}
