package com.raorao.interview.jd.t1;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-09-20:29
 */
public class Main {

  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int t = sc.nextInt();
    for (int i = 0; i < t; i++) {
      int n = sc.nextInt();
      int m = sc.nextInt();
      int[][] g = new int[n + 1][n + 1];
      for (int j = 0; j < m; j++) {
        int p = sc.nextInt();
        int q = sc.nextInt();
        g[p][q] = 1;
        g[q][p] = 1;
      }
      if (judge(g, n)) {
        System.out.println("Yes");
      } else {
        System.out.println("No");
      }
    }
  }

  public static boolean judge(int[][] g, int n) {
    Set<Set<Integer>> sets = new HashSet<>();
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= n; j++) {
        if (i == j) {
          continue;
        }
        if (g[i][j] == 0) {
          boolean exist = false;
          for (Set<Integer> set : sets) {
            if (set.contains(i) || set.contains(j)) {
              set.add(i);
              set.add(j);
              exist = true;
              break;
            }
          }
          if (!exist) {
            Set<Integer> s = new HashSet<>();
            s.add(i);
            s.add(j);
            sets.add(s);
          }
        }
      }
    }
    for (Set<Integer> set : sets) {
      List<Integer> list = new ArrayList<>(set);
      for (int i = 0; i < list.size(); i++) {
        for (int j = 0; j < list.size(); j++) {
          int p = list.get(i);
          int q = list.get(j);
          if (g[p][q] == 1) {
            return false;
          }
        }
      }
    }
    return true;
  }

}
