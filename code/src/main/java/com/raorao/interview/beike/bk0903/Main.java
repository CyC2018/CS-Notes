package com.raorao.interview.beike.bk0903;


import java.lang.annotation.Target;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-03-19:35
 */
public class Main {

  private static int TARGET = 500500;
  private static final long MODULUS = 500500507;

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    TARGET = (int) Math.sqrt(n);
    new Main().run();
  }

  public String run() {
    Queue<Long> queue = new PriorityQueue<>();
    int nextPrime = 2;
    queue.add((long) nextPrime);

    long product = 1;
    for (int i = 0; i < TARGET; i++) {
      long item = queue.remove();
      product *= item % MODULUS;
      product %= MODULUS;
      queue.add(item * item);

      if (item == nextPrime) {
        do {
          nextPrime++;
        }
        while (isPrime(nextPrime));
        queue.add((long) nextPrime);
      }
    }

    return Long.toString(product);
  }

  public static boolean isPrime(int x) {
    if (x < 0)
      throw new IllegalArgumentException("Negative number");
    if (x == 0 || x == 1)
      return false;
    else if (x == 2)
      return true;
    else {
      if (x % 2 == 0)
        return false;
      for (int i = 3, end = sqrt(x); i <= end; i += 2) {
        if (x % i == 0)
          return false;
      }
      return true;
    }
  }

  public static int sqrt(int x) {
    if (x < 0)
      throw new IllegalArgumentException("Square root of negative number");
    int y = 0;
    for (int i = 1 << 15; i != 0; i >>>= 1) {
      y |= i;
      if (y > 46340 || y * y > x)
        y ^= i;
    }
    return y;
  }

}
