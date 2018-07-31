package com.raorao.util;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.FileHandler;
import java.util.logging.Formatter;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

/**
 * 日志工具.
 *
 * 默认将log文件输出到~/xxxx年/x月/xxxx-xx-xx.log 路径不存在的话会自动创建 可通过修改getLogFilePath修改生成的log路径
 *
 * @author raorao
 * @create 2018-03-07-10:53
 */
public class LogUtil {

  private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
  private static final String LOG_FOLDER_NAME = "logs";
  private static final String LOG_FILE_SUFFIX = ".log";

  //使用唯一的fileHandler，保证当天的所有日志写在同一个文件里
  private static FileHandler fileHandler;

  private static MyLogFormatter myLogFormatter;

  public static Logger newInstance(Class clazz, Level level) {
    return newInstance(clazz, level, "./", false, null);
  }

  //    SEVERE > WARNING > INFO > CONFIG > FINE > FINER > FINEST
  public static Logger newInstance(Class clazz, Level level, String logDir, boolean isSave2File,
      String subName) {
    Logger logger = Logger.getLogger(clazz.getName());
    myLogFormatter = new MyLogFormatter();
    try {
      if (isSave2File) {
        //以文本的形式输出
        fileHandler = getFileHandler(logDir, subName);
        //fileHandler.setFormatter(new SimpleFormatter());
        fileHandler.setFormatter(myLogFormatter);
        logger.addHandler(fileHandler);
      }
      logger.setLevel(level);
    } catch (SecurityException e) {
      logger.severe(populateExceptionStackTrace(e));
    }
    return logger;
  }

  private synchronized static String getLogFilePath(String dirName, String subName) {
    StringBuilder logFilePath = new StringBuilder();
    logFilePath.append(dirName);
    logFilePath.append(File.separatorChar);
    logFilePath.append(LOG_FOLDER_NAME);
//    logFilePath.append(File.separatorChar);
//    logFilePath.append(year);
//    logFilePath.append(File.separatorChar);
//    logFilePath.append(month);

    File dir = new File(logFilePath.toString());
    if (!dir.exists()) {
      dir.mkdirs();
    }
    logFilePath.append(File.separatorChar);
    logFilePath.append(sdf.format(new Date()));
    if (subName != null) {
      logFilePath.append("-").append(subName);
    }
    logFilePath.append(LOG_FILE_SUFFIX);
    return logFilePath.toString();
  }

  private static FileHandler getFileHandler() {
    return getFileHandler("./", null);
  }

  private static FileHandler getFileHandler(String logDir, String subName) {
    FileHandler fileHandler;
    try {
      //文件日志内容标记为可追加
      fileHandler = new FileHandler(getLogFilePath(logDir, subName), true);
      return fileHandler;
    } catch (IOException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static synchronized String populateExceptionStackTrace(Exception e) {
    StringBuilder sb = new StringBuilder();
    sb.append(e.toString()).append("\n");
    for (StackTraceElement elem : e.getStackTrace()) {
      sb.append("\tat ").append(elem).append("\n");
    }
    return sb.toString();
  }

  public static synchronized void close(Logger logger) {
    for (Handler h : logger.getHandlers()) {
      h.close();   //must call h.close or a .LCK file will remain.
    }
  }

  public static void main(String[] args) {
    Logger logger = LogUtil.newInstance(LogUtil.class, Level.FINEST, "D:\\", true, "LogUtil");
    logger.fine("asdfasdf");
    logger.info("Hello, world!");
    logger.severe("What are you doing?");
    logger.warning("Warning !");

    try {
      int bb = 1 / 0;
    } catch (Exception e) {
      logger.severe(populateExceptionStackTrace(e));
    }

  }

  static class MyLogFormatter extends Formatter {

    private static final DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Override
    public String format(LogRecord record) {
      StringBuilder builder = new StringBuilder(1000);
      builder.append(df.format(new Date(record.getMillis()))).append(" - ");
      builder.append("[").append(record.getSourceClassName()).append(".");
      builder.append(record.getSourceMethodName()).append("] - \n");
      builder.append("[").append(record.getLevel()).append("] - ");
      builder.append(formatMessage(record));
      builder.append("\n");
      return builder.toString();
    }

    public String getHead(Handler h) {
      return super.getHead(h);
    }

    public String getTail(Handler h) {
      return super.getTail(h);
    }
  }
}
