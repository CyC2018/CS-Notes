package com.raorao.interview.sunfeng;

import java.util.ArrayList;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-17-20:25
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int num = Integer.parseInt(scanner.nextLine());
    String[] o = new String[num];
    ArrayList<String>[] ao = new ArrayList[num];
    for (int i = 0; i < num; i++) {
      o[i] = scanner.nextLine();
      String[] items;
      String temp = scanner.nextLine();
      if (temp.lastIndexOf(',') == -1) {
        items = new String[] {temp};
      } else {
        items = temp.split(",");
      }
      ao[i] = new ArrayList<>();
      for (String item : items) {
        ao[i].add(item);
      }
    }

    for (int i = 0; i < num; i++) {
      int count = 0;
      for (String s : ao[i]) {
        if (s.equals(o[i])) {
          count++;
        }
      }
      System.out.println(count);
    }

  }
}
