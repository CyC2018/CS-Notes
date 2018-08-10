package com.raorao.interview.netease;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

/**
 * 题目描述：.
 *
 * @author Xiong Raorao
 * @since 2018-08-09-19:02
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int count = Integer.parseInt(scanner.nextLine());
    Map<String, Integer> person = new HashMap<>();
    for (int i = 0; i < count; i++) {
      String[] info = scanner.nextLine().split(" ");
      person.put(info[1], Integer.parseInt(info[0]));
    }
    int changeCount = Integer.parseInt(scanner.nextLine());
    Map<String, Integer> status = new HashMap<>();
    person.forEach((k, v) -> status.put(k, 0));
    for (int i = 0; i < changeCount; i++) {
      String[] info = scanner.nextLine().split(" ");
      status.put(info[0], Integer.parseInt(info[1]));
    }
    process(person, status);
  }

  public static void process(Map<String, Integer> person, Map<String, Integer> status) {
    List<String> offline = new ArrayList<>();
    List<String> online = new ArrayList<>();
    status.forEach((k, v) -> {
      if (v == 0) {
        offline.add(k);
      } else {
        online.add(k);
      }
    });
    List<String> temp = online.stream().sorted(Comparator.comparing(Main::strValue))
        .collect(Collectors.toList());
    List<String> onlineSorted = temp.stream()
        .sorted(Comparator.comparing(person::get))
        .collect(Collectors.toList());
    List<String> temp2 = offline.stream().sorted(Comparator.comparing(Main::strValue))
        .collect(Collectors.toList());
    List<String> offlineSorted = temp2.stream()
        .sorted(Comparator.comparing(person::get))
        .collect(Collectors.toList());

    // 颠倒两个list的顺序
    invertList(offlineSorted);
    invertList(onlineSorted);
    onlineSorted.addAll(offlineSorted);
    onlineSorted.forEach(System.out::println);
  }

  private static void invertList(List<String> list) {
    int size = list.size();
    List<String> temp = new ArrayList<>();
    for (int i = size - 1; i >= 0; i--) {
      temp.add(list.get(i));
    }
    for (int i = 0; i < size; i++) {
      list.set(i, temp.get(i));
    }
  }

  private static int strValue(String str) {
    char[] chars = str.toCharArray();
    int sum = 0;
    for (int i = 0; i < chars.length; i++) {
      sum += chars[i];
    }
    return 'z' * chars.length - sum;
  }
}
