package com.raorao.interview.haoweilai.t1;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-28-19:01
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String input = scanner.nextLine();
    System.out.println(process(input));
  }

  private static int process(String str) {
    if (str == null || str.length() == 0) {
      return 0;
    }
    if(str.length() == 1 && Integer.parseInt(str) == 0){
      return 1;
    }
    int len = str.length();
    int count = 0;
    int sum = 0;
    for (int i = 0; i < len; i++) {
      sum += str.charAt(i) - '0';
      if (sum % 3 == 0) {
        count++;
        sum = 0;
      }
    }
    return count;
  }
}
