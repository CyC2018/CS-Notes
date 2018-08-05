package com.raorao.interview.pdd;

import java.util.Scanner;

/**
 * 有趣的变换.
 *
 * @author Xiong Raorao
 * @since 2018-08-05-19:52
 */
public class Numbers {

  public static int intSum(String string) {
    if (string.equals("0")) {
      return 1;
    }
    if (string.startsWith("0")) {
      return 0;
    } else {
      return 1;
    }
  }

  public static int foatSum(String string) {
    if (string.endsWith("0")) {
      return 0;
    }
    if (string.startsWith("0")) {
      return 1;
    } else {
      return string.length() - 1;
    }


  }

  public static int process(String string) {
    int count = 0;
    for (int i = 1; i < string.length(); i++) {
      count +=
          intSum(string.substring(0, i)) * foatSum(string.substring(i, string.length())) +
              intSum(string.substring(0, i)) * intSum(string.substring(i, string.length()))
              +
              foatSum(string.substring(0, i)) * intSum(
                  string.substring(i, string.length())) +
              foatSum(string.substring(0, i)) * foatSum(
                  string.substring(i, string.length()));
    }
    return count;
  }

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String input = scanner.nextLine();
    System.out.println(process(input));
  }

}