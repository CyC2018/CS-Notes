package com.raorao.leetcode.q605;

/**
 * 种植花朵.
 *
 * 问题描述；花朵之间至少需要一个单位的间隔，求解是否能种下 n 朵花。
 *
 * @author Xiong Raorao
 * @since 2018-08-21-11:40
 */
public class PlantFlower {

  public static void main(String[] args) {
    int[] input = new int[] {1, 0, 0, 0, 1};
    int n = 1;
    System.out.println(new PlantFlower().canPlaceFlowers(input, n));
  }

  public boolean canPlaceFlowers(int[] flowerbed, int n) {
    if (flowerbed == null || flowerbed.length == 0) {
      return false;
    }
    int count = 0; // 统计最多能种多少棵
    for (int i = 0; i < flowerbed.length && count < n; i++) {
      if (flowerbed[i] == 1) {
        continue;
      }
      int pre = i == 0 ? 0 : flowerbed[i - 1];
      int next = i == flowerbed.length - 1 ? 0 : flowerbed[i + 1];
      if (pre == 0 && next == 0) {
        count++;
        flowerbed[i] = 1;
      }
    }
    return count >= n;
  }
}
