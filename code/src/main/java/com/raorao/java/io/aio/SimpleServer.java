package com.raorao.java.io.aio;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * 使用AIO 实现异步非阻塞通信.
 *
 * 步骤：AsynchronousServerSocketChannel用于服务器端，只要三步
 *
 * 1.调用open()静态方法创建AsynchronousServerSocketChannel。
 *
 * 2.调用AsynchronousServerSocketChannel的bind()方法让它在指定的IP地址，指定端口监听。
 *
 * 3.调用AsynchronousServerSocketChannel的accept()方法接受请求。
 *
 * @author Xiong Raorao
 * @since 2018-08-07-14:30
 */
public class SimpleServer {

  public static void main(String[] args)
      throws IOException, ExecutionException, InterruptedException {
    AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open();
    serverChannel.bind(new InetSocketAddress("127.0.0.1", 8888));
    while (true) {
      // 采用循环接受来自客户端的连接
      Future<AsynchronousSocketChannel> future
          = serverChannel.accept();
      // 获取连接完成后返回的AsynchronousSocketChannel
      AsynchronousSocketChannel socketChannel = future.get();
      // 执行输出。
      socketChannel.write(ByteBuffer.wrap("欢迎你来自AIO的世界！"
          .getBytes("UTF-8"))).get();
    }

  }
}
