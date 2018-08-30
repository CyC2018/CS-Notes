package com.raorao.interview.pdd.t1;

import java.util.Scanner;

public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int hp = Integer.parseInt(scanner.nextLine());
    int normal = Integer.parseInt(scanner.nextLine());
    int buffer = Integer.parseInt(scanner.nextLine());
    int res = process(hp, normal, buffer);
    System.out.println(res);
  }

  private static int process(int hp, int normal, int buffer) {
    if (hp <= normal) {
      return 1;
    }
    if (hp <= 2 * normal || hp <= buffer) {
      return 2;
    }

    if (buffer <= normal * 2) {
      int count = hp / normal;
      if (hp % normal != 0) {
        count++;
      }
      return count;
    } else {
      int count = 2 * (hp / buffer);
      if(hp % buffer != 0){
        if (hp % buffer <= normal) {
          count++;
        } else {
          count += 2;
        }
      }
      return count;
    }
  }
}