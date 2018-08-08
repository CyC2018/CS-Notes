package com.raorao.interview.huawei;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * 汽水瓶.
 *
 * 题目描述：三个空汽水瓶可以换一瓶汽水。小张手上有十个空汽水瓶，她最多可以换多少瓶汽水喝？
 *
 * 答案是5瓶，方法如下：先用9个空瓶子换3瓶汽水，喝掉3瓶满的，喝完以后4个空瓶子，用3个再换一瓶，喝掉这瓶满的，这时候剩2个空瓶子。
 * 然后你让老板先借给你一瓶汽水，喝掉这瓶满的，喝完以后用3个空瓶子换一瓶满的还给老板。
 *
 * @author Xiong Raorao
 * @since 2018-08-08-9:52
 */
public class Q1 {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    List<Integer> list = new ArrayList<>();
    while (scanner.hasNextInt()) {
      int input = Integer.parseInt(scanner.nextLine());
      if (input != 0) {
        list.add(input);
      } else {
        process(list);
        list.clear();
      }
    }
  }

  private static void process(List<Integer> list) {
    if(list.size() == 0){
      System.out.println(0);
    }
    list.forEach((e) -> System.out.println(process(e)));
  }

  public static int process(int input) {
    if (input < 3) {
      return 0;
    }
    int q = input / 3;
    int r = input % 3;
    int count = 0;
    while (q > 0) {
      count += q;
      int temp = q + r;
      q = temp / 3;
      r = temp % 3;
    }
    if (r == 2) {
      count++;
    }
    return count;
  }
}
