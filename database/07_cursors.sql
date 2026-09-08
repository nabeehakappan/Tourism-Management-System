
-- ============================================================
-- TRAVELIA - TOURISM MANAGEMENT SYSTEM
-- 07_cursors.sql
-- Database: Oracle 11g
-- ============================================================

SET SERVEROUTPUT ON;

-- ============================================================
-- CURSOR 1
-- Display guide details along with the number of bookings
-- associated with each guide.
--
-- This demonstrates an explicit cursor in PL/SQL.
-- ============================================================

DECLARE

    CURSOR c_guide_booking IS
        SELECT
            g.Guide_ID,
            g.First_Name,
            g.Last_Name,
            g.Experience_Years,
            COUNT(b.Booking_ID) AS Booking_Count
        FROM GUIDE g
        LEFT JOIN TOUR_PACKAGE p
            ON g.Guide_ID = p.Guide_ID
        LEFT JOIN BOOKING b
            ON p.Package_ID = b.Package_ID
        GROUP BY
            g.Guide_ID,
            g.First_Name,
            g.Last_Name,
            g.Experience_Years
        ORDER BY g.Guide_ID;

BEGIN

    DBMS_OUTPUT.PUT_LINE('==============================================');
    DBMS_OUTPUT.PUT_LINE('       TRAVELIA - GUIDE BOOKING REPORT');
    DBMS_OUTPUT.PUT_LINE('==============================================');

    FOR guide_record IN c_guide_booking
    LOOP

        DBMS_OUTPUT.PUT_LINE(
            'Guide ID: ' || guide_record.Guide_ID
        );

        DBMS_OUTPUT.PUT_LINE(
            'Name: ' ||
            guide_record.First_Name || ' ' ||
            guide_record.Last_Name
        );

        DBMS_OUTPUT.PUT_LINE(
            'Experience: ' ||
            guide_record.Experience_Years || ' years'
        );

        DBMS_OUTPUT.PUT_LINE(
            'Number of Bookings: ' ||
            guide_record.Booking_Count
        );

        DBMS_OUTPUT.PUT_LINE(
            '----------------------------------------------'
        );

    END LOOP;

END;
/

-- ============================================================
-- CURSOR 2
-- Display tourists and the total number of people they
-- have booked for across all their bookings.
--
-- This demonstrates another explicit cursor using
-- aggregate functions.
-- ============================================================

DECLARE

    CURSOR c_tourist_booking IS
        SELECT
            t.Tourist_ID,
            t.First_Name,
            t.Last_Name,
            COUNT(b.Booking_ID) AS Booking_Count,
            NVL(SUM(b.Number_of_People), 0) AS Total_People
        FROM TOURIST t
        LEFT JOIN BOOKING b
            ON t.Tourist_ID = b.Tourist_ID
        GROUP BY
            t.Tourist_ID,
            t.First_Name,
            t.Last_Name
        ORDER BY t.Tourist_ID;

BEGIN

    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('==============================================');
    DBMS_OUTPUT.PUT_LINE('      TRAVELIA - TOURIST BOOKING REPORT');
    DBMS_OUTPUT.PUT_LINE('==============================================');

    FOR tourist_record IN c_tourist_booking
    LOOP

        DBMS_OUTPUT.PUT_LINE(
            'Tourist ID: ' || tourist_record.Tourist_ID
        );

        DBMS_OUTPUT.PUT_LINE(
            'Name: ' ||
            tourist_record.First_Name || ' ' ||
            tourist_record.Last_Name
        );

        DBMS_OUTPUT.PUT_LINE(
            'Number of Bookings: ' ||
            tourist_record.Booking_Count
        );

        DBMS_OUTPUT.PUT_LINE(
            'Total People Booked: ' ||
            tourist_record.Total_People
        );

        DBMS_OUTPUT.PUT_LINE(
            '----------------------------------------------'
        );

    END LOOP;

END;
/

-- ============================================================
-- END OF 07_cursors.sql
-- ============================================================

