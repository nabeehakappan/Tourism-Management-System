/* =========================================================
   TRAVELIA - TOURISM MANAGEMENT SYSTEM
   05_queries.sql
   ========================================================= */


/* =========================================================
   1. DISPLAY ALL TOURISTS
   Simple SELECT
   ========================================================= */

SELECT *
FROM TOURIST;


/* =========================================================
   2. DISPLAY TOUR PACKAGES BY PRICE
   ORDER BY
   ========================================================= */

SELECT
    Package_ID,
    Package_Name,
    Destination_City,
    Destination_Country,
    Duration,
    Price
FROM TOUR_PACKAGE
ORDER BY Price DESC;


/* =========================================================
   3. FIND PAID BOOKINGS
   WHERE condition
   ========================================================= */

SELECT
    Booking_ID,
    Tourist_ID,
    Package_ID,
    Travel_Date,
    Number_of_People,
    Total_Amount
FROM BOOKING
WHERE Payment_Status = 'Paid';


/* =========================================================
   4. BOOKINGS WITH AMOUNT GREATER THAN 50,000
   Comparison operator
   ========================================================= */

SELECT
    Booking_ID,
    Tourist_ID,
    Package_ID,
    Total_Amount
FROM BOOKING
WHERE Total_Amount > 50000;


/* =========================================================
   5. DISPLAY TOURISTS FROM INDIA
   WHERE + string condition
   ========================================================= */

SELECT
    Tourist_ID,
    First_Name,
    Last_Name,
    Nationality,
    City
FROM TOURIST
WHERE Nationality = 'Indian';


/* =========================================================
   6. TOURISTS AND THEIR ASSIGNED GUIDES
   INNER JOIN
   ========================================================= */

SELECT
    t.Tourist_ID,
    t.First_Name || ' ' || t.Last_Name AS Tourist_Name,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name
FROM TOURIST t
JOIN GUIDE g
    ON t.Guide_ID = g.Guide_ID;


/* =========================================================
   7. BOOKINGS WITH TOURIST AND PACKAGE DETAILS
   Multiple-table JOIN
   ========================================================= */

SELECT
    b.Booking_ID,
    t.First_Name || ' ' || t.Last_Name AS Tourist_Name,
    p.Package_Name,
    p.Destination_City,
    b.Travel_Date,
    b.Number_of_People,
    b.Total_Amount,
    b.Payment_Status
FROM BOOKING b
JOIN TOURIST t
    ON b.Tourist_ID = t.Tourist_ID
JOIN TOUR_PACKAGE p
    ON b.Package_ID = p.Package_ID;


/* =========================================================
   8. PACKAGE AND ASSIGNED GUIDE
   JOIN
   ========================================================= */

SELECT
    p.Package_ID,
    p.Package_Name,
    p.Destination_City,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name
FROM TOUR_PACKAGE p
JOIN GUIDE g
    ON p.Guide_ID = g.Guide_ID;


/* =========================================================
   9. COUNT NUMBER OF TOURISTS
   Aggregate function
   ========================================================= */

SELECT COUNT(*) AS Total_Tourists
FROM TOURIST;


/* =========================================================
   10. TOTAL REVENUE FROM BOOKINGS
   SUM
   ========================================================= */

SELECT
    SUM(Total_Amount) AS Total_Revenue
FROM BOOKING;


/* =========================================================
   11. AVERAGE PACKAGE PRICE
   AVG
   ========================================================= */

SELECT
    AVG(Price) AS Average_Package_Price
FROM TOUR_PACKAGE;


/* =========================================================
   12. MOST EXPENSIVE PACKAGE
   MAX
   ========================================================= */

SELECT
    MAX(Price) AS Highest_Package_Price
FROM TOUR_PACKAGE;


/* =========================================================
   13. NUMBER OF BOOKINGS FOR EACH PAYMENT STATUS
   GROUP BY
   ========================================================= */

SELECT
    Payment_Status,
    COUNT(*) AS Number_of_Bookings
FROM BOOKING
GROUP BY Payment_Status;


/* =========================================================
   14. TOTAL REVENUE BY PAYMENT STATUS
   GROUP BY + SUM
   ========================================================= */

SELECT
    Payment_Status,
    SUM(Total_Amount) AS Total_Amount
FROM BOOKING
GROUP BY Payment_Status
ORDER BY Total_Amount DESC;


/* =========================================================
   15. NUMBER OF TOURISTS ASSIGNED TO EACH GUIDE
   GROUP BY + JOIN
   ========================================================= */

SELECT
    g.Guide_ID,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name,
    COUNT(t.Tourist_ID) AS Number_of_Tourists
FROM GUIDE g
LEFT JOIN TOURIST t
    ON g.Guide_ID = t.Guide_ID
GROUP BY
    g.Guide_ID,
    g.First_Name,
    g.Last_Name
ORDER BY Number_of_Tourists DESC;


/* =========================================================
   16. GUIDES WITH MORE THAN ONE TOURIST
   HAVING
   ========================================================= */

SELECT
    g.Guide_ID,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name,
    COUNT(t.Tourist_ID) AS Number_of_Tourists
FROM GUIDE g
JOIN TOURIST t
    ON g.Guide_ID = t.Guide_ID
GROUP BY
    g.Guide_ID,
    g.First_Name,
    g.Last_Name
HAVING COUNT(t.Tourist_ID) > 1;


/* =========================================================
   17. PACKAGES COSTING MORE THAN THE AVERAGE PACKAGE PRICE
   SUBQUERY
   ========================================================= */

SELECT
    Package_ID,
    Package_Name,
    Price
FROM TOUR_PACKAGE
WHERE Price > (
    SELECT AVG(Price)
    FROM TOUR_PACKAGE
)
ORDER BY Price DESC;


/* =========================================================
   18. TOURISTS WHO HAVE MADE MORE THAN ONE BOOKING
   SUBQUERY + GROUP BY
   ========================================================= */

SELECT
    Tourist_ID,
    First_Name,
    Last_Name
FROM TOURIST
WHERE Tourist_ID IN (
    SELECT Tourist_ID
    FROM BOOKING
    GROUP BY Tourist_ID
    HAVING COUNT(*) > 1
);


/* =========================================================
   19. BOOKINGS FOR THE MOST EXPENSIVE PACKAGE
   SUBQUERY
   ========================================================= */

SELECT
    b.Booking_ID,
    b.Tourist_ID,
    b.Package_ID,
    b.Total_Amount
FROM BOOKING b
WHERE b.Package_ID IN (
    SELECT Package_ID
    FROM TOUR_PACKAGE
    WHERE Price = (
        SELECT MAX(Price)
        FROM TOUR_PACKAGE
    )
);


/* =========================================================
   20. GUIDES WITH RATING 5
   JOIN
   ========================================================= */

SELECT
    g.Guide_ID,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name,
    r.Rating,
    r.Review_Text
FROM GUIDE g
JOIN REVIEW r
    ON g.Guide_ID = r.Guide_ID
WHERE r.Rating = 5;


/* =========================================================
   21. DISPLAY ALL GUIDE LANGUAGES
   JOIN
   ========================================================= */

SELECT
    g.Guide_ID,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name,
    gl.Language_Known
FROM GUIDE g
JOIN GUIDE_LANGUAGE gl
    ON g.Guide_ID = gl.Guide_ID
ORDER BY g.Guide_ID;


/* =========================================================
   22. PACKAGES WITH THEIR HIGHLIGHTS
   JOIN
   ========================================================= */

SELECT
    p.Package_ID,
    p.Package_Name,
    ph.Highlight
FROM TOUR_PACKAGE p
JOIN PACKAGE_HIGHLIGHT ph
    ON p.Package_ID = ph.Package_ID
ORDER BY p.Package_ID;


/* =========================================================
   23. BOOKINGS WITH SPECIAL REQUESTS
   JOIN
   ========================================================= */

SELECT
    b.Booking_ID,
    b.Tourist_ID,
    b.Payment_Status,
    bsr.Special_Request
FROM BOOKING b
JOIN BOOKING_SPECIAL_REQUEST bsr
    ON b.Booking_ID = bsr.Booking_ID
ORDER BY b.Booking_ID;


/* =========================================================
   24. TOURISTS WHO HAVE NO MIDDLE NAME
   IS NULL
   ========================================================= */

SELECT
    Tourist_ID,
    First_Name,
    Last_Name
FROM TOURIST
WHERE Middle_Name IS NULL;


/* =========================================================
   25. INTERNATIONAL TOUR PACKAGES
   WHERE
   ========================================================= */

SELECT
    Package_ID,
    Package_Name,
    Destination_City,
    Destination_Country,
    Price
FROM TOUR_PACKAGE
WHERE Destination_Country <> 'India';


/* =========================================================
   26. BOOKINGS WITH MORE THAN TWO PEOPLE
   WHERE
   ========================================================= */

SELECT
    Booking_ID,
    Tourist_ID,
    Number_of_People,
    Total_Amount
FROM BOOKING
WHERE Number_of_People > 2;


/* =========================================================
   27. PACKAGE COUNT BY PACKAGE TYPE
   GROUP BY
   ========================================================= */

SELECT
    Package_Type,
    COUNT(*) AS Number_of_Packages
FROM TOUR_PACKAGE
GROUP BY Package_Type
ORDER BY Number_of_Packages DESC;


/* =========================================================
   28. TOTAL PEOPLE TRAVELLING PER PACKAGE
   GROUP BY + SUM
   ========================================================= */

SELECT
    p.Package_Name,
    SUM(b.Number_of_People) AS Total_Travellers
FROM TOUR_PACKAGE p
JOIN BOOKING b
    ON p.Package_ID = b.Package_ID
GROUP BY p.Package_ID, p.Package_Name
ORDER BY Total_Travellers DESC;


/* =========================================================
   29. TOURISTS WHO HAVE A BOOKING
   EXISTS SUBQUERY
   ========================================================= */

SELECT
    t.Tourist_ID,
    t.First_Name,
    t.Last_Name
FROM TOURIST t
WHERE EXISTS (
    SELECT 1
    FROM BOOKING b
    WHERE b.Tourist_ID = t.Tourist_ID
);


/* =========================================================
   30. TOURISTS WHO HAVE NO BOOKINGS
   NOT EXISTS SUBQUERY
   ========================================================= */

SELECT
    t.Tourist_ID,
    t.First_Name,
    t.Last_Name
FROM TOURIST t
WHERE NOT EXISTS (
    SELECT 1
    FROM BOOKING b
    WHERE b.Tourist_ID = t.Tourist_ID
);


/* =========================================================
   31. UPCOMING BOOKINGS
   DATE COMPARISON
   ========================================================= */

SELECT
    Booking_ID,
    Tourist_ID,
    Package_ID,
    Travel_Date,
    Payment_Status
FROM BOOKING
WHERE Travel_Date > SYSDATE
ORDER BY Travel_Date;


/* =========================================================
   32. BOOKINGS MADE IN AUGUST 2026
   DATE FUNCTION
   ========================================================= */

SELECT
    Booking_ID,
    Tourist_ID,
    Booking_Date,
    Total_Amount
FROM BOOKING
WHERE EXTRACT(MONTH FROM Booking_Date) = 8
AND EXTRACT(YEAR FROM Booking_Date) = 2026;


/* =========================================================
   33. DISPLAY TOURIST EMAIL DOMAINS
   USING VIEW
   ========================================================= */

SELECT
    Tourist_ID,
    First_Name,
    Last_Name,
    Email,
    Email_Domain
FROM V_TOURIST_DETAILS;


/* =========================================================
   34. DISPLAY COMPLETE BOOKING DETAILS
   USING VIEW
   ========================================================= */

SELECT *
FROM V_BOOKING_DETAILS
ORDER BY Travel_Date;


/* =========================================================
   35. DISPLAY GUIDE DETAILS WITH DERIVED RATING
   USING VIEW
   ========================================================= */

SELECT *
FROM V_GUIDE_DETAILS
ORDER BY Rating DESC;


/* =========================================================
   36. DISPLAY PACKAGE DETAILS
   USING VIEW
   ========================================================= */

SELECT *
FROM V_PACKAGE_DETAILS
ORDER BY Price DESC;


/* =========================================================
   37. DISPLAY TOURISTS AND THEIR GUIDES
   USING VIEW
   ========================================================= */

SELECT *
FROM V_TOURIST_GUIDE
ORDER BY Guide_ID, Tourist_ID;