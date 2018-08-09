package com.raorao.java.base;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

/**
 * hash 的函数式编程用法，统计网站访问次数.
 *
 * @author Xiong Raorao
 * @since 2018-08-09-10:18
 */
public class MapMergeTest {

  public static void main(String[] args) {
    String[] websites = new String[] {"https://www.baidu.com", "https://www.baidu.com",
        "https://www.baidu.com", "https://www.google.com", "https://www.google.com",
        "https://www.sina.com.cn"};
    Map<String, Integer> map1 = new HashMap<>();
    Map<String, Integer> map2 = new HashMap<>();
    merge(map1, websites);
    incrementPageVisit(map2, websites);
    map1.forEach((k,v)-> System.out.print("k= " +k + ", v= " + v + "\t"));
    System.out.println();
    map2.forEach((k,v)-> System.out.print("k= " +k + ", v= " + v + "\t"));
  }

  public static void merge(Map<String, Integer> map, String[] args) {
    Stream.of(args).forEach((e) -> map.merge(e, 1, (oldValue, value) -> (oldValue + value)));
    System.out.println(Stream.of(args).collect(Collectors.joining(", ")));
  }

  public static void incrementPageVisit(Map<String, Integer> pageVisits, String[] pages) {
    for (String page : pages) {
      if (!pageVisits.containsKey(page)) {
        pageVisits.put(page, 0);
      }
      pageVisits.put(page, pageVisits.get(page) + 1);
    }
  }
}
