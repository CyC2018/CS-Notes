package com.raorao.interview.pdd.t3;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-30-19:41
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String[] line1 = scanner.nextLine().split(" ");
    int a = Integer.parseInt(line1[0]);
    int b = Integer.parseInt(line1[1]);
    System.out.println(process(a, b));

  }

  private static String process(int a, int b) {
    List<Integer> list = new ArrayList<>();
    while (a != 0) {
      a = a % b;
      int it = list.indexOf(a);
      if (it != -1 && it != list.size() - 1) {
        return it + " " + (list.size() - 1 - it);
      }
      list.add(a);
      a *= 10;
    }
    return list.size() - 1 + " " + 0;
  }
}
