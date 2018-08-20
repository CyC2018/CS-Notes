package com.raorao.leetcode.q633;

/**
 * 判断一个数是否为两个数的平方和.
 *
 * 双指针问题
 *
 * @author Xiong Raorao
 * @since 2018-08-20-11:25
 */
public class JudgeSquareSum {

  public static void main(String[] args) {
    System.out.println(judgeSquareSum(1000));
  }

  public static boolean judgeSquareSum(int c) {
    int i = 0;
    int j = (int) Math.sqrt(c);
    while (i <= j) {
      int sum = i * i + j * j;
      if (sum == c) {
        //System.out.println("i = " + i + ", j = " + j);
        return true;
      } else if (sum < c) {
        i++;
      } else {
        j--;
      }
    }
    return false;
  }
}
