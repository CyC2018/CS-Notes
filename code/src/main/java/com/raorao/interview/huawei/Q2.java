package com.raorao.interview.huawei;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

/**
 * 数字去重.
 *
 * 题目描述：明明想在学校中请一些同学一起做一项问卷调查，为了实验的客观性，他先用计算机生成了N个1到1000之间的随机整数（N≤1000），对于其中重复的数字，只保留一个，把其余相同的数去掉，不同的数对应着不同的学生的学号。然后再把这些数从小到大排序，按照排好的顺序去找同学做调查。
 * 请你协助明明完成“去重”与“排序”的工作(同一个测试用例里可能会有多组数据，希望大家能正确处理)。
 *
 * 输入描述： 输入多行，先输入随机整数的个数，再输入相应个数的整数
 *
 * 输出描述： 返回多行，处理后的结果
 *
 * @author Xiong Raorao
 * @since 2018-08-08-10:23
 */
public class Q2 {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    List<Integer> list = new ArrayList<>();
    while (scanner.hasNext()) {
      int count = scanner.nextInt();
      for (int i = 0; i < count; i++) {
        if (scanner.hasNextInt()) {
          list.add(scanner.nextInt());
        }
      }
      process(list);
      list.clear();
    }
  }

  private static void process(List<Integer> list) {
    Set<Integer> set = new HashSet<>();
    List<Integer> tempList = new ArrayList<>();
    list.forEach(set::add);
    set.forEach((e) -> tempList.add(e));
    Collections.sort(tempList);
    tempList.forEach(System.out::println);
  }
}
