package com.raorao.interview.bytedance.th9.t4;

import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-09-10:38
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    int[] nums = new int[n];
    for (int i = 0; i < n; i++) {
      nums[i] = scanner.nextInt();
    }

    if(valid(nums)){
      System.out.println(1);
    }else {
      System.out.println(0);
    }

  }

  private static boolean valid(int[] data){
    boolean isUtf8 = false;// 当前num是否在一个验证的字符中
    int times = 0;
    for (int i = 0; i < data.length; i++) {
      if(isUtf8==false){
        times = check(data[i]);//当前编码需要多少个10
        if (times == -2 || times == 0)//非编码
          return false;
        if(times>0)//后面需要跟多少个10编码
          isUtf8=true;
      }else{
        if(times>0&&check(data[i])==0)//是10编码
          times--;
        else
          return false;
        if(times==0)
          isUtf8=false;
      }
    }
    return times>0?false:true;
  }

  public static int check(int n) {
    if ((128 & n) == 0) {
      return -1;
    }
    if ((192 & n) == 128)//10
    {
      return 0;
    }
    if ((224 & n) == 192) {
      return 1;
    }
    if ((240 & n) == 224) {
      return 2;
    }
    if ((248 & n) == 240) {
      return 3;
    }
    return -2;
  }

}
