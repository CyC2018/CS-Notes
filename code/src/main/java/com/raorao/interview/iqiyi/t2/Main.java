package com.raorao.interview.iqiyi.t2;

import java.util.ArrayList;
import java.util.Scanner;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-09-15-11:00
 */
public class Main {

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int N = scanner.nextInt();
    int M = scanner.nextInt();
    int P = scanner.nextInt();
    ArrayList<Food> foods = new ArrayList<>();
    for (int i = 0; i < N; i++) {
      foods.add(new Food(i, scanner.nextInt()));
    }
    scanner.next();
    for (int i = 0; i < M; i++) {
      String[] temp = scanner.nextLine().split(" ");
      int food = Integer.parseInt(temp[1]);
      if (temp[0].equals("A")) {
        Food f = new Food(foods.get(food - 1).id, foods.get(food - 1).num + 1);
        foods.set(food - 1, f);
      } else {
        Food f = new Food(foods.get(food - 1).id, foods.get(food - 1).num - 1);
        foods.set(food - 1, f);
      }
    }
    foods.sort((e1, e2) -> e2.num - e1.num);
    int ret = 1;
    boolean flag = false;
    int last = foods.get(0).num;
    for (int i = 0; i < foods.size(); i++) {
      if (foods.get(i).id == P - 1) {
        System.out.println(ret);
        return;
      }
      if(i > 0 && foods.get(i).num == last){

      }else {
        ret ++;
      }
//      if (i > 0 && foods.get(i - 1).num == foods.get(i).num) {
//        flag = true;
//      } else {
//        if (!flag) {
//          ret++;
//        } else {
//          ret = i + 1;
//          flag = false;
//        }
//      }
    }
  }

  static class Food {

    int id;
    int num;

    public Food(int id, int num) {
      this.id = id;
      this.num = num;
    }
  }
}
