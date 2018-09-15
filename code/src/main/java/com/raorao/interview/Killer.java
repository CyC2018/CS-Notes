package com.raorao.interview;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-07-16:39
 */
public class Killer {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    List<Integer> list = new ArrayList<>();
    for (int i = 0; i < n; i++) {
      list.add(scanner.nextInt());
    }

    int count = 0;
    while (!check(list)) {
      for (int i = list.size() - 1; i >= 0; i--) {
        if (i - 1 >= 0 && list.get(i - 1) > list.get(i)) {
          list.remove(i);
        }
      }
      count++;
    }
    System.out.println(count);

  }

  private static boolean check(List<Integer> list) {
    if (list.size() == 1) {
      return true;
    } else {
      for (int i = 0; i < list.size() - 1; i++) {
        if (list.get(i) > list.get(i + 1)) {
          return false;
        }
      }
      return true;
    }
  }
}
