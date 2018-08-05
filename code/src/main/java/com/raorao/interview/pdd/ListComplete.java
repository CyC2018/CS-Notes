package com.raorao.interview.pdd;

import java.util.Scanner;

/**
 * 列表补全问题.
 *
 * 描述： 在商城的某个位置有一个商品列表，该列表是由L1、L2两个子列表拼接而成。当用户浏览并翻页时，需要从列表L1、L2中获取商品进行展示。展示规则如下：
 *
 * 1. 用户可以进行多次翻页，用offset表示用户在之前页面已经浏览的商品数量，比如offset为4，表示用户已经看了4个商品
 *
 * 2. n表示当前页面需要展示的商品数量
 *
 * 3. 展示商品时首先使用列表L1，如果列表L1长度不够，再从列表L2中选取商品
 *
 * 4. 从列表L2中补全商品时，也可能存在数量不足的情况
 *
 * 请根据上述规则，计算列表L1和L2中哪些商品在当前页面被展示了
 *
 * 输入描述：
 *
 * 每个测试输入包含1个测试用例，包含四个整数，分别表示偏移量offset、元素数量n，列表L1的长度l1，列表L2的长度l2。
 *
 * 输出描述：
 *
 * 一行内输出四个整数分别表示L1和L2的区间start1，end1，start2，end2，每个数字之间有一个空格。 注意，区间段使用半开半闭区间表示，即包含起点，不包含终点。如果某个列表的区间为空，使用[0,
 * 0)表示，如果某个列表被跳过，使用[len, len)表示，len表示列表的长度。
 *
 * @author Xiong Raorao
 * @since 2018-08-05-16:02
 */
public class ListComplete {

  public static String process(String list) {
    String[] arr = list.split(" ");
    int offset = Integer.parseInt(arr[0]);
    int n = Integer.parseInt(arr[1]);
    int L1 = Integer.parseInt(arr[2]);
    int L2 = Integer.parseInt(arr[3]);

    int[] out = new int[4];

    if (offset + n < L1) {
      out[0] = offset;
      out[1] = offset + n;
      out[2] = 0;
      out[3] = 0;
    } else if (offset < L1 && offset + n >= L1) {
      out[0] = offset;
      out[1] = L1;
      out[2] = 0;
      if (offset + n < L1 + L2) {
        out[3] = offset + n - L1;
      } else {
        out[3] = L2;
      }
    } else if (offset >= L1 && offset <= L1 + L2) {
      out[0] = L1;
      out[1] = L1;
      out[2] = offset - L1;
      if (offset + n < L1 + L2) {
        out[3] = offset + n - L1;
      } else {
        out[3] = L2;
      }
    } else if (offset > L1 + L2){
      out[0] = L1;
      out[1] = L1;
      out[2] = L2;
      out[3] = L2;
    }

    StringBuilder sb = new StringBuilder();
    sb.append(out[0]).append(" ")
        .append(out[1]).append(" ")
        .append(out[2]).append(" ")
        .append(out[3]);
    return sb.toString();

  }


  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      System.out.println(process(line));
    }
  }
}
