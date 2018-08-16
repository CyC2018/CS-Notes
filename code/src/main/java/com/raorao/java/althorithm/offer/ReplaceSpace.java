package com.raorao.java.althorithm.offer;

/**
 * 替换空格.
 *
 * @author Xiong Raorao
 * @since 2018-08-16-14:22
 */
public class ReplaceSpace {

  public static void main(String[] args) {
    StringBuffer sb = new StringBuffer("Hello world");
    String t = replaceSpace(sb);
    System.out.println(t);
  }

  public static String replaceSpace(StringBuffer sb) {
    if (sb == null) {
      return null;
    }
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
