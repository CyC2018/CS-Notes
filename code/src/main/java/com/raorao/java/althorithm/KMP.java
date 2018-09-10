package com.raorao.java.althorithm;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-07-18:10
 */
public class KMP {

  public static void main(String[] args) {
    int count = 0;
    for (int i = 0; i < 1000; i++) {
      if (i % 2 != 0 && i % 3 != 0 && i % 5 != 0) {
        count++;
      }
    }
    System.out.println(count);
  }

  public static void find(char[] source, char[] pattern) {

  }

//  private static char[] getPMT(char[] pattern) {
//    char[] ret = new char[pattern.length];
//
//  }

}
