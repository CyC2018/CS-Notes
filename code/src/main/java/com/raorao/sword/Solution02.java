package com.raorao.sword;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-06-10:20
 */
public class Solution02 {

  public String replaceSpace(StringBuffer sb) {
    int oldLength = sb.length();
    for (int i = 0; i < oldLength; i++) {
      if (sb.charAt(i) == ' ') {
        sb.append("  ");
      }
    }
    int newLength = sb.length();
    int oldIndex = oldLength - 1;
    int newIndex = newLength - 1;
    for (; (oldIndex >= 0 && newIndex > oldIndex); oldIndex--) {
      if (sb.charAt(oldIndex) == ' ') {
        sb.setCharAt(newIndex--, '0');
        sb.setCharAt(newIndex--, '2');
        sb.setCharAt(newIndex--, '%');
      } else {
        sb.setCharAt(newIndex--, sb.charAt(oldIndex));
      }
    }
    return sb.toString();
  }
}
