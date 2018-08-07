package com.raorao.java.io.nio;

import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;

/**
 * .
 *
 * @author Xiong Raorao
 * @since 2018-08-07-10:41
 */
public class NIOClient {

  public static void main(String[] args) throws IOException {
//    Socket socket = new Socket("127.0.0.1", 8888);
//    OutputStream out = socket.getOutputStream();
//    String s = "hello world";
//    out.write(s.getBytes());
//    out.close();

    Thread t1 = new Thread(() -> {
      try {
        Socket socket = new Socket("127.0.0.1", 8888);
        OutputStream out = socket.getOutputStream();
        Thread.sleep(2000);
        String s = "hello world, this is thread-1, I have slept 2s";
        out.write(s.getBytes());
        out.close();
      } catch (IOException e) {
        e.printStackTrace();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    });
    Thread t2 = new Thread(() -> {
      try {
        Socket socket = new Socket("127.0.0.1", 8888);
        OutputStream out = socket.getOutputStream();
        Thread.sleep(3000);
        String s = "hello world, this is thread-2, I have slept 3s";
        out.write(s.getBytes());
        out.close();
      } catch (IOException e) {
        e.printStackTrace();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    });
    t2.start();
    t1.start();
  }
}
