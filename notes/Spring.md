# Spring
<!-- GFM-TOC -->
* [Spring](#spring)
    * [一、IoC 与 Bean](#一ioc-与-bean)
        * [IoC 与依赖注入](#ioc-与依赖注入)
        * [Bean 的生命周期](#bean-的生命周期)
        * [循环依赖](#循环依赖)
    * [二、AOP](#二aop)
        * [动态代理](#动态代理)
        * [自调用](#自调用)
    * [三、事务](#三事务)
        * [声明式事务](#声明式事务)
        * [传播行为](#传播行为)
        * [事务失效](#事务失效)
    * [四、Spring Boot 自动配置](#四spring-boot-自动配置)
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

自动配置的过程：

1. 启动类上的 @SpringBootApplication 包含了 @EnableAutoConfiguration；
2. 启动时读取所有 jar 包中的 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports 文件，得到自动配置类的列表，Spring Boot 2.7 之前写在 META-INF/spring.factories 中；
3. 每个自动配置类都带有条件注解，条件满足时才生效。例如 @ConditionalOnClass 要求类路径上存在某个类，@ConditionalOnMissingBean 要求用户没有定义同类型的 Bean，@ConditionalOnProperty 根据配置项决定。

例如引入 spring-boot-starter-jdbc 和数据库驱动后，数据源的自动配置类就会生效，按配置文件中的地址创建一个 DataSource；如果用户自己定义了 DataSource，由于 @ConditionalOnMissingBean，自动配置不再创建。因此用户的配置总是优先于自动配置。

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
