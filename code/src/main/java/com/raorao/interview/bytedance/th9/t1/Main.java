package com.raorao.interview.bytedance.th9.t1;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-09-10:01
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String input = scanner.nextLine();
    System.out.print(process(input));
  }

  private static int process(String s){
    if (s == null || s.length() == 0) {
      return 0;
    }
    Map<Character, Integer> map = new HashMap<>();
    int result = 1;
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
      if (!map.containsKey(s.charAt(i))) {
        map.put(s.charAt(i), i);
        count++;
      } else {
        count = 0;
        i = map.get(s.charAt(i));
        map.clear();
      }
      if (result < count) {
        result = count;
      }
    }
    return result;
  }
}