package com.raorao.leetcode.q204;

/**
 * 统计素数的数量.
 *
 * @author Xiong Raorao
 * @since 2018-08-31-11:33
 */
public class CountPrime {

  public static void main(String[] args) {
    CountPrime prime = new CountPrime();
    int res = prime.countPrimes(10);
    System.out.println(res);
  }

  public int countPrimes(int n) {
    boolean[] notPrimes = new boolean[n + 1];
    int count = 0;
    for (int i = 2; i < n; i++) {
      if (notPrimes[i]) {
        continue;
      }
      count++;
      // 从 i * i 开始，因为如果 k < i，那么 k * i 在之前就已经被去除过了
      for (long j = (long) (i) * i; j < n; j += i) {
        notPrimes[(int) j] = true;
      }
    }
    return count;
  }
}
