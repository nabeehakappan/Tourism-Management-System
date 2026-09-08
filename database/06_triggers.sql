-- ============================================================
-- TRAVELIA - TOURISM MANAGEMENT SYSTEM
-- 06_triggers.sql
-- Database: Oracle 11g
-- ============================================================

-- ============================================================
-- TRIGGER 1
-- Automatically calculate Total_Amount for a booking
-- based on Package Price x Number_of_People.
-- ============================================================

CREATE OR REPLACE TRIGGER trg_booking_total_amount
BEFORE INSERT OR UPDATE OF Package_ID, Number_of_People
ON BOOKING
FOR EACH ROW
DECLARE
    v_price TOUR_PACKAGE.Price%TYPE;
BEGIN
    SELECT Price
    INTO v_price
    FROM TOUR_PACKAGE
    WHERE Package_ID = :NEW.Package_ID;

    :NEW.Total_Amount := v_price * :NEW.Number_of_People;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(
            -20001,
            'Invalid Package ID. Package does not exist.'
        );
END;
/

-- ============================================================
-- TRIGGER 2
-- Validate booking dates.
-- Travel_Date must not be earlier than Booking_Date.
-- ============================================================

CREATE OR REPLACE TRIGGER trg_booking_date_check
BEFORE INSERT OR UPDATE OF Booking_Date, Travel_Date
ON BOOKING
FOR EACH ROW
BEGIN
    IF :NEW.Travel_Date < :NEW.Booking_Date THEN
        RAISE_APPLICATION_ERROR(
            -20002,
            'Travel date cannot be earlier than booking date.'
        );
    END IF;
END;
/

-- ============================================================
-- TRIGGER 3
-- Validate review rating.
-- Rating must be between 1 and 5.
-- ============================================================

CREATE OR REPLACE TRIGGER trg_review_rating_check
BEFORE INSERT OR UPDATE OF Rating
ON REVIEW
FOR EACH ROW
BEGIN
    IF :NEW.Rating < 1 OR :NEW.Rating > 5 THEN
        RAISE_APPLICATION_ERROR(
            -20003,
            'Review rating must be between 1 and 5.'
        );
    END IF;
END;
/

-- ============================================================
-- VERIFY TRIGGERS
-- ============================================================

SELECT Trigger_Name,
       Triggering_Event,
       Status
FROM USER_TRIGGERS
WHERE Table_Name IN ('BOOKING', 'REVIEW')
ORDER BY Table_Name, Trigger_Name;

-- ============================================================
-- END OF 06_triggers.sql
-- ============================================================

