package com.raorao.interview.huawei.T3;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-08-19:23
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNext()) {
      String line1 = scanner.nextLine();
      String line2 = scanner.nextLine();
      process(line1, line2);
    }
  }

  private static void process(String string, String target) {
    String[] types = string.split(";");
    int pointNum = 0;
    Map<String, String> map = new HashMap<>();
    Map<String, Integer> map2 = new HashMap<>();
    for (int i = 0; i < types.length; i++) {
      String[] items = types[i].trim().split(" ");
      String pattern = "([a-zA-Z]+)\\**";
      Pattern p = Pattern.compile(pattern);
      Matcher matcher = p.matcher(items[1]);
      // 检查关键字错误
      if (!items[0].equals("typedef")) {
        System.out.println("none");
        return;
      }
      //检查重定义
      if(map.containsKey(items[2])){
        System.out.println("none");
      }
      if (matcher.find()) {
        String type = matcher.group(1);
        // 检查类型
        if (map.isEmpty() || map.containsKey(type)) {
          map.put(items[2], matcher.group(1));
        } else {
          System.out.println("none");
          return;
        }
      }
      pointNum += items[1].length() - matcher.group(1).length();
      map2.put(items[2], pointNum);
    }

    // 判断目标类型是否存在
    if (!map.containsKey(target)) {
      System.out.println("none");
      return;
    }

    // 星号个数
    int num = map2.get(target);
    //打印真实类型
    while (map.containsKey(target)) {
      target = map.get(target);
    }
    StringBuilder sb = new StringBuilder();
    sb.append(target).append(" ");
    for (int i = 0; i < num; i++) {
      sb.append("*").append(" ");
    }
    System.out.println(sb.toString().trim());
  }
}
