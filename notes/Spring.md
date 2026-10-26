# Spring
<!-- GFM-TOC -->
* [Spring](#spring)
    * [一、IoC 与 Bean](#一ioc-与-bean)
        * [IoC 与依赖注入](#ioc-与依赖注入)
        * [Bean 的生命周期](#bean-的生命周期)
        * [Bean 的作用域与线程安全](#bean-的作用域与线程安全)
        * [循环依赖](#循环依赖)
    * [二、AOP](#二aop)
        * [动态代理](#动态代理)
        * [自调用](#自调用)
    * [三、事务](#三事务)
        * [声明式事务](#声明式事务)
        * [传播行为](#传播行为)
        * [事务失效](#事务失效)
    * [四、Spring Boot 自动配置](#四spring-boot-自动配置)
    * [五、Spring MVC](#五spring-mvc)
        * [请求的处理过程](#请求的处理过程)
    * [六、MyBatis](#六mybatis)
        * [#{} 和 ${} 的区别](#-和--的区别)
        * [Mapper 接口为什么不需要实现类](#mapper-接口为什么不需要实现类)
        * [动态 SQL](#动态-sql)
        * [缓存](#缓存)
    * [七、Spring 中的设计模式](#七spring-中的设计模式)
    * [参考资料](#参考资料)
<!-- GFM-TOC -->


## 一、IoC 与 Bean

### IoC 与依赖注入

控制反转（Inversion of Control, IoC）指的是对象不再自己创建所依赖的对象，而是由容器创建好之后交给它。例如 OrderService 需要 OrderRepository，它不在内部 new 一个，而是声明自己需要，由 Spring 容器把创建好的对象传进来，这个过程称为依赖注入（Dependency Injection, DI）。

```java
@Service
public class OrderService {
    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {   // 构造器注入
        this.repository = repository;
    }
}
```

这样做的好处：

- 对象只依赖接口，替换实现、在测试中注入模拟对象都不需要修改代码；
- 对象的创建、作用域和生命周期由容器统一管理，事务、缓存这类功能也是容器在创建对象时织入的。

依赖注入有构造器注入、Setter 注入和字段注入（把 @Autowired 加在字段上）三种方式。Spring 官方推荐构造器注入：依赖可以声明为 final，对象创建出来就是完整可用的，缺少依赖时启动就会失败。

@Autowired 和 @Resource 都能注入依赖，区别在于查找的顺序：

- @Autowired 是 Spring 的注解，先按类型查找，找到多个时再按字段名或参数名匹配，仍然无法确定就报错，可以用 @Qualifier 指定 Bean 的名称，或者给其中一个 Bean 加 @Primary；
- @Resource 是 Jakarta EE（原 JSR-250）的注解，指定了 name 时按名称查找，否则先按字段名查找，找不到再按类型查找。

例如容器中有两个 PayService 类型的 Bean，名称分别是 alipay 和 wechat：

```java
@Resource PayService wechat;      // 注入名称为 wechat 的 Bean
@Autowired PayService alipay;     // 按类型找到两个，再按字段名匹配到 alipay
@Autowired PayService payService; // 字段名匹配不上，启动失败
```

第三行启动时报错 NoUniqueBeanDefinitionException: expected single matching bean but found 2: alipay,wechat。

### Bean 的生命周期

一个单例 Bean 从创建到销毁会经过以下步骤：

1. 实例化：调用构造函数创建对象；
2. 属性填充：注入依赖；
3. Aware 回调：例如 BeanNameAware 把 Bean 的名字传给它；
4. BeanPostProcessor 的 postProcessBeforeInitialization()；
5. 初始化：依次调用 @PostConstruct 方法、InitializingBean 的 afterPropertiesSet() 和配置的 init-method；
6. BeanPostProcessor 的 postProcessAfterInitialization()，AOP 就是在这一步把 Bean 替换为代理对象的；
7. 容器关闭时销毁：依次调用 @PreDestroy 方法、DisposableBean 的 destroy() 和配置的 destroy-method。

让一个 Bean 实现上面所有的回调，实际运行打印的顺序如下：

```text
1 构造函数
2 依赖注入
3 BeanNameAware: orderService
4 BeanPostProcessor before
5 @PostConstruct
6 afterPropertiesSet
7 init-method
8 BeanPostProcessor after
9 @PreDestroy
10 DisposableBean.destroy
```

### Bean 的作用域与线程安全

Bean 默认是单例（singleton）的，整个容器中只有一个对象，所有请求共用它。其它常用的作用域：

- prototype：每次从容器获取都创建一个新对象，容器创建之后就不再管理它，不会调用它的销毁方法；
- request、session：每个 HTTP 请求或会话一个对象，只能在 Web 应用中使用。

多个线程同时使用一个单例 Bean 时，Spring 不做任何同步，它是否线程安全取决于有没有可变的成员变量。Controller、Service 通常只持有其他 Bean 的引用，不保存与请求有关的数据，所以是安全的；一旦把请求中的数据存到成员变量里，不同请求就会互相覆盖。例如：

```java
@RestController
public class CounterController {
    private int count = 0;                    // 所有请求共享

    @GetMapping("/count")
    public int count() { return ++count; }    // ++ 不是原子操作
}
```

在本机用 64 个线程并发请求 1 万次，计数只增加了 9975，丢失了 25 次更新。解决方法是不在单例中保存状态，把数据放在方法的局部变量中；确实需要共享时使用 AtomicInteger 等线程安全的类，每个线程各自的数据放在 ThreadLocal 中。

需要注意的是，把 prototype 的 Bean 注入到单例中，只会在创建单例时注入一次，之后每次使用的都是同一个对象。需要每次得到新对象时，注入 ObjectProvider 并在使用时调用 getObject()。

### 循环依赖

循环依赖指的是两个 Bean 互相依赖，例如 A 依赖 B，B 又依赖 A。

对于通过字段或者 Setter 注入的单例 Bean，Spring 通过提前暴露还没有初始化完成的对象来解决。DefaultSingletonBeanRegistry 中有三个缓存：

- 一级缓存 singletonObjects：初始化完成的 Bean；
- 二级缓存 earlySingletonObjects：提前暴露的、还没有初始化完成的 Bean；
- 三级缓存 singletonFactories：用于生成提前引用的工厂。

<div align="center"> <img src="pics/spring-circular.png" width="720px"/> </div><br>

需要三级缓存而不是两级，是因为 A 可能需要被 AOP 代理，而代理正常是在初始化的最后一步才创建的。三级缓存中的工厂被调用时，会判断 A 是否需要代理，需要的话提前创建代理返回给 B，之后初始化完成时不再重复创建。这样 B 拿到的对象与最终放入容器的对象是同一个；没有循环依赖时工厂不会被调用，代理仍按正常流程创建。

以下情况无法解决，启动时抛出 BeanCurrentlyInCreationException：

- 构造器注入的循环依赖：创建 A 时必须先有 B，A 还没有实例化，没有可以提前暴露的对象；
- 原型（prototype）作用域的 Bean：每次获取都创建新对象，不会放入缓存。

需要注意的是，Spring Boot 2.6 起默认禁止循环依赖，出现时直接启动失败，设置 spring.main.allow-circular-references=true 才能恢复。循环依赖通常说明职责划分有问题，更好的做法是调整依赖关系。

## 二、AOP

### 动态代理

面向切面编程（Aspect-Oriented Programming, AOP）用于把日志、事务、权限校验这类分散在各处的逻辑从业务代码中抽离出来。Spring AOP 基于动态代理实现：容器中保存的不是原始对象，而是代理对象，调用方法时先执行代理中的切面逻辑，再调用原始对象的方法。

两种代理方式：

- JDK 动态代理：目标类实现了接口时可以使用，代理类实现同样的接口，只能代理接口中的方法；
- CGLIB：在运行时生成目标类的子类，通过重写方法来代理，因此 final 类、final 方法和 private 方法无法被代理。

Spring Framework 在目标类实现了接口时默认使用 JDK 动态代理；Spring Boot 默认使用 CGLIB，可以通过 spring.aop.proxy-target-class 修改。

JDK 动态代理的原理可以用下面的代码说明，切面逻辑写在 InvocationHandler 中：

```java
public interface OrderService {
    void create();
}

OrderService target = () -> System.out.println("创建订单");
OrderService proxy = (OrderService) Proxy.newProxyInstance(
        OrderService.class.getClassLoader(),
        new Class<?>[]{OrderService.class},
        (p, method, args) -> {
            System.out.println("开启事务");
            Object result = method.invoke(target, args);
            System.out.println("提交事务");
            return result;
        });
proxy.create();
```

```text
开启事务
创建订单
提交事务
```

### 自调用

代理只能拦截从外部经过代理的调用。在目标对象内部调用自己的另一个方法时，等价于 this.inner()，调用的是原始对象，不经过代理，切面不会生效：

<div align="center"> <img src="pics/spring-aop-proxy.png" width="680px"/> </div><br>

```java
@Service
public class OrderService {
    public void outer() {
        inner();             // 自调用，inner() 上的事务不生效
    }

    @Transactional
    public void inner() {
    }
}
```

这是 @Transactional、@Async、@Cacheable 等注解失效最常见的原因。解决方法是把被调用的方法移到另一个 Bean 中，或者注入自身的代理，通过代理调用。

## 三、事务

### 声明式事务

@Transactional 同样基于 AOP 实现：代理在方法执行前开启事务，方法正常返回时提交，抛出异常时回滚。

需要注意的是，默认只有 RuntimeException 和 Error 会触发回滚，受检异常（例如 IOException）不会回滚，需要通过 rollbackFor 指定。

### 传播行为

传播行为指的是一个事务方法调用另一个事务方法时，事务如何传递。常用的有以下三种：

- REQUIRED：默认值，当前有事务就加入，没有就新建。内外两个方法属于同一个事务，一起提交或者一起回滚；
- REQUIRES_NEW：挂起当前事务，新建一个独立的事务，两个事务分别提交和回滚，例如无论业务成功与否都要保存的操作日志；
- NESTED：在当前事务中创建一个保存点，内层回滚时只回滚到保存点，外层回滚时内层也一起回滚。

REQUIRED 有一个常见的问题：内层方法抛出异常后，即使外层捕获了这个异常，整个事务也已经被标记为只能回滚，外层方法结束时事务回滚，并抛出 UnexpectedRollbackException。

### 事务失效

事务不生效的常见原因：

- 自调用：同一个类中的方法互相调用，不经过代理；
- 方法无法被代理：final 方法、static 方法和 private 方法；Spring 6.0 之前，非 public 方法上的注解也会被忽略；
- 异常被吞掉：方法内部捕获了异常而没有重新抛出，代理认为方法正常结束，提交了事务；
- 抛出的是受检异常，而没有配置 rollbackFor；
- 对象不是由 Spring 管理的，例如自己 new 出来的对象；
- 在新线程中操作数据库：事务绑定在当前线程上，其它线程中的操作不属于这个事务；
- 数据库不支持事务，例如 MySQL 的 MyISAM 引擎。

## 四、Spring Boot 自动配置

Spring Boot 在 Spring 的基础上提供了自动配置和 starter：starter 把一组常用的依赖打包在一起，例如 spring-boot-starter-web 引入了 Spring MVC、内嵌的 Tomcat 和 JSON 库；自动配置则根据引入的依赖自动创建所需的 Bean，不需要手动配置就能启动一个 Web 应用。

Spring Boot 并不是新的框架，容器、AOP、事务仍然是 Spring 提供的。除了 starter 和自动配置，它还能把应用连同内嵌的服务器打包成一个 jar，用 java -jar 直接运行，不再需要把 war 包部署到单独安装的 Tomcat 中。

自动配置的过程：

1. 启动类上的 @SpringBootApplication 包含了 @EnableAutoConfiguration；
2. 启动时读取所有 jar 包中的 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports 文件，得到自动配置类的列表，Spring Boot 2.7 之前写在 META-INF/spring.factories 中；
3. 每个自动配置类都带有条件注解，条件满足时才生效。例如 @ConditionalOnClass 要求类路径上存在某个类，@ConditionalOnMissingBean 要求用户没有定义同类型的 Bean，@ConditionalOnProperty 根据配置项决定。

例如引入 spring-boot-starter-jdbc 和数据库驱动后，数据源的自动配置类就会生效，按配置文件中的地址创建一个 DataSource；如果用户自己定义了 DataSource，由于 @ConditionalOnMissingBean，自动配置不再创建。因此用户的配置总是优先于自动配置。

## 五、Spring MVC

### 请求的处理过程

所有请求都先交给一个 DispatcherServlet，由它的 doDispatch 方法完成分发：

1. 通过 HandlerMapping 找到处理这个请求的方法（Handler），以及要经过的拦截器，组成 HandlerExecutionChain；
2. 依次执行拦截器的 preHandle，任何一个返回 false 就不再继续；
3. 通过 HandlerAdapter 调用 Controller 的方法，调用前把请求参数转换为方法参数，调用后把返回值转换为响应，例如用 Jackson 把对象写成 JSON；
4. 倒序执行拦截器的 postHandle；
5. 返回的是视图名时，由 ViewResolver 找到视图并渲染；@RestController 直接把返回值写入响应体，没有这一步；
6. 倒序执行拦截器的 afterCompletion，即使前面发生了异常也会执行，常用于清理资源。

在 Spring Boot 3.3（Spring MVC 6.1）中注册一个打印日志的拦截器，请求 GET /orders?userId=1024 时依次输出：

```text
[interceptor] preHandle /orders handler=demo.App$OrderController#list(int)
[controller] OrderController.list(1024)
[interceptor] postHandle
[interceptor] afterCompletion status=200
```

拦截器与过滤器（Filter）的区别：过滤器是 Servlet 规范定义的，在请求进入 DispatcherServlet 之前执行，拿不到要调用哪个 Controller 方法；拦截器由 Spring MVC 调用，可以拿到 Handler，并且能使用 Spring 容器中的 Bean。

## 六、MyBatis

### #{} 和 ${} 的区别

MyBatis 中 #{} 会被替换为占位符 ?，参数通过 PreparedStatement 单独传给数据库；${} 则是把参数直接拼接到 SQL 字符串中。用 ${} 时，传入的参数会改变 SQL 的结构，造成 SQL 注入：

```java
@Select("SELECT id, user_id AS userId, status FROM orders WHERE user_id = #{userId} ORDER BY id LIMIT 3")
List<Order> byUser(@Param("userId") int userId);

@Select("SELECT id, user_id AS userId, status FROM orders WHERE user_id = ${userId} ORDER BY id LIMIT 3")
List<Order> byUserUnsafe(@Param("userId") String userId);
```

参数传入 1024 OR 1=1 时，MyBatis 输出的 SQL 分别为：

```text
==>  Preparing: SELECT ... WHERE user_id = ? ORDER BY id LIMIT 3
==> Parameters: 1024(Integer)

==>  Preparing: SELECT ... WHERE user_id = 1024 OR 1=1 ORDER BY id LIMIT 3
==> Parameters:
```

第二条语句的条件恒为真，返回了其他用户的订单。${} 只用于表名、列名、ORDER BY 的字段这类不能使用占位符的地方，并且要用白名单校验参数。

### Mapper 接口为什么不需要实现类

MyBatis 在启动时为每个 Mapper 接口生成 JDK 动态代理，例如上面的 OrderMapper 注入的对象类型是 jdk.proxy2.$Proxy63，调用处理器是 MapperProxy。调用接口方法时，MapperProxy 按“接口全名 + 方法名”找到对应的 SQL，绑定参数后交给 SqlSession 执行，再把结果映射成返回类型。

### 动态 SQL

XML 中可以用 if、where、foreach 等标签按参数拼接 SQL：

```xml
<select id="search" resultType="demo.App$Order">
  SELECT id, user_id AS userId, status FROM orders
  <where>
    <if test="userId != null">AND user_id = #{userId}</if>
    <if test="status != null">AND status = #{status}</if>
  </where>
</select>
```

只传 status 时生成 WHERE status = ?，两个都传时生成 WHERE user_id = ? AND status = ?，where 标签会去掉开头多余的 AND。

### 缓存

- 一级缓存：默认开启，作用范围是一个 SqlSession，同一个会话中相同的查询只执行一次，执行增删改或提交后清空。与 Spring 集成时，不在事务中的每次调用都会使用新的 SqlSession，一级缓存基本不起作用；
- 二级缓存：需要在 Mapper 中配置 cache 才开启，多个会话共享，但缓存在单个应用的内存中，多个实例之间不一致，实际项目中很少使用，通常用 Redis 等缓存代替。

## 七、Spring 中的设计模式

| 模式 | Spring 中的例子 | 解决的问题 |
| --- | --- | --- |
| [工厂](设计模式%20-%20工厂方法.md) | BeanFactory、FactoryBean | 使用者只按名称或类型获取对象，不关心对象怎样创建 |
| [单例](设计模式%20%20-%20单例.md) | 默认的 singleton 作用域，由 DefaultSingletonBeanRegistry 保存 | 每个 Bean 在容器中只有一个对象，不是通过私有构造函数实现的 |
| [代理](设计模式%20-%20代理.md) | AOP 的 JdkDynamicAopProxy、CglibAopProxy | 在不修改原类的情况下加入事务、日志等逻辑，见 [动态代理](#动态代理) |
| [模板方法](设计模式%20-%20模板方法.md) | JdbcTemplate、TransactionTemplate、AbstractApplicationContext 的 refresh() | 固定的步骤（获取连接、执行、释放、处理异常）由框架完成，变化的部分由使用者传入 |
| [观察者](设计模式%20-%20观察者.md) | ApplicationEvent、ApplicationListener、@EventListener | 发布方不需要知道有哪些接收方 |
| [适配器](设计模式%20-%20适配器.md) | Spring MVC 的 HandlerAdapter | DispatcherServlet 用同一个接口调用不同形式的处理器，见 [请求的处理过程](#请求的处理过程) |
| [责任链](设计模式%20-%20责任链.md) | HandlerExecutionChain 中的拦截器、AOP 的 ReflectiveMethodInvocation | 多个拦截器或通知依次处理同一个请求 |
| [策略](设计模式%20-%20策略.md) | InstantiationStrategy、Resource 的多种实现 | 同一件事有多种做法，运行时选择其中一种 |

以观察者模式为例，订单支付成功后需要加积分、发短信，用事件解耦后，订单服务只负责发布事件：

```java
public record OrderPaidEvent(long orderId) {}

publisher.publishEvent(new OrderPaidEvent(1024));      // 订单服务，publisher 是注入的 ApplicationEventPublisher

@EventListener
public void on(OrderPaidEvent e) { ... }               // 积分服务、短信服务各写一个监听方法
```

需要注意的是，监听方法默认在发布事件的线程中同步执行。在 Spring Boot 3.3 中让短信服务的监听方法抛出异常，输出如下：

```text
[main] 订单 1024 支付成功，发布事件
[main] 短信服务：发送失败
[main] 发布方收到异常：短信网关超时
```

两个监听方法都在 main 线程中执行；短信服务先执行并抛出异常后，积分服务的监听方法没有被调用，异常还传回了订单服务。监听方法之间的顺序默认不确定，可以用 @Order 指定；不希望互相影响时，加上 @Async 让监听方法在线程池中异步执行，或者用 @TransactionalEventListener 在订单的事务提交之后再处理。

## 参考资料

- [Spring Framework: Dependency Injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)
- [Spring Framework: Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Spring Framework: Container Extension Points](https://docs.spring.io/spring-framework/reference/core/beans/factory-extension.html)
- [Spring Framework: Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [Spring Framework: Using @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring Framework: Transaction Propagation](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)
- [Spring Framework 源码：DefaultSingletonBeanRegistry](https://github.com/spring-projects/spring-framework/blob/main/spring-beans/src/main/java/org/springframework/beans/factory/support/DefaultSingletonBeanRegistry.java)
- [Spring Boot: Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html)
- [Spring Boot 2.6 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.6-Release-Notes)
- [Spring Boot 2.7 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.7-Release-Notes)
- [MyBatis 3 文档](https://mybatis.org/mybatis-3/zh_CN/index.html)
- [DispatcherServlet | Spring Framework 文档](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
