<!-- GFM-TOC -->
* [175. Combine Two Tables](#175-combine-two-tables)
* [181. Employees Earning More Than Their Managers](#181-employees-earning-more-than-their-managers)
* [183. Customers Who Never Order](#183-customers-who-never-order)
* [184. Department Highest Salary](#184-department-highest-salary)
* [176. Second Highest Salary](#176-second-highest-salary)
* [177. Nth Highest Salary](#177-nth-highest-salary)
* [178. Rank Scores](#178-rank-scores)
* [180. Consecutive Numbers](#180-consecutive-numbers)
<!-- GFM-TOC -->


# 175. Combine Two Tables

https://leetcode.com/problems/combine-two-tables/description/

## Description

Person 表：

```html
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| PersonId    | int     |
| FirstName   | varchar |
| LastName    | varchar |
+-------------+---------+
PersonId is the primary key column for this table.
```

Address 表：

```html
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| AddressId   | int     |
| PersonId    | int     |
| City        | varchar |
| State       | varchar |
+-------------+---------+
AddressId is the primary key column for this table.
```

查找 FirstName, LastName, City, State 数据，而不管一个用户有没有填地址信息。

## SQL Schema

```sql
DROP TABLE
IF
    EXISTS Person;
CREATE TABLE Person ( PersonId INT, FirstName VARCHAR ( 255 ), LastName VARCHAR ( 255 ) );
DROP TABLE
IF
    EXISTS Address;
CREATE TABLE Address ( AddressId INT, PersonId INT, City VARCHAR ( 255 ), State VARCHAR ( 255 ) );
INSERT INTO Person ( PersonId, LastName, FirstName )
VALUES
    ( 1, 'Wang', 'Allen' );
INSERT INTO Address ( AddressId, PersonId, City, State )
VALUES
    ( 1, 2, 'New York City', 'New York' );
```

## Solution

使用左外连接。

```sql
SELECT
    FirstName,
    LastName,
    City,
    State
FROM
    Person AS P
    LEFT JOIN Address AS A ON P.PersonId = A.PersonId;
```

# 181. Employees Earning More Than Their Managers

https://leetcode.com/problems/employees-earning-more-than-their-managers/description/

## Description

Employee 表：

```html
+----+-------+--------+-----------+
| Id | Name  | Salary | ManagerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |
+----+-------+--------+-----------+
```

查找所有员工，他们的薪资大于其经理薪资。

## SQL Schema

```sql
DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee ( Id INT, NAME VARCHAR ( 255 ), Salary INT, ManagerId INT );
INSERT INTO Employee ( Id, NAME, Salary, ManagerId )
VALUES
    ( '1', 'Joe', '70000', '3' ),
    ( '2', 'Henry', '80000', '4' ),
    ( '3', 'Sam', '60000', NULL ),
    ( '4', 'Max', '90000', NULL );
```

## Solution

```sql
SELECT
    E1.NAME AS Employee
FROM
    Employee AS E1
    INNER JOIN Employee AS E2 ON E1.ManagerId = E2.Id
    AND E1.Salary > E2.Salary;
```

# 183. Customers Who Never Order

https://leetcode.com/problems/customers-who-never-order/description/

## Description

Curstomers 表：

```html
+----+-------+
| Id | Name  |
+----+-------+
| 1  | Joe   |
| 2  | Henry |
| 3  | Sam   |
| 4  | Max   |
+----+-------+
```

Orders 表：

```html
+----+------------+
| Id | CustomerId |
+----+------------+
| 1  | 3          |
| 2  | 1          |
+----+------------+
```

查找没有订单的顾客信息：

```html
+-----------+
| Customers |
+-----------+
| Henry     |
| Max       |
+-----------+
```

## SQL Schema

```sql
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers ( Id INT, NAME VARCHAR ( 255 ) );
DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders ( Id INT, CustomerId INT );
INSERT INTO Customers ( Id, NAME )
VALUES
    ( '1', 'Joe' ),
    ( '2', 'Henry' ),
    ( '3', 'Sam' ),
    ( '4', 'Max' );
INSERT INTO Orders ( Id, CustomerId )
VALUES
    ( '1', '3' ),
    ( '2', '1' );
```

## Solution

左外链接

```sql
SELECT
    C.NAME AS Customers
FROM
    Customers AS C
    LEFT JOIN Orders AS O ON C.Id = O.CustomerId
WHERE
    O.CustomerId IS NULL;
```

子查询

```sql
SELECT
    C.NAME AS Customers
FROM
    Customers AS C
WHERE
    C.Id NOT IN ( SELECT CustomerId FROM Orders );
```

# 184. Department Highest Salary

https://leetcode.com/problems/department-highest-salary/description/

## Description

Employee 表：

```html
+----+-------+--------+--------------+
| Id | Name  | Salary | DepartmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 70000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
+----+-------+--------+--------------+
```

Department 表：

```html
+----+----------+
| Id | Name     |
+----+----------+
| 1  | IT       |
| 2  | Sales    |
+----+----------+
```

查找一个 Department 中收入最高者的信息：

```html
+------------+----------+--------+
| Department | Employee | Salary |
+------------+----------+--------+
| IT         | Max      | 90000  |
| Sales      | Henry    | 80000  |
+------------+----------+--------+
```

## SQL Schema

```sql
DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee ( Id INT, NAME VARCHAR ( 255 ), Salary INT, DepartmentId INT );
DROP TABLE IF EXISTS Department;
CREATE TABLE Department ( Id INT, NAME VARCHAR ( 255 ) );
INSERT INTO Employee ( Id, NAME, Salary, DepartmentId )
VALUES
    ( 1, 'Joe', 70000, 1 ),
    ( 2, 'Henry', 80000, 2 ),
    ( 3, 'Sam', 60000, 2 ),
    ( 4, 'Max', 90000, 1 );
INSERT INTO Department ( Id, NAME )
VALUES
    ( 1, 'IT' ),
    ( 2, 'Sales' );
```

## Solution

创建一个临时表，包含了部门员工的最大薪资。可以对部门进行分组，然后使用 MAX() 汇总函数取得最大薪资。

之后使用连接将找到一个部门中薪资等于临时表中最大薪资的员工。

```sql
SELECT
    D.NAME AS Department,
    E.NAME AS Employee,
    E.Salary
FROM
    Employee AS E,
    Department AS D,
    ( SELECT DepartmentId, MAX( Salary ) AS Salary FROM Employee GROUP BY DepartmentId ) AS M 
WHERE
    E.DepartmentId = D.Id 
    AND E.DepartmentId = M.DepartmentId 
    AND E.Salary = M.Salary;
```

# 176. Second Highest Salary

https://leetcode.com/problems/second-highest-salary/description/

## Description

```html
+----+--------+
| Id | Salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
```

查找工资第二高的员工。

```html
+---------------------+
| SecondHighestSalary |
+---------------------+
| 200                 |
+---------------------+
```

如果没有找到，那么就返回 null 而不是不返回数据。

## SQL Schema

```sql
DROP TABLE
IF
    EXISTS Employee;
CREATE TABLE Employee ( Id INT, Salary INT );
INSERT INTO Employee ( Id, Salary )
VALUES
    ( '1', '100' ),
    ( '2', '200' ),
    ( '3', '300' );
```

## Solution

为了在没有查找到数据时返回 null，需要在查询结果外面再套一层 SELECT。

```sql
SELECT
    ( SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT 1, 1 ) AS SecondHighestSalary;
```

# 177. Nth Highest Salary

## Description

查找工资第 N 高的员工。

## SQL Schema

同 176。

## Solution

```sql
CREATE FUNCTION getNthHighestSalary ( N INT ) RETURNS INT BEGIN

SET N = N - 1;
RETURN ( SELECT ( SELECT DISTINCT Salary FROM Employee ORDER BY Salary DESC LIMIT N, 1 ) );

END
```

# 178. Rank Scores

https://leetcode.com/problems/rank-scores/description/

## Description

得分表：

```html
+----+-------+
| Id | Score |
+----+-------+
| 1  | 3.50  |
| 2  | 3.65  |
| 3  | 4.00  |
| 4  | 3.85  |
| 5  | 4.00  |
| 6  | 3.65  |
+----+-------+
```

将得分排序，并统计排名。

```html
+-------+------+
| Score | Rank |
+-------+------+
| 4.00  | 1    |
| 4.00  | 1    |
| 3.85  | 2    |
| 3.65  | 3    |
| 3.65  | 3    |
| 3.50  | 4    |
+-------+------+
```

## SQL Schema

```sql
DROP TABLE
IF
    EXISTS Scores;
CREATE TABLE Scores ( Id INT, Score DECIMAL ( 3, 2 ) );
INSERT INTO Scores ( Id, Score )
VALUES
    ( '1', '3.5' ),
    ( '2', '3.65' ),
    ( '3', '4.0' ),
    ( '4', '3.85' ),
    ( '5', '4.0' ),
    ( '6', '3.65' );
```

## Solution

```sql
SELECT
    S1.score,
    COUNT( DISTINCT S2.score ) AS Rank
FROM
    Scores AS S1
    INNER JOIN Scores AS S2 ON S1.score <= S2.score
GROUP BY
    S1.id
ORDER BY
    S1.score DESC;
```

# 180. Consecutive Numbers

https://leetcode.com/problems/consecutive-numbers/description/

## Description

数字表：

```html
+----+-----+
| Id | Num |
+----+-----+
| 1  |  1  |
| 2  |  1  |
| 3  |  1  |
| 4  |  2  |
| 5  |  1  |
| 6  |  2  |
| 7  |  2  |
+----+-----+
```

查找连续出现三次的数字。

```html
+-----------------+
| ConsecutiveNums |
+-----------------+
| 1               |
+-----------------+
```

## SQL Schema

```sql
DROP TABLE
IF
    EXISTS LOGS;
CREATE TABLE LOGS ( Id INT, Num INT );
INSERT INTO LOGS ( Id, Num )
VALUES
    ( '1', '1' ),
    ( '2', '1' ),
    ( '3', '1' ),
    ( '4', '2' ),
    ( '5', '1' ),
    ( '6', '2' ),
    ( '7', '2' );
```

## Solution

```sql
SELECT
    DISTINCT L1.num AS ConsecutiveNums
FROM
    Logs AS L1,
    Logs AS L2,
    Logs AS L3
WHERE L1.id = l2.id - 1
    AND L2.id = L3.id - 1
    AND L1.num = L2.num
    AND l2.num = l3.num;
```
