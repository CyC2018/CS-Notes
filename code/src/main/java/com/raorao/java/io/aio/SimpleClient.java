package com.raorao.java.io.aio;


import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.charset.Charset;
import java.util.concurrent.ExecutionException;

/**
 * 异步非阻塞IO (AIO) 的客户端.
 *
 * @author Xiong Raorao
 * @since 2018-08-07-14:38
 */
public class SimpleClient {

  public static void main(String[] args) {
    // 用于读取数据的ByteBuffer。
    ByteBuffer buff = ByteBuffer.allocate(1024);
    Charset utf = Charset.forName("utf-8");
    try (
        // ①创建AsynchronousSocketChannel对象
        AsynchronousSocketChannel clientChannel
            = AsynchronousSocketChannel.open()) {
      // ②连接远程服务器
      clientChannel.connect(new InetSocketAddress("127.0.0.1"
          , 8888)).get();     //④
      buff.clear();
      // ③从clientChannel中读取数据
      clientChannel.read(buff).get();     //⑤
      buff.flip();
      // 将buff中内容转换为字符串
      String content = utf.decode(buff).toString();
      System.out.println("服务器信息：" + content);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } catch (ExecutionException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
