# Spring & Spring Boot Cheat Sheet

This is a condensed version of the most important concepts from:
- https://www.marcobehler.com/guides/spring-framework
- https://www.marcobehler.com/guides/spring-boot-autoconfiguration

---

## 1) What is Spring?

Spring Framework is primarily a dependency injection container and a set of convenience libraries built around it.

At its core:
- It manages object creation and wiring.
- It lets you declare dependencies instead of manually constructing them.
- It provides extra features such as web MVC, transactions, JDBC support, AOP, security, testing, etc.

### Core idea: Inversion of Control (IoC)
Instead of your class doing `new` and manually wiring dependencies, Spring creates and injects them for you.

### Dependency Injection (DI)
A class declares what it needs, and Spring provides it.

Example:
```java
@Component
public class UserDao {
    private final DataSource dataSource;

    public UserDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }
}
```

Spring will provide the `DataSource` bean automatically.

---

## 2) Spring Core Concepts

### ApplicationContext
`ApplicationContext` is the main Spring container. It is the place where beans are created and managed.

Common implementations:
- `AnnotationConfigApplicationContext`
- `ClassPathXmlApplicationContext`
- `WebApplicationContext`

### Bean
A Spring bean is an object managed by the Spring container.

### @Configuration
Marks a class as a Spring configuration class.

```java
@Configuration
public class AppConfig {
    @Bean
    public DataSource dataSource() {
        return new HikariDataSource();
    }
}
```

### @Bean
Defines a bean explicitly in configuration.

```java
@Bean
public UserService userService() {
    return new UserService();
}
```

### @Component
Marks a class for component scanning so Spring can create it as a bean.

```java
@Component
public class UserService {
}
```

### @ComponentScan
Tells Spring to scan packages for classes annotated with `@Component` and related annotations like `@Service`, `@Repository`, `@Controller`.

```java
@Configuration
@ComponentScan(basePackages = "com.example")
public class AppConfig {
}
```

### @Autowired
Injects dependencies into a bean.

Modern Spring usually prefers constructor injection.

```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

### Constructor vs Field vs Setter Injection
- Constructor injection: best for required dependencies, clear and testable
- Setter injection: useful for optional dependencies
- Field injection: simple but less explicit and less test-friendly

Best practice:
- Prefer constructor injection in most cases.

---

## 3) Bean Scopes

Beans can be created with different scopes.

Common scopes:
- singleton (default): one instance per Spring container
- prototype: new instance each time requested
- request: one bean per HTTP request
- session: one bean per HTTP session

```java
@Bean
@Scope("prototype")
public UserService userService() {
    return new UserService();
}
```

Note:
- Most app beans are singleton by default.
- Prototype beans have special caveats when injected into singleton beans.

---

## 4) AOP and Proxies

Spring uses AOP heavily under the hood.

### Why proxies?
Because Spring often needs to add behavior without modifying the target class directly.

Example: `@Transactional`

```java
@Service
public class PaymentService {

    @Transactional
    public void transferMoney() {
        // database work
    }
}
```

Spring creates a proxy around the service bean and adds transaction behavior before/after the method call.

### Common AOP patterns
- `@Transactional`
- Spring Security annotations
- custom aspect annotations

### Proxy types
- JDK dynamic proxy for interfaces
- CGLIB proxy for classes without interfaces

---

## 5) Spring Environment and Properties

### Environment
`Environment` provides access to application properties and profiles.

```java
@Autowired
private Environment environment;

String dbUrl = environment.getProperty("spring.datasource.url");
```

### @PropertySource
Lets us add custom property sources.

```java
@Configuration
@PropertySource("classpath:application.properties")
public class AppConfig {
}
```

### @Value
Injects values from properties.

```java
@Component
public class PaymentService {
    @Value("${paypal.password}")
    private String password;
}
```

### Resource abstraction
Spring can read files from classpath, file system, HTTP, etc. through the `Resource` abstraction.

```java
Resource resource = ctx.getResource("classpath:templates/user.sql");
```

---

## 6) What is Spring Boot?

Spring Boot is Spring Framework + opinionated defaults + auto-configuration.

It is built to reduce boilerplate and let you start quickly.

### Real value of Boot
Boot automatically does common setup like:
- load application properties
- create embedded Tomcat/Jetty server
- enable MVC support
- configure DataSource if present
- configure logging, JSON serializers, security, etc.

### Spring Boot main entry point
```java
@SpringBootApplication
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

`@SpringBootApplication` is roughly a combination of:
- `@Configuration`
- `@EnableAutoConfiguration`
- `@ComponentScan`

---

## 7) Spring Boot Auto-Configuration

This is the heart of Spring Boot.

### Principle
Spring Boot reads auto-config classes and registers them conditionally.

It checks things like:
- Is a dependency on the classpath?
- Is a property set?
- Is there already a user-defined bean?

### Key conditional annotations
These are the most important ones:

- `@ConditionalOnClass`
- `@ConditionalOnProperty`
- `@ConditionalOnMissingBean`
- `@ConditionalOnBean`
- `@ConditionalOnMissingClass`
- `@ConditionalOnWebApplication`

Example:
```java
@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnProperty(name = "spring.datasource.url")
public class DataSourceAutoConfiguration {
}
```

This means:
- If the JDBC class exists and a datasource URL property is set, Spring Boot creates the datasource bean.
- If the user already defined their own bean, Boot skips creating one.

### Why this matters
Spring Boot is basically a set of `@Configuration` classes guarded by conditions. That is the “magic” behind auto-config.

---

## 8) spring.factories and AutoConfiguration Loading

Spring Boot includes an autoconfigure library (`spring-boot-autoconfigure`).

Inside it, there is a file like:
```properties
META-INF/spring.factories
```

That file lists auto-config classes to load.

Example conceptually:
```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration,\
...
```

Spring Boot reads this file at startup and tries to evaluate all listed auto-configurations.

---

## 9) Spring Boot Starters

Starters are dependency bundles that pull in related libraries.

Examples:
- `spring-boot-starter-web` → web app + Tomcat + MVC + JSON support
- `spring-boot-starter-data-jpa` → JPA/Hibernate
- `spring-boot-starter-security`
- `spring-boot-starter-test`

They reduce manual dependency management.

### Example
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

This transitively brings in:
- Spring MVC
- embedded Tomcat
- Jackson
- validation, logging, etc.

---

## 10) Embedded Servers and Boot Startup

With Boot, you normally do not deploy a WAR into an external Tomcat.

Instead, Boot includes an embedded server and starts it for you.

If `tomcat-embed-core` is on the classpath, Boot can conditionally create and run an embedded server.

This is why a simple `main()` method can start a full web app.

---

## 11) Spring Boot Dependency Management

Boot uses a parent BOM/dependency management file to define versions of commonly used libraries.

This means you often do not need to write versions manually.

Example:
```xml
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-core</artifactId>
</dependency>
```

The version is provided by Boot’s dependency management.

This is one reason Boot feels “opinionated”: there is a curated set of compatible versions.

---

## 12) Fast Comparison: Spring vs Spring Boot

| Topic | Spring Framework | Spring Boot |
|---|---|---|
| Purpose | DI/container + ecosystem | Opinionated Spring setup |
| Configuration | Manual wiring and setup | Auto-config + starter dependencies |
| Server | Needs external or manual server config | Embedded server by default |
| Property loading | Manual `@PropertySource` or config | Auto-loads app properties |
| Dependency versions | You manage many versions | Managed via Boot BOM |
| Typical dev experience | More explicit, more boilerplate | Faster startup, less boilerplate |

---

## 13) Typical Interview Answers

### What is Spring?
Spring is a framework for building Java applications using dependency injection, configuration, and a large ecosystem of libraries. It helps manage object creation and common cross-cutting concerns.

### What is IoC?
Inversion of Control means objects don’t create or manage their dependencies themselves; the container does it for them.

### What is a bean?
A bean is an object created, configured, and managed by the Spring container.

### What is auto-configuration in Boot?
It is the mechanism where Spring Boot automatically creates beans and configures libraries based on the classpath, environment properties, and existing beans.

### What are the most important Boot conditions?
- `@ConditionalOnClass`
- `@ConditionalOnProperty`
- `@ConditionalOnMissingBean`
- `@ConditionalOnBean`

### Why use Spring Boot?
It reduces boilerplate, provides sensible defaults, manages dependency versions, and automatically configures common app components.

---

## 14) Minimal Example

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

@RestController
class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello from Spring Boot!";
    }
}
```

What happens behind the scenes:
- Boot scans for components
- Boot configures MVC
- Boot starts embedded Tomcat
- Boot exposes the `/hello` endpoint

---

## 15) Core Takeaways

- Spring Framework = core DI container + ecosystem of utilities
- Spring Boot = opinionated Spring setup on top of Spring Framework
- Beans are managed by the container
- `@Configuration` + `@Bean` and `@ComponentScan` are the main configuration patterns
- Auto-config relies heavily on conditional registration
- Boot reduces boilerplate by using starters and `spring.factories`

If you remember just one idea: Spring Boot does not replace Spring; it builds on Spring by automatically wiring sensible defaults for you.

---

## 16) Quick Memorization Checklist

Before an interview, remember these 10 items:
1. Spring is mainly a DI container.
2. `ApplicationContext` manages beans.
3. `@Bean` defines beans.
4. `@Component` + `@ComponentScan` enables scanning.
5. Constructor injection is preferred.
6. Bean scopes include singleton and prototype.
7. Proxies enable AOP (`@Transactional`).
8. `Environment` and `@Value` read properties.
9. Spring Boot uses auto-configuration and starters.
10. Boot adds opinionated defaults based on classpath + properties + conditions.

---
