package com.raorao.beauty;

/**
 * 数字中1的个数.
 *
 * @author Xiong Raorao
 * @since 2018-08-30-17:28
 */
public class NumOf1 {

  public static void main(String[] args) {
    System.out.println(count(5));
  }

  public static int count(int n) {
    int sum = 0;
    while (n > 0) {
      n &= n - 1;
      sum++;
    }
    return sum;
  }
}
