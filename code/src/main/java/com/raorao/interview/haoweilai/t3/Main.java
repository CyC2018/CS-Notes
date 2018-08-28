package com.raorao.interview.haoweilai.t3;

import java.util.ArrayList;
import java.util.List;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-28-19:57
 */
public class Main {

  public static void main(String[] args) {
    int[] arr = new int[] {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
    int[] bool = new int[] {0, 1, 1, 1, 1, 1, 1, 1, 1, 0};
    process(arr, bool);
  }

  private static void process(int[] arr, int[] bool) {
    List<String> res = new ArrayList<>();
    List<int[]> boolList = new ArrayList<>();

    List<Integer> zeros = new ArrayList<>();
    for (int i = 0; i < bool.length; i++) {
      if (bool[i] == 0) {
        zeros.add(i);
      }
    }

    back(zeros,bool, boolList, 0);

    for (int i = 0; i < boolList.size(); i++) {
      StringBuilder sb = new StringBuilder();
      for (int j = 0; j < boolList.get(i).length; j++) {
        if (bool[j] == 1) {
          sb.append(arr[j]);
        }
      }
      res.add(sb.toString());
    }
    res.forEach(e -> System.out.println(e));
  }

  private static void back(List<Integer> zeros, int[] bool, List<int[]> res, int k) {

  }

  private static int[] arrCopy(int[] arr) {
    int n = arr.length;
    int[] res = new int[n];
    System.arraycopy(arr, 0, res, 0, n);
    return res;
  }

}
