package com.raorao.interview.jd.t2;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-09-20:01
 */
public class Main {

  private static List<P> list = new ArrayList<>();
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    for (int i = 0; i < n; i++) {
      int a = scanner.nextInt();
      int b = scanner.nextInt();
      int c = scanner.nextInt();
      list.add(new P(a, b, c));
    }
    Set<Integer> set = new HashSet<>();
    for (int i = 0; i < list.size(); i++) {
      for (int j = i + 1; j < list.size(); j++) {
        if (compare(list.get(i), list.get(j))) {
          set.add(i);
          list.remove(i);
        }
        if (compare(list.get(j), list.get(i))) {
          set.add(j);
          list.remove(i);
        }
      }
    }
    System.out.println(set.size());

  }

  public static boolean compare(P p1, P p2) {
    return (p1.a < p2.a) && (p1.b < p2.b) && (p1.c < p2.c);
  }

  static class P {

    int a;
    int b;
    int c;

    public P(int a, int b, int c) {
      this.a = a;
      this.b = b;
      this.c = c;
    }
  }
}

