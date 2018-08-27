package com.raorao.interview.toutiao.t2;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * 字符串.
 *
 * @author Xiong Raorao
 * @since 2018-08-25-10:31
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int t = Integer.parseInt(scanner.nextLine());
    List<String> ret = new ArrayList<>();
    List<List<String>> inputs = new ArrayList<>();
    for (int i = 0; i < t; i++) {
      int n = Integer.parseInt(scanner.nextLine());
      List<String> temp = new ArrayList<>();
      while (n-- > 0) {
        temp.add(scanner.nextLine());
      }
      inputs.add(temp);
    }
    for (List<String> list : inputs) {
      ret.add(process(list));
    }
    for (String s : ret) {
      System.out.println(s);
    }

  }

  private static String process(List<String> strings) {
    List<String> ret = new ArrayList<>();
    for (int i = 0; i < strings.size(); i++) {
      for (int j = i + 1; j < strings.size(); j++) {
        ret.add(process(strings.get(i), strings.get(j)));
      }
    }
    for (String s:ret){
      if (s.equals("Yeah")){
        return "Yeah";
      }
    }
    return "Sad";
  }

  private static String process(String s1, String s2) {
    char start = s2.charAt(0);
    List<String> starts = find(s1, start);
    for (String s : starts) {
      if (s.equals(s2)) {
        return "Yeah";
      }
    }
    return "Sad";
  }

  private static List<String> find(String s1, char start) {
    List<String> ret = new ArrayList<>();
    for (int i = 0; i < s1.length(); i++) {
      if (start == s1.charAt(i)) {
        String tmp1 = s1.substring(i + 1, s1.length());
        String tmp;
        if (i == 0) {
          tmp = tmp1;
        } else {
          tmp = tmp1 + s1.substring(0, i);
        }
        ret.add(start + tmp);
        ret.add(start + invert(tmp));
      }
    }
    return ret;
  }

  private static String invert(String s) {
    StringBuilder sb = new StringBuilder();
    for (int i = s.length() - 1; i >= 0; i--) {
      sb.append(s.charAt(i));
    }
    return sb.toString();
  }
}
