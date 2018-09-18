package com.raorao.interview.sunfeng;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-17-20:24
 */
public class T1 {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    Map<String, Integer> map = new HashMap<>();
    while (scanner.hasNextLine()) {

      String[] words = scanner.nextLine().split(" ");
      for (String word : words) {
        if (!word.equals("")) {
          map.put(word.toLowerCase(), map.getOrDefault(word.toLowerCase(), 0) + 1);
        }
      }
    }

    // print
    List<Word> list = new ArrayList<>();
    for (Map.Entry<String, Integer> entry : map.entrySet()) {
      list.add(new Word(entry.getKey(), entry.getValue()));
    }
    list.sort((e1, e2) -> e2.num - e1.num);
    print(list);
  }

  private static void print(List<Word> list) {
    int size = list.size();
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < list.size(); i++) {
      Word w = list.get(i);
      if (i == 0) {
        sb.append("[");
      }
      sb.append("(").append("'").append(w.w).append("'").append(",").append(w.num).append(")");
      if (i != size - 1) {
        sb.append(",");
      }
      if (i == size - 1) {
        sb.append("]");
      }

    }

    System.out.println(sb.toString());
  }

  static class Word {

    String w;
    int num;

    public Word(String w, int num) {
      this.w = w;
      this.num = num;
    }
  }
}
