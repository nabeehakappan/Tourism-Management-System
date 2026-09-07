CREATE OR REPLACE VIEW V_TOURIST_DETAILS AS
SELECT
    Tourist_ID,
    First_Name,
    Middle_Name,
    Last_Name,
    Gender,
    Date_of_Birth,
    Nationality,
    Email,
    SUBSTR(Email, INSTR(Email, '@') + 1) AS Email_Domain,
    Street,
    City,
    State,
    PIN,
    Guide_ID
FROM TOURIST;
CREATE OR REPLACE VIEW V_BOOKING_DETAILS AS
SELECT
    b.Booking_ID,
    t.First_Name || ' ' || t.Last_Name AS Tourist_Name,
    p.Package_Name,
    p.Destination_City,
    p.Destination_Country,
    p.Duration AS Total_Days,
    b.Booking_Date,
    b.Travel_Date,
    b.Number_of_People,
    b.Payment_Status,
    b.Total_Amount,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name
FROM BOOKING b
JOIN TOURIST t
    ON b.Tourist_ID = t.Tourist_ID
JOIN TOUR_PACKAGE p
    ON b.Package_ID = p.Package_ID
LEFT JOIN GUIDE g
    ON p.Guide_ID = g.Guide_ID;
CREATE OR REPLACE VIEW V_GUIDE_DETAILS AS
SELECT
    g.Guide_ID,
    g.First_Name,
    g.Last_Name,
    g.Phone_No,
    g.Email,
    g.Experience_Years,
    r.Rating
FROM GUIDE g
LEFT JOIN REVIEW r
    ON g.Guide_ID = r.Guide_ID;
CREATE OR REPLACE VIEW V_PACKAGE_DETAILS AS
SELECT
    p.Package_ID,
    p.Package_Name,
    p.Destination_City,
    p.Destination_State,
    p.Destination_Country,
    p.Duration,
    p.Price,
    p.Package_Type,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name
FROM TOUR_PACKAGE p
LEFT JOIN GUIDE g
    ON p.Guide_ID = g.Guide_ID;
CREATE OR REPLACE VIEW V_TOURIST_GUIDE AS
SELECT
    t.Tourist_ID,
    t.First_Name || ' ' || t.Last_Name AS Tourist_Name,
    t.Nationality,
    t.Email,
    g.Guide_ID,
    g.First_Name || ' ' || g.Last_Name AS Guide_Name,
    g.Experience_Years
FROM TOURIST t
LEFT JOIN GUIDE g
    ON t.Guide_ID = g.Guide_ID;