package com.raorao.java;

import com.google.common.collect.HashBasedTable;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map.Entry;

public class Test {

  static int a;
  static int c;
  int b;

  public static int cMethod() {
    c++;
    return c;
  }

  public static void main(String args[]) {
    Hashtable<Integer, Integer> hashMap = new Hashtable<>();
    hashMap.put(1, 10);
    hashMap.put(2, 20);
    hashMap.put(3, 30);
    hashMap.put(19, 30);
    hashMap.forEach((e1, e2)-> System.out.println( e1 + ":" + e2));
    Iterator<Entry<Integer, Integer>> iterator = hashMap.entrySet().iterator();
    Enumeration<Integer> enumeration = hashMap.elements();
    while (enumeration.hasMoreElements()){
      System.out.println(enumeration.nextElement());
    }

  }

  public int aMethod() {
    a++;
    return a;
  }

  public int bMethod() {
    b++;
    return b;
  }
}