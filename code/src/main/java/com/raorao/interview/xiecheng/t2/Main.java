package com.raorao.interview.xiecheng.t2;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-04-19:43
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int target = scanner.nextInt();
    scanner.nextLine();
    D[] dd = new D[n];
    List<D> ret = new ArrayList<>();
    for (int i = 0; i < n; i++) {
      String[] temp = scanner.nextLine().split(" ");
      int id = Integer.parseInt(temp[0]);
      int start = Integer.parseInt(temp[1]);
      int end = Integer.parseInt(temp[2]);
      dd[i] = new D(id, start, end);
    }
    for (int i = 0; i < n; i++) {
      if (target >= dd[i].start && target <= dd[i].end) {
        ret.add(dd[i]);
      }
    }
    ret.sort(Comparator.comparingInt(e -> e.id));
    if (ret.size() == 0) {
      System.out.println("null");
      return;
    }
    ret.forEach(e -> System.out.println(e.id));

  }

  private static class D {

    int id;
    int start;
    int end;

    public D(int id, int start, int end) {
      this.id = id;
      this.start = start;
      this.end = end;
    }

    public D() {
    }
  }
}
