// For aggregations, we can use the GROUP BY clause in SQL 
// to group rows that have the same values in specified columns into summary rows.
// For example, if we have a table called "Sales" with columns "Product", "Region", and "Amount",
// we can use the GROUP BY clause to calculate the total sales amount for each product in each region.

SELECT Product, Region, SUM(Amount) AS TotalSales
FROM Sales
GROUP BY Product, Region;
// In this example, we are grouping the sales data by both Product and Region,
// and we are using the SUM() function to calculate the total sales amount for each group.
// The result will show the total sales for each product in each region.