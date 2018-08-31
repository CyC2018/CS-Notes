package com.raorao.leetcode.q238;

import java.util.Arrays;

/**
 * 除自身以外数组的乘积.
 *
 * @author Xiong Raorao
 * @since 2018-08-31-16:16
 */
public class ProductExceptSelf {

  public static void main(String[] args) {
    int[] input = new int[]{1,2,3,4};
    ProductExceptSelf self = new ProductExceptSelf();
    int[] res = self.productExceptSelf(input);
    System.out.println(Arrays.toString(res));
  }

  public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] products = new int[n];
    Arrays.fill(products, 1);
    int left = 1;
    for (int i = 1; i < n; i++) {
      left *= nums[i - 1];
      products[i] *= left;
    }
    int right = 1;
    for (int i = n - 2; i >= 0; i--) {
      right *= nums[i + 1];
      products[i] *= right;
    }
    return products;
  }
}
